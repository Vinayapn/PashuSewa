import React, { useState } from 'react';
import { Search, Filter, Plus, Edit3, Trash2, Activity, Heart, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorHealthCases({ cases, setCases, setTab, setEditingCase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredCases = cases.filter(c => 
    (c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.patient.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'All' || c.type === filterType)
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      setCases(cases.filter(c => c.id !== id));
      toast.success('Case deleted successfully');
    }
  };

  const handleEdit = (c) => {
    setEditingCase(c);
    setTab('new-case');
  };

  const handleNewCase = () => {
    setEditingCase(null);
    setTab('new-case');
  };

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Health Cases</h1>
          <p className="text-gray-500">Track and manage all patient medical records</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-[300px]"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-gray-200 p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm outline-none text-sm font-medium"
          >
            <option value="All">All Types</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Cow">Cow</option>
            <option value="Bird">Bird</option>
          </select>
          <button 
            onClick={handleNewCase}
            className="bg-[#2962FF] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} />
            New Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Cases', value: cases.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Critical', value: cases.filter(c => c.urgency === 'Critical').length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'In Treatment', value: cases.filter(c => c.status === 'Treating').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Recovered', value: cases.filter(c => c.status === 'Recovered').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
            <div className={`text-[10px] font-bold ${s.color} uppercase tracking-widest`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Case Details</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Animal Type</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Urgency</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-900 text-sm mb-1">{c.title}</div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                      <Clock size={12} />
                      {c.date} • {c.patient}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase tracking-wider">{c.type}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        c.urgency === 'Critical' ? 'bg-red-500' :
                        c.urgency === 'High' ? 'bg-orange-500' :
                        c.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></span>
                      <span className={`text-xs font-bold ${
                        c.urgency === 'Critical' ? 'text-red-600' :
                        c.urgency === 'High' ? 'text-orange-600' :
                        c.urgency === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>{c.urgency}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      c.status === 'Treating' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      c.status === 'Recovered' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleEdit(c)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-medium">
                    No cases found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
