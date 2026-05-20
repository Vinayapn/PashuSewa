import React from 'react';
import { FileText, Clock, CheckCircle, Calendar, Plus, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case 'High': case 'Critical': return 'text-red-500';
    case 'Medium': return 'text-amber-500';
    case 'Low': return 'text-emerald-500';
    default: return 'text-gray-500';
  }
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'Pending': return 'bg-amber-100 text-amber-700';
    case 'InProgress': case 'In Progress': return 'bg-blue-100 text-blue-700';
    case 'Resolved': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function DashboardOverview({ setTab, stats, alerts }) {
  const { user } = useAuth();
  
  // Get the correct user ID depending on whether it came from /me (req.user._id) or login (user.id)
  const userId = user?._id || user?.id;

  // Filter alerts for the logged-in user
  const userAlerts = alerts?.filter(c => {
    const creatorId = c.createdBy?._id || c.createdBy;
    const isCreator = creatorId === userId;
    const isAssigned = c.assignedTo && Array.isArray(c.assignedTo) && c.assignedTo.some(id => 
      id.toString() === userId?.toString() || id._id?.toString() === userId?.toString()
    );
    return isCreator || isAssigned;
  }) || [];

  const displayStats = [
    { label: 'Active Rescues', value: stats?.totalActive || 0, icon: <FileText className="text-blue-500" />, bgColor: 'bg-blue-50' },
    { label: 'SOS Alerts', value: stats?.totalSOS || 0, icon: <Clock className="text-amber-500" />, bgColor: 'bg-amber-50' },
    { label: 'Resolved Today', value: stats?.resolvedToday || 0, icon: <CheckCircle className="text-emerald-500" />, bgColor: 'bg-emerald-50' },
    { label: 'Team Members', value: stats?.teamMembers || 0, icon: <Calendar className="text-purple-500" />, bgColor: 'bg-purple-50' },
  ];

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name || 'Rescuer'}!</h1>
        <p className="text-gray-500">Which animals will you help today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {displayStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button 
          onClick={() => setTab('new-case')}
          className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white p-8 rounded-2xl flex items-start gap-4 transition-all group shadow-lg shadow-red-100"
        >
          <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <div className="text-left">
            <div className="text-xl font-bold mb-1">New Rescue Case</div>
            <div className="text-white/80 text-sm">Report an injured animal in distress</div>
          </div>
        </button>

        <button 
          onClick={() => setTab('map')}
          className="bg-[#388E3C] hover:bg-[#2E7D32] text-white p-8 rounded-2xl flex items-start gap-4 transition-all group shadow-lg shadow-green-100"
        >
          <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
            <MapPin size={24} />
          </div>
          <div className="text-left">
            <div className="text-xl font-bold mb-1">View Nearby Cases</div>
            <div className="text-white/80 text-sm">See real-time alerts on the live map</div>
          </div>
        </button>
      </div>

      {/* Recent Cases Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-bottom border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Alerts</h2>
          <button onClick={() => setTab('my-cases')} className="text-[#D32F2F] font-bold text-sm hover:underline">View All Alerts</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-y border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Case</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Urgency</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!userAlerts || userAlerts.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium italic">No recent alerts found</td>
                </tr>
              )}
              {userAlerts.slice(0, 5).map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{c.title}</div>
                    <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()} • {c.address}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{c.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getUrgencyColor(c.severity).replace('text-', 'bg-')}`}></span>
                      <span className={`text-sm font-bold ${getUrgencyColor(c.severity)}`}>{c.severity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
