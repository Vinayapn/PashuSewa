import React, { useState } from 'react';
import { Search, Filter, CreditCard, Landmark, Wallet, Plus, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NGODonations({ donations = [], setDonations, setTab, setEditingDonation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const formatCurrency = (amount) => {
    if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `Rs ${(amount / 1000).toFixed(1)}K`;
    return `Rs ${amount}`;
  };

  // Only show donations added by the user (filter out random dummy data with IDs 1-10)
  // User-added donations use Date.now() which is a very large number.
  const userAddedDonations = donations.filter(d => d.id > 10000);

  const completedDonations = userAddedDonations.filter(d => d.status?.toLowerCase() === 'completed');
  const totalRaised = completedDonations.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const uniqueDonors = new Set(completedDonations.map(d => d.email || d.donor)).size;
  const avgDonation = completedDonations.length > 0 ? Math.round(totalRaised / completedDonations.length) : 0;

  const stats = [
    { label: 'Total Donations', value: formatCurrency(totalRaised), icon: <Wallet className="text-emerald-500" />, bgColor: 'bg-emerald-50' },
    { label: 'Unique Donors', value: uniqueDonors.toString(), icon: <Landmark className="text-blue-500" />, bgColor: 'bg-blue-50' },
    { label: 'Average Donation', value: formatCurrency(avgDonation), icon: <CreditCard className="text-indigo-500" />, bgColor: 'bg-indigo-50' },
  ];

  const handleEdit = (don) => {
    setEditingDonation(don);
    setTab('new-donation');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this donation record?')) {
      setDonations(prev => prev.filter(d => d.id !== id));
      toast.success('Donation record deleted successfully');
    }
  };

  const filteredDonations = userAddedDonations.filter(d => {
    const searchStr = `${d.donor || ''} ${d.campaign || ''} ${d.email || ''}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || d.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bgColor}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Donations</h1>
          <p className="text-gray-500">View and manage all incoming donations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search donors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white text-gray-500 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-[300px]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white text-gray-500 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500"
          >
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
          <button
            onClick={() => setTab('new-donation')}
            className="bg-[#4CAF50] hover:bg-[#43A047] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-green-100"
          >
            <Plus size={20} />
            Add Donation
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Donor</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaign</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Amount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Payment</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">No user-added donations found.</td>
                </tr>
              )}
              {filteredDonations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                        {d.donor?.charAt(0)?.toUpperCase() || 'D'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{d.donor || 'Anonymous'}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{d.email || 'N/A'}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{d.phone || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-800 text-sm">{d.campaign || 'General Fund'}</div>
                    <div className="text-[10px] text-gray-400 italic mt-1 line-clamp-1">{d.msg || '—'}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-emerald-600 font-bold text-sm">+Rs {Number(d.amount || 0).toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 font-medium mt-1">{new Date(d.date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                      {d.method === 'UPI' && <Wallet size={14} />}
                      {d.method === 'Card' && <CreditCard size={14} />}
                      {d.method === 'Net Banking' && <Landmark size={14} />}
                      {d.method || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${d.status?.toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {d.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(d)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors bg-gray-50 rounded-lg"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
