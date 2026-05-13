import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Bell, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import DoctorSidebar from './components/DoctorSidebar';
import DoctorDashboardOverview from './components/DoctorDashboardOverview';
import DoctorHealthCases from './components/DoctorHealthCases';
import DoctorAppointments from './components/DoctorAppointments';
import DoctorNewCaseForm from './components/DoctorNewCaseForm';
import DoctorNewAppointmentForm from './components/DoctorNewAppointmentForm';
import DoctorNewMedicineForm from './components/DoctorNewMedicineForm';
import DoctorMedicineStock from './components/DoctorMedicineStock';
import DoctorProfile from './components/DoctorProfile';
import DoctorReports from './components/DoctorReports';

export default function DoctorDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [user, setUser] = useState({
    name: 'Dr. Ravi Kumar',
    email: 'ravi.kumar@vetcare.com',
    phone: '+91 98765 43210',
    location: 'South Delhi Animal Clinic',
    specialization: 'Orthopedic Surgery, Trauma Care',
    experience: '12 Years',
    hours: 'Mon - Sat (09:00 AM - 07:00 PM)'
  });
  const [editingCase, setEditingCase] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [healthCases, setHealthCases] = useState([
    { id: 1, title: 'Dog Fracture', patient: 'Tommy', type: 'Dog', urgency: 'High', status: 'Treating', date: '2025-04-28' },
    { id: 2, title: 'Cat Fever', patient: 'Luna', type: 'Cat', urgency: 'Medium', status: 'Recovered', date: '2025-04-27' },
    { id: 3, title: 'Cow Infection', patient: 'Lakshmi', type: 'Cow', urgency: 'Critical', status: 'Treating', date: '2025-04-26' },
    { id: 4, title: 'Pigeon Wing Injury', patient: 'Sky', type: 'Bird', urgency: 'Low', status: 'Pending', date: '2025-04-28' },
  ]);
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'Tommy', type: 'Dog', owner: 'Rahul Sharma', phone: '+91 98765 43210', date: '2025-04-29', time: '10:00 AM', category: 'Checkup', status: 'scheduled' },
    { id: 2, patient: 'Minky', type: 'Cat', owner: 'Seema Gupta', phone: '+91 98765 43211', date: '2025-04-29', time: '11:30 AM', category: 'Vaccination', status: 'scheduled' },
    { id: 3, patient: 'Lakshmi', type: 'Cow', owner: 'Rajesh Patil', phone: '+91 98765 43212', date: '2025-04-29', time: '2:00 PM', category: 'Treatment', status: 'completed' },
    { id: 4, patient: 'Bruno', type: 'Dog', owner: 'Amit Kumar', phone: '+91 98765 43213', date: '2025-04-30', time: '9:00 AM', category: 'Surgery', status: 'scheduled' },
  ]);
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Rabies Vaccine', type: 'Vaccine', quantity: 45, unit: 'vials', status: 'Available', expiry: '2025-12-20' },
    { id: 2, name: 'Amoxicillin', type: 'Antibiotic', quantity: 12, unit: 'bottles', status: 'Low', expiry: '2025-08-15' },
    { id: 3, name: 'Meloxicam', type: 'Painkiller', quantity: 8, unit: 'bottles', status: 'Critical', expiry: '2025-10-10' },
    { id: 4, name: 'Surgical Gauze', type: 'Consumable', quantity: 150, unit: 'rolls', status: 'Available', expiry: '2026-05-01' },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('relieflink_user');
    if (userData) {
      setUser(prev => ({ ...prev, ...JSON.parse(userData) }));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('relieflink_token');
    localStorage.removeItem('relieflink_user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleTabChange = (newTab) => {
    if (newTab !== 'new-case') {
      setEditingCase(null);
    }
    if (newTab !== 'new-appointment') {
      setEditingAppointment(null);
    }
    if (newTab !== 'new-medicine') {
      setEditingMedicine(null);
    }
    setTab(newTab);
  };

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <DoctorDashboardOverview setTab={handleTabChange} cases={healthCases} appointments={appointments} />;
      case 'health-cases': return <DoctorHealthCases setTab={handleTabChange} cases={healthCases} setCases={setHealthCases} setEditingCase={setEditingCase} />;
      case 'appointments': return <DoctorAppointments appointments={appointments} setAppointments={setAppointments} setTab={handleTabChange} setEditingAppointment={setEditingAppointment} />;
      case 'new-case': return <DoctorNewCaseForm setTab={handleTabChange} cases={healthCases} setCases={setHealthCases} editingCase={editingCase} />;
      case 'new-appointment': return <DoctorNewAppointmentForm setTab={handleTabChange} appointments={appointments} setAppointments={setAppointments} editingAppointment={editingAppointment} />;
      case 'new-medicine': return <DoctorNewMedicineForm setTab={handleTabChange} inventory={inventory} setInventory={setInventory} editingMedicine={editingMedicine} />;
      case 'medicine-stock': return <DoctorMedicineStock inventory={inventory} setInventory={setInventory} setTab={handleTabChange} setEditingMedicine={setEditingMedicine} />;
      case 'profile': return <DoctorProfile user={user} setUser={setUser} />;
      case 'reports': return <DoctorReports />;
      default: return <DoctorDashboardOverview setTab={handleTabChange} cases={healthCases} appointments={appointments} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <DoctorSidebar activeTab={tab} setActiveTab={handleTabChange} onLogout={handleLogout} />
      
      <main className="flex-1 ml-80 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-80 text-black"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all relative group">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
            </button>
            
            <div className="h-10 w-[1px] bg-gray-100 mx-2"></div>
            
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => handleTabChange('profile')}>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {user?.name || 'Dr. Ravi'}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Senior Specialist
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:shadow-lg group-hover:shadow-blue-100 transition-all">
                <User size={22} />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
