import React from 'react';
import { TrendingUp, Users, Heart, Award, ArrowUpRight, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const topDonors = [
  { name: 'Amit Kumar', amount: 'Rs 22,000', label: '8 campaigns' },
  { name: 'Sunita Gupta', amount: 'Rs 18,000', label: '5 campaigns' },
  { name: 'Rohan Patil', amount: 'Rs 15,000', label: '4 campaigns' },
  { name: 'Neelu Sharma', amount: 'Rs 12,000', label: '2 campaigns' },
  { name: 'Vikram Singh', amount: 'Rs 10,000', label: '7 campaigns' },
];

export default function ReportsAnalytics({ stats: globalStats, alerts = [] }) {
  const { user } = useAuth();
  const userId = user?._id || user?.id;

  const userAlerts = alerts.filter(c => {
    const creatorId = c.createdBy?._id || c.createdBy;
    const isCreator = creatorId === userId;
    const isAssigned = c.assignedTo && Array.isArray(c.assignedTo) && c.assignedTo.some(id => 
      id.toString() === userId?.toString() || id._id?.toString() === userId?.toString()
    );
    return isCreator || isAssigned;
  });

  const totalCases = userAlerts.length;
  const resolvedCases = userAlerts.filter(a => a.status === 'Resolved').length;
  const activeCases = userAlerts.filter(a => a.status !== 'Resolved' && a.status !== 'Cancelled').length;

  const stats = [
    { label: 'My Rescue Cases', value: totalCases.toString(), sub: 'Total assigned/created', icon: <TrendingUp size={20} />, color: 'bg-red-50 text-red-600' },
    { label: 'Animals Helped', value: resolvedCases.toString(), sub: 'Successfully resolved', icon: <Heart size={20} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Cases', value: activeCases.toString(), sub: 'Currently pending/progress', icon: <AlertCircle size={20} />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Global Team', value: (globalStats?.teamMembers || 0).toString(), sub: 'Total active rescuers', icon: <Users size={20} />, color: 'bg-emerald-50 text-emerald-600' },
  ];

  const animalCounts = { Dog: 0, Cat: 0, Cow: 0, Bird: 0, Other: 0 };
  userAlerts.forEach(a => {
    let type = 'Other';
    if (a.description?.includes('[Animal: Dog]')) type = 'Dog';
    else if (a.description?.includes('[Animal: Cat]')) type = 'Cat';
    else if (a.description?.includes('[Animal: Cow]')) type = 'Cow';
    else if (a.description?.includes('[Animal: Bird]')) type = 'Bird';
    animalCounts[type]++;
  });

  const animalTypes = [
    { type: 'Dog', count: animalCounts.Dog, color: 'bg-red-400' },
    { type: 'Cat', count: animalCounts.Cat, color: 'bg-orange-400' },
    { type: 'Cow', count: animalCounts.Cow, color: 'bg-amber-400' },
    { type: 'Bird', count: animalCounts.Bird, color: 'bg-emerald-400' },
    { type: 'Other', count: animalCounts.Other, color: 'bg-blue-400' },
  ];

  const urgencyCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  userAlerts.forEach(a => {
    if (urgencyCounts[a.severity] !== undefined) urgencyCounts[a.severity]++;
  });

  const urgencies = [
    { level: 'Critical', count: urgencyCounts.Critical, color: 'bg-red-600' },
    { level: 'High', count: urgencyCounts.High, color: 'bg-orange-500' },
    { level: 'Medium', count: urgencyCounts.Medium, color: 'bg-amber-400' },
    { level: 'Low', count: urgencyCounts.Low, color: 'bg-emerald-400' },
  ];

  const statusCounts = { Pending: 0, InProgress: 0, Resolved: 0 };
  userAlerts.forEach(a => {
    let s = a.status === 'In Progress' ? 'InProgress' : a.status;
    if (statusCounts[s] !== undefined) statusCounts[s]++;
  });

  const statuses = [
    { status: 'Pending', count: statusCounts.Pending, color: 'bg-amber-400' },
    { status: 'In Progress', count: statusCounts.InProgress, color: 'bg-blue-400' },
    { status: 'Resolved', count: statusCounts.Resolved, color: 'bg-emerald-400' },
  ];

  let recentActivity = userAlerts.slice(0, 5).map(a => ({
    type: `Case: ${a.type || 'Alert'}`,
    desc: a.title,
    time: new Date(a.createdAt).toLocaleDateString(),
    icon: <AlertCircle size={16} />,
    color: 'bg-red-50 text-red-500'
  }));

  if (recentActivity.length === 0) {
    recentActivity = [
      { type: 'No activity yet', desc: 'You have not created or been assigned cases.', time: '', icon: <Clock size={16} />, color: 'bg-gray-50 text-gray-400' }
    ];
  }

  // Calculating total cases to prevent division by zero in charts
  const totalAnimals = Object.values(animalCounts).reduce((a,b)=>a+b,0) || 1;
  const totalUrgencies = Object.values(urgencyCounts).reduce((a,b)=>a+b,0) || 1;
  const totalStatuses = Object.values(statusCounts).reduce((a,b)=>a+b,0) || 1;

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500">Track your impact and organization performance</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          <Calendar size={18} className="text-gray-400 ml-2" />
          <select className="bg-transparent border-none text-sm font-bold text-gray-700 outline-none pr-4">
            <option>Last 6 Months</option>
            <option>Last 30 Days</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-800 mb-1">{stat.label}</div>
            <div className="text-xs text-emerald-500 flex items-center gap-1 font-bold">
              <ArrowUpRight size={12} />
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Charts) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Rescue Cases Trend */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-800">Rescue Cases Trend</h2>
            </div>
            <div className="h-[250px] flex items-end gap-3 px-4">
              {[60, 85, 120, 95, 140, 110].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full flex flex-col-reverse gap-1 h-full">
                    <div className="bg-blue-400 rounded-t-md transition-all hover:bg-blue-500" style={{ height: `${h * 0.6}%` }}></div>
                    <div className="bg-red-400 rounded-t-md transition-all hover:bg-red-500" style={{ height: `${h * 0.4}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Animal Types */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Animal Types</h2>
              <div className="space-y-4">
                {animalTypes.map(item => (
                  <div key={item.type}>
                    <div className="flex justify-between text-sm mb-1 font-bold">
                      <span className="text-gray-600">{item.type}</span>
                      <span className="text-gray-900">{item.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${(item.count/totalAnimals)*100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Urgency */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Case Urgency</h2>
              <div className="space-y-4">
                {urgencies.map(item => (
                  <div key={item.level}>
                    <div className="flex justify-between text-sm mb-1 font-bold">
                      <span className="text-gray-600">{item.level}</span>
                      <span className="text-gray-900">{item.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${(item.count/totalUrgencies)*100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Case Status */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Case Status</h2>
            <div className="space-y-6">
              {statuses.map(item => (
                <div key={item.status}>
                  <div className="flex justify-between text-sm mb-1 font-bold">
                    <span className="text-gray-600">{item.status}</span>
                    <span className="text-gray-900">{item.count}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${(item.count/totalStatuses)*100}%` }}></div>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-4 pt-4">
                {statuses.map(item => (
                  <div key={item.status} className={`${item.color.replace('bg-', 'bg-').split('-')[0]}-50 p-4 rounded-xl text-center`}>
                    <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">{item.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Top Donors */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Donors</h2>
            <div className="space-y-6">
              {topDonors.map((donor, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{donor.name}</div>
                      <div className="text-xs text-gray-400">{donor.label}</div>
                    </div>
                  </div>
                  <div className="text-emerald-600 font-bold text-sm">{donor.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== recentActivity.length - 1 && <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-50"></div>}
                  <div className={`w-10 h-10 ${act.color} rounded-full flex items-center justify-center flex-shrink-0 z-10`}>
                    {act.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-gray-900 text-sm">{act.type}</div>
                      <div className="text-[10px] text-gray-400 font-medium uppercase">{act.time}</div>
                    </div>
                    <div className="text-xs text-gray-500">{act.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
