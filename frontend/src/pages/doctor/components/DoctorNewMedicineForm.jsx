import React, { useState, useEffect } from 'react';
import { Save, X, Pill, FlaskConical, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorNewMedicineForm({ setTab, inventory, setInventory, editingMedicine }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Vaccine',
    quantity: '',
    unit: 'vials',
    status: 'Available',
    expiry: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingMedicine) {
      setFormData({
        name: editingMedicine.name || '',
        type: editingMedicine.type || 'Vaccine',
        quantity: editingMedicine.quantity || '',
        unit: editingMedicine.unit || 'vials',
        status: editingMedicine.status || 'Available',
        expiry: editingMedicine.expiry || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        name: '',
        type: 'Vaccine',
        quantity: '',
        unit: 'vials',
        status: 'Available',
        expiry: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingMedicine]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingMedicine) {
      const updatedInventory = inventory.map(item => 
        item.id === editingMedicine.id ? { ...item, ...formData, quantity: parseInt(formData.quantity) || 0 } : item
      );
      setInventory(updatedInventory);
      toast.success('Medicine stock updated successfully!');
    } else {
      const newItem = {
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        id: inventory.length > 0 ? Math.max(...inventory.map(i => i.id)) + 1 : 1,
      };
      setInventory([newItem, ...inventory]);
      toast.success('New medicine added to stock!');
    }
    
    setTab('medicine-stock');
  };

  return (
    <div className="p-8 lg:p-12 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{editingMedicine ? 'Edit Medicine' : 'Add Medicine'}</h1>
            <p className="text-gray-500 mt-2 font-medium">{editingMedicine ? 'Update the details for this inventory item' : 'Add a new medical supply to the inventory'}</p>
          </div>
          <button type="button" onClick={() => setTab('medicine-stock')} className="p-3 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Primary Info */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Pill size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Medicine Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Medicine Name <span className="text-red-500">*</span></label>
                  <input 
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all"
                    placeholder="e.g., Rabies Vaccine"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all cursor-pointer"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Vaccine">Vaccine</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Painkiller">Painkiller</option>
                    <option value="Consumable">Consumable</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inventory Info */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                  <FlaskConical size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Stock Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity <span className="text-red-500">*</span></label>
                  <input 
                    type="number"
                    min="0"
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-gray-800 font-medium transition-all"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-gray-800 font-medium transition-all cursor-pointer"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    <option value="vials">Vials</option>
                    <option value="bottles">Bottles</option>
                    <option value="rolls">Rolls</option>
                    <option value="tablets">Tablets</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-gray-800 font-medium transition-all cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Available">Available</option>
                    <option value="Low">Low Stock</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="date"
                      required
                      className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-gray-800 font-medium transition-all"
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-5 bg-[#2962FF] text-white font-extrabold rounded-3xl hover:bg-[#1E40AF] hover:-translate-y-1 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 text-lg"
            >
              <Save size={24} />
              {editingMedicine ? 'Update Medicine Stock' : 'Save New Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
