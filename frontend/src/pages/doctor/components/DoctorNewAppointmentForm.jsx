import React, { useState, useEffect } from 'react';
import { Save, X, Calendar, Clock, User, Activity, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorNewAppointmentForm({ setTab, appointments, setAppointments, editingAppointment }) {
  const [formData, setFormData] = useState({
    patient: '', 
    type: 'Dog',
    owner: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    category: 'Checkup',
    status: 'scheduled'
  });

  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        patient: editingAppointment.patient || '',
        type: editingAppointment.type || 'Dog',
        owner: editingAppointment.owner || '',
        phone: editingAppointment.phone || '',
        date: editingAppointment.date || new Date().toISOString().split('T')[0],
        time: editingAppointment.time || '10:00 AM',
        category: editingAppointment.category || 'Checkup',
        status: editingAppointment.status || 'scheduled'
      });
    } else {
      setFormData({
        patient: '', 
        type: 'Dog',
        owner: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        category: 'Checkup',
        status: 'scheduled'
      });
    }
  }, [editingAppointment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAppointment) {
      const updatedAppointments = appointments.map(a => 
        a.id === editingAppointment.id ? { ...a, ...formData } : a
      );
      setAppointments(updatedAppointments);
      toast.success('Appointment updated successfully!');
    } else {
      const newApp = {
        ...formData,
        id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
      };
      setAppointments([newApp, ...appointments]);
      toast.success('New appointment created successfully!');
    }
    
    setTab('appointments');
  };

  return (
    <div className="p-8 lg:p-12 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</h1>
            <p className="text-gray-500 mt-2 font-medium">{editingAppointment ? 'Update the details for this scheduled appointment' : 'Schedule a new visit for a patient'}</p>
          </div>
          <button type="button" onClick={() => setTab('appointments')} className="p-3 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Primary Info */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <User size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Patient Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Owner Name <span className="text-red-500">*</span></label>
                  <input 
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all"
                    placeholder="Owner's full name"
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Number <span className="text-red-500">*</span></label>
                  <input 
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all"
                    placeholder="e.g., +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                  <Calendar size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Schedule & Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date"
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Time <span className="text-red-500">*</span></label>
                  <input 
                    type="time"
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Checkup">General Checkup</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-5 bg-[#2962FF] text-white font-extrabold rounded-3xl hover:bg-[#1E40AF] hover:-translate-y-1 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 text-lg"
            >
              <Save size={24} />
              {editingAppointment ? 'Update Appointment' : 'Save Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
