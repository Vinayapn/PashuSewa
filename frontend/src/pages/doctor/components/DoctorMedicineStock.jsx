import React, { useState } from 'react';
import { Search, Filter, Plus, Edit3, Trash2, Pill, FlaskConical, Thermometer, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorMedicineStock({ inventory, setInventory, setTab, setEditingMedicine }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
      toast.success('Inventory item deleted');
    }
  };

  const handleAddStock = () => {
    setEditingMedicine(null);
    setTab('new-medicine');
  };

  const handleEdit = (item) => {
    setEditingMedicine(item);
    setTab('new-medicine');
  };

  const stats = [
    { label: 'Total Items', value: inventory.length, icon: <Pill size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Expiring Soon', value: inventory.filter(i => i.status === 'Low').length, icon: <ShieldAlert size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Low Stock', value: inventory.filter(i => i.quantity < 10).length, icon: <FlaskConical size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Temperature Critical', value: '3', icon: <Thermometer size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Medicine Stock</h1>
          <p className="text-gray-500">Inventory and medical supply management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-[300px]"
            />
          </div>
          <button 
            onClick={handleAddStock}
            className="bg-[#2962FF] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} />
            Add Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}>
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 leading-tight">{s.value}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item Name</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Quantity</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Expiry</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg uppercase tracking-wider">{item.type}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="text-sm font-bold text-gray-800">{item.quantity}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{item.unit}</div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      item.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'Critical' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-xs font-bold text-gray-500">{item.expiry}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-gray-400 font-medium">No inventory items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
