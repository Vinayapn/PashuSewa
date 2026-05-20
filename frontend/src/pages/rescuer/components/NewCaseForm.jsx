import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, User, Info, Map as MapIcon, Crosshair, X } from 'lucide-react';
import { rescuerAPI } from '../../../services/api';
import MapView from '../../../components/MapView';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

export default function NewCaseForm({ setTab }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [locatingMe, setLocatingMe] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [formData, setFormData] = useState({
    title: '',
    animalType: 'Dog',
    urgency: 'Medium',
    description: '',
    address: '',
    landmark: '',
    reporterName: user?.name || '',
    reporterPhone: user?.phone || ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        reporterName: user.name || prev.reporterName,
        reporterPhone: user.phone || prev.reporterPhone
      }));
    }
  }, [user]);

  const animalTypes = ['Dog', 'Cat', 'Cow', 'Bird', 'Horse', 'Monkey', 'Other'];
  const urgencies = [
    { label: 'Low', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    { label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
    { label: 'High', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { label: 'Critical', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  ];

  // Handle map click — user selects a location on the map
  const handleLocationSelect = useCallback((lat, lng) => {
    setSelectedPosition({ lat, lng });
    // Reverse geocode to get address (using free Nominatim API)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(res => res.json())
      .then(data => {
        if (data.display_name) {
          setFormData(prev => ({ ...prev, address: data.display_name }));
        }
      })
      .catch(() => {
        // If reverse geocode fails, just set coords as address
        setFormData(prev => ({ ...prev, address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}` }));
      });
  }, []);

  // Handle "My Location" button
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocatingMe(true);
    toast.loading('Getting your location...', { id: 'locating' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setSelectedPosition({ lat, lng });
        setMapCenter({ lat, lng });
        setShowMap(true);
        setLocatingMe(false);
        toast.success('Location found!', { id: 'locating' });

        // Reverse geocode
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
          .then(res => res.json())
          .then(data => {
            if (data.display_name) {
              setFormData(prev => ({ ...prev, address: data.display_name }));
            }
          })
          .catch(() => {
            setFormData(prev => ({ ...prev, address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}` }));
          });
      },
      (error) => {
        setLocatingMe(false);
        let msg = 'Unable to retrieve your location';
        if (error.code === 1) msg = 'Location permission denied. Please allow location access.';
        else if (error.code === 2) msg = 'Location unavailable. Check your device settings.';
        else if (error.code === 3) msg = 'Location request timed out. Try again.';
        toast.error(msg, { id: 'locating' });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle "Show Map" button
  const handleShowMap = () => {
    setShowMap(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.address) {
      return toast.error('Please fill all required fields');
    }

    setLoading(true);
    try {
      const coordinates = selectedPosition 
        ? [selectedPosition.lng, selectedPosition.lat] 
        : [77.2090, 28.6139]; // Default to New Delhi if no position selected

      const payload = {
        title: formData.title,
        description: `[Animal: ${formData.animalType}] - ${formData.description}\n\nReporter: ${formData.reporterName} (${formData.reporterPhone})\nLandmark: ${formData.landmark}`,
        type: 'Medical',
        severity: formData.urgency,
        address: formData.address,
        coordinates: coordinates,
      };
      
      await rescuerAPI.createAlert(payload);
      toast.success('Rescue case reported successfully!');
      setTab('dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-full">
      <button 
        onClick={() => setTab('dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="font-medium">Back to Dashboard</span>
      </button>

      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-800">Report New Rescue Case</h1>
        <p className="text-gray-500">Fill in the details to report an animal in distress</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Animal Information */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              <Info size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Animal Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Case Title *</label>
              <input 
                type="text" 
                placeholder="e.g., Injured Dog on Highway"
                className="w-full p-2 mb-3 text-black bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="grid mb-3 grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Animal Type *</label>
                <div className="flex flex-wrap gap-2">
                  {animalTypes.map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setFormData({...formData, animalType: type})}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        formData.animalType === type 
                        ? 'bg-red-50 border-red-500 text-red-700 shadow-sm shadow-red-100' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Urgency Level *</label>
                <div className="grid grid-cols-2 gap-2">
                  {urgencies.map(u => (
                    <button
                      type="button"
                      key={u.label}
                      onClick={() => setFormData({...formData, urgency: u.label})}
                      className={`p-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition-all ${
                        formData.urgency === u.label 
                        ? `${u.bgColor} ${u.borderColor} ${u.textColor} shadow-sm` 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${u.color}`}></span>
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
              <textarea 
                rows="4"
                placeholder="Describe the animal's condition, injuries, behavior, and any other important details..."
                className="w-full p-4 text-black bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              ></textarea>
              <div className="text-right text-xs text-gray-400 mt-1">{formData.description.length}/500</div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <MapPin size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Location Details</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Address / Location *</label>
                <input 
                  type="text" 
                  placeholder="Street address, area, city"
                  className="w-full p-2 text-black mb-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <button 
                type="button" 
                onClick={handleMyLocation}
                disabled={locatingMe}
                className={`h-[48px] mt-auto mb-2 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${locatingMe ? 'opacity-60 cursor-wait' : ''}`}
              >
                {locatingMe ? (
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Crosshair size={18} />
                )}
                {locatingMe ? 'Locating...' : 'My Location'}
              </button>
              <button 
                type="button" 
                onClick={handleShowMap}
                className={`h-[48px] mt-auto mb-2 px-6 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                  showMap 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white shadow-gray-100' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'
                }`}
              >
                {showMap ? <X size={18} /> : <MapIcon size={18} />}
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>

            {/* Coordinates display */}
            {selectedPosition && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm">
                <MapPin size={16} className="text-blue-500" />
                <span className="text-blue-700 font-medium">
                  Selected: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                </span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nearby Landmark</label>
              <input 
                type="text" 
                placeholder="e.g., Near Metro Station, Opposite Big Bazaar"
                className="w-full p-2 text-black mb-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                value={formData.landmark}
                onChange={(e) => setFormData({...formData, landmark: e.target.value})}
              />
            </div>

            {/* Map Section */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Map Preview
                {showMap && (
                  <span className="font-normal text-gray-400 ml-2">— Click on the map to select a location, or drag the marker</span>
                )}
              </label>
              {showMap ? (
                <MapView 
                  height={350} 
                  center={mapCenter} 
                  alerts={[]} 
                  onLocationSelect={handleLocationSelect}
                  selectedPosition={selectedPosition}
                />
              ) : (
                <div 
                  className="w-full h-[200px] bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={handleShowMap}
                >
                  <div className="text-center">
                    <MapIcon size={48} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Click "Show Map" or here to select a location on the map</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reporter Contact */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Reporter Contact</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  className="w-full p-2 text-black pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  className="w-full p-2 text-black pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  value={formData.reporterPhone}
                  onChange={(e) => setFormData({...formData, reporterPhone: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button 
            type="submit"
            disabled={loading}
            className={`flex-1 bg-red-600 hover:bg-red-700 text-white p-2 mt-4 rounded-3xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-100 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Info size={20} />}
            Submit Report
          </button>
          <button 
            type="button"
            onClick={() => setTab('dashboard')}
            className="px-12 py-3 mt-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-3xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
