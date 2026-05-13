import React from 'react';
import { Stethoscope, Activity, Heart, Calendar, Plus, FileText, CheckCircle, Clock } from 'lucide-react';

export default function DoctorDashboardOverview({ setTab, cases, appointments }) {
  const stats = [
    { label: 'Total Cases', value: cases.length, icon: <Stethoscope className="text-blue-500" />, bgColor: 'bg-blue-50' },
    { label: 'Treating', value: cases.filter(c => c.status === 'Treating').length, icon: <Activity className="text-amber-500" />, bgColor: 'bg-amber-50' },
    { label: 'Recovered', value: cases.filter(c => c.status === 'Recovered').length, icon: <Heart className="text-emerald-500" />, bgColor: 'bg-emerald-50' },
    { label: "Today's Appointments", value: appointments.filter(a => a.status === 'scheduled').length, icon: <Calendar className="text-indigo-500" />, bgColor: 'bg-indigo-50' },
  ];

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Hello, Ravi!</h1>
        <p className="text-gray-500">Which patients will you help today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button 
          onClick={() => setTab('new-case')}
          className="bg-[#2962FF] hover:bg-[#1E40AF] text-white p-8 rounded-2xl flex items-start gap-4 transition-all group shadow-lg shadow-blue-100"
        >
          <div className="bg-white/20 p-3 rounded-xl">
            <Plus size={24} />
          </div>
          <div className="text-left">
            <div className="text-xl font-bold mb-1">New Health Case</div>
            <div className="text-white/80 text-sm">Create a new patient case</div>
          </div>
        </button>

        <button 
          onClick={() => setTab('appointments')}
          className="bg-[#43A047] hover:bg-[#2E7D32] text-white p-8 rounded-2xl flex items-start gap-4 transition-all group shadow-lg shadow-green-100"
        >
          <div className="bg-white/20 p-3 rounded-xl">
            <Calendar size={24} />
          </div>
          <div className="text-left">
            <div className="text-xl font-bold mb-1">Appointment Schedule</div>
            <div className="text-white/80 text-sm">View today's appointments</div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Health Cases */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Health Cases</h2>
            <button onClick={() => setTab('health-cases')} className="text-blue-600 font-semibold text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Case</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Animal</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cases.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 text-sm">{c.title}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{c.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-500 uppercase">{c.type || c.animal}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'Treating' ? 'bg-blue-100 text-blue-700' :
                        c.status === 'Recovered' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Today's Appointments</h2>
            <button onClick={() => setTab('appointments')} className="text-blue-600 font-semibold text-sm hover:underline">View All</button>
          </div>
          <div className="p-2">
            {appointments.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{app.patient}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{app.owner} • {app.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-bold text-sm">{app.time}</div>
                  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{app.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
