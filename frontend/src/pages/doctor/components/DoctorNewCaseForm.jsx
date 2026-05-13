import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Camera, AlertCircle, Info, Activity, Image as ImageIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorNewCaseForm({ setTab, cases, setCases, editingCase }) {
  const [formData, setFormData] = useState({
    title: '', 
    patient: '', 
    type: 'Dog', 
    urgency: 'Medium', 
    status: 'Pending', 
    description: '', 
    notes: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingCase) {
      setFormData({
        title: editingCase.title || '',
        patient: editingCase.patient || '',
        type: editingCase.type || 'Dog',
        urgency: editingCase.urgency || 'Medium',
        status: editingCase.status || 'Pending',
        description: editingCase.description || '',
        notes: editingCase.notes || ''
      });
      setImagePreview(editingCase.image || null);
    } else {
      setFormData({
        title: '', patient: '', type: 'Dog', urgency: 'Medium', status: 'Pending', description: '', notes: ''
      });
      setImagePreview(null);
    }
  }, [editingCase]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCase) {
      const updatedCases = cases.map(c => 
        c.id === editingCase.id ? { ...c, ...formData, image: imagePreview } : c
      );
      setCases(updatedCases);
      toast.success('Health case updated successfully!');
    } else {
      const newCase = {
        ...formData,
        id: cases.length > 0 ? Math.max(...cases.map(c => c.id)) + 1 : 1,
        date: new Date().toISOString().split('T')[0],
        image: imagePreview
      };
      setCases([newCase, ...cases]);
      toast.success('New health case created successfully!');
    }
    
    setTab('health-cases');
  };

  return (
    <div className="p-8 lg:p-12 bg-gray-50 min-h-full">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{editingCase ? 'Edit Health Case' : 'New Health Case'}</h1>
            <p className="text-gray-500 mt-2 font-medium">{editingCase ? 'Modify the medical case details and update status' : 'Record a new medical case for an animal in need'}</p>
          </div>
          <button type="button" onClick={() => setTab('health-cases')} className="p-3 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Primary Info */}
              <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Activity size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Case Information</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Case Title <span className="text-red-500">*</span></label>
                    <input 
                      required
                      className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all"
                      placeholder="e.g., Severe Dehydration / Leg Fracture"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Name <span className="text-red-500">*</span></label>
                      <input 
                        required
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all"
                        placeholder="Enter animal name"
                        value={formData.patient}
                        onChange={(e) => setFormData({...formData, patient: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Animal Type</label>
                      <select 
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all cursor-pointer"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Cow">Cow</option>
                        <option value="Bird">Bird</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Condition Description <span className="text-red-500">*</span></label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all resize-none"
                      placeholder="Describe the medical condition, symptoms, and immediate needs..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Status and Notes */}
              <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                    <AlertCircle size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Severity & Notes</h2>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Urgency Level</label>
                      <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                        {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFormData({...formData, urgency: level})}
                            className={`flex-1 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                              formData.urgency === level 
                              ? level === 'Critical' ? 'bg-red-500 text-white shadow-md shadow-red-200' 
                                : level === 'High' ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                : 'bg-blue-600 text-white shadow-md shadow-blue-200'
                              : 'text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Case Status</label>
                      <select 
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all cursor-pointer"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="Pending">Pending (Awaiting Checkup)</option>
                        <option value="Treating">Treating (In Progress)</option>
                        <option value="Recovered">Recovered (Discharged)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Internal Medical Notes</label>
                    <textarea 
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all resize-none"
                      placeholder="Confidential notes for internal medical staff only..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Photo Upload Area */}
              <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                />
                
                {imagePreview ? (
                  <div className="relative w-full aspect-square rounded-[32px] overflow-hidden mb-6 group border border-gray-200 shadow-inner">
                    <img src={imagePreview} alt="Case Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={removeImage}
                        className="bg-white text-red-500 p-4 rounded-full shadow-xl hover:bg-red-50 hover:scale-110 transition-all"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-square bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 group hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer mb-6 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <Camera size={48} className="mb-4 text-gray-300 group-hover:text-blue-500 transition-colors relative z-10" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-600 relative z-10">Upload Photo</span>
                  </div>
                )}
                
                <h3 className="font-bold text-gray-800 mb-2">Medical Imagery</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">Add a clear photo of the animal's condition for better visual tracking.</p>
              </div>

              {/* Guidelines */}
              <div className="bg-gradient-to-br from-[#2962FF] to-[#1E40AF] p-8 rounded-3xl shadow-xl shadow-blue-500/20 text-white relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-white/10">
                  <Info size={120} />
                </div>
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                    <AlertCircle size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Guidelines</h3>
                </div>
                
                <ul className="space-y-4 relative z-10">
                  {[
                    'Be precise with symptoms',
                    'Specify urgency accurately',
                    'Attach clear, focused images',
                    'Review before saving'
                  ].map((g, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-blue-50">
                      <div className="w-1.5 h-1.5 bg-blue-300 rounded-full flex-shrink-0 mt-2"></div>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 bg-[#2962FF] text-white font-extrabold rounded-3xl hover:bg-[#1E40AF] hover:-translate-y-1 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 text-lg"
              >
                <Save size={24} />
                {editingCase ? 'Update Health Case' : 'Save Health Case'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
