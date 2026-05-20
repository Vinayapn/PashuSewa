import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Award, Shield, Settings, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfileView() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Ravi Kumar',
    email: user?.email || 'ravi.rescuer@gmail.com',
    phone: user?.phone || '+91 98765 43210',
    location: (typeof user?.location === 'string' ? user.location : user?.address) || 'New Delhi, India',
    specialization: user?.specialization || 'Canine Rescue, Large Animal Emergency',
    certifications: user?.certifications || 'Welfare Certified Rescuer (Level 3)',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        location: typeof user.location === 'string' ? user.location : (user.address || prev.location),
        specialization: user.specialization || prev.specialization,
        certifications: user.certifications || prev.certifications,
      }));
    }
  }, [user]);

  const handleSave = () => {
    if (updateUser) {
      updateUser(formData);
    }
    // In a real app, this would call an API to update the user profile
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500">Manage your personal information and preferences</p>
        </div>
        {isEditing ? (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl transition-all shadow-sm"
            >
              <X size={18} />
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-[#2962FF] hover:bg-[#1E40AF] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-100"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-100"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-5xl font-bold mb-6 border-4 border-white shadow-md">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          
          {isEditing ? (
            <input 
              type="text" 
              className="w-full text-center text-xl font-bold text-gray-800 border-b-2 border-red-500 bg-gray-50 focus:outline-none mb-2 px-2 py-1"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{formData.name}</h2>
          )}
          
          <div className="px-4 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            Senior Rescuer
          </div>
          
          <div className="w-full space-y-4 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={18} className="text-gray-400" />
              {isEditing ? (
                <input 
                  type="email" 
                  className="w-full text-sm font-medium border-b border-gray-300 focus:border-red-500 bg-transparent outline-none px-1"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              ) : (
                <span className="text-sm font-medium">{formData.email}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={18} className="text-gray-400" />
              {isEditing ? (
                <input 
                  type="text" 
                  className="w-full text-sm font-medium border-b border-gray-300 focus:border-red-500 bg-transparent outline-none px-1"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              ) : (
                <span className="text-sm font-medium">{formData.phone}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={18} className="text-gray-400" />
              {isEditing ? (
                <input 
                  type="text" 
                  className="w-full text-sm font-medium border-b border-gray-300 focus:border-red-500 bg-transparent outline-none px-1"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              ) : (
                <span className="text-sm font-medium">{formData.location}</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats and Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{user?.rescuesCompleted || 0}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rescues Completed</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{user?.avgRating || "0.0"}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Rating</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{user?.experience || "0y"}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Experience</div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-blue-500" />
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Specialization</label>
                {isEditing ? (
                  <textarea 
                    rows="2"
                    className="w-full text-gray-800 font-bold p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  />
                ) : (
                  <div className="font-bold text-gray-700 p-3 bg-gray-50 rounded-xl border border-transparent">{formData.specialization}</div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Certifications</label>
                {isEditing ? (
                  <textarea 
                    rows="2"
                    className="w-full text-gray-800 font-bold p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={formData.certifications}
                    onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                  />
                ) : (
                  <div className="font-bold text-gray-700 p-3 bg-gray-50 rounded-xl border border-transparent">{formData.certifications}</div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Availability</label>
                <div className="font-bold text-emerald-600 flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active Now (On Duty)
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Joined Date</label>
                <div className="font-bold text-gray-700 p-3 bg-gray-50 rounded-xl border border-transparent">January 12, 2023</div>
              </div>
            </div>
          </div>

          {/* Account Settings Placeholder */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Settings size={20} className="text-gray-500" />
              Account Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm">
                    <Shield size={16} />
                  </div>
                  <div className="text-sm font-bold text-gray-700">Security & Password</div>
                </div>
                <Edit3 size={14} className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm">
                    <Award size={16} />
                  </div>
                  <div className="text-sm font-bold text-gray-700">Badges & Achievements</div>
                </div>
                <Edit3 size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
