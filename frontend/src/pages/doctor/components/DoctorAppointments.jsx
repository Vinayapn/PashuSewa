import React, { useState } from 'react';
import { Search, Filter, Plus, Edit3, Trash2, Calendar, Clock, User, Heart, Syringe, Scissors, Pill, Stethoscope, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorAppointments({ appointments, setAppointments, setTab, setEditingAppointment }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredAppointments = appointments.filter(app => 
    (app.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
     app.owner.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'All' || app.status === filterStatus.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(a => a.id !== id));
      toast.success('Appointment deleted successfully');
    }
  };

  const handleStatusToggle = (id) => {
    setAppointments(appointments.map(a => 
      a.id === id ? { ...a, status: a.status === 'scheduled' ? 'completed' : 'scheduled' } : a
    ));
    toast.success('Appointment status updated');
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setTab('new-appointment');
  };

  const handleEdit = (app) => {
    setEditingAppointment(app);
    setTab('new-appointment');
  };

  const stats = [
    { label: "Today's Appointments", value: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length, icon: <Calendar className="text-blue-500" />, bgColor: 'bg-blue-50' },
    { label: 'Scheduled', value: appointments.filter(a => a.status === 'scheduled').length, icon: <Clock className="text-indigo-500" />, bgColor: 'bg-indigo-50' },
    { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: <CheckCircle className="text-emerald-500" />, bgColor: 'bg-emerald-50' },
  ];

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500">Schedule and manage patient appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-[250px]"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
          <button 
            onClick={handleAddAppointment}
            className="bg-[#2962FF] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} />
            New Appointment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Owner</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        {app.icon || <User size={18} />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{app.patient}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{app.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-800 text-sm">{app.owner}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{app.phone}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-800 text-sm">{app.date}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{app.time}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-medium text-gray-600">{app.category}</div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button 
                      onClick={() => handleStatusToggle(app.id)}
                      className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                        app.status === 'scheduled' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                        'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                    >
                      {app.status}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(app)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(app.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-gray-400 font-medium">No appointments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
