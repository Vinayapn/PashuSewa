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
  const [healthCases, setHealthCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('relieflink_user');
    if (userData) {
      setUser(prev => ({ ...prev, ...JSON.parse(userData) }));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const { doctorAPI } = await import('../../services/api');
      const { data } = await doctorAPI.getDashboard();
      if (data.success) {
        setHealthCases(data.patients || []);
        setAppointments(data.appointments || []);
        setInventory(data.inventory || []);
        setAlerts(data.alerts || []);
        setDashboardStats(data.stats || null);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingData(false);
    }
  };

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
    if (loadingData) {
      return <div className="flex items-center justify-center h-full"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    switch (tab) {
      case 'dashboard': return <DoctorDashboardOverview setTab={handleTabChange} cases={healthCases} appointments={appointments} stats={dashboardStats} />;
      case 'health-cases': return <DoctorHealthCases setTab={handleTabChange} cases={healthCases} setCases={setHealthCases} setEditingCase={setEditingCase} fetchDashboardData={fetchDashboardData} />;
      case 'appointments': return <DoctorAppointments appointments={appointments} setAppointments={setAppointments} setTab={handleTabChange} setEditingAppointment={setEditingAppointment} fetchDashboardData={fetchDashboardData} />;
      case 'new-case': return <DoctorNewCaseForm setTab={handleTabChange} cases={healthCases} setCases={setHealthCases} editingCase={editingCase} fetchDashboardData={fetchDashboardData} />;
      case 'new-appointment': return <DoctorNewAppointmentForm setTab={handleTabChange} appointments={appointments} setAppointments={setAppointments} editingAppointment={editingAppointment} fetchDashboardData={fetchDashboardData} />;
      case 'new-medicine': return <DoctorNewMedicineForm setTab={handleTabChange} inventory={inventory} setInventory={setInventory} editingMedicine={editingMedicine} fetchDashboardData={fetchDashboardData} />;
      case 'medicine-stock': return <DoctorMedicineStock inventory={inventory} setInventory={setInventory} setTab={handleTabChange} setEditingMedicine={setEditingMedicine} fetchDashboardData={fetchDashboardData} />;
      case 'profile': return <DoctorProfile user={user} setUser={setUser} />;
      case 'reports': return <DoctorReports alerts={alerts} />;
      default: return <DoctorDashboardOverview setTab={handleTabChange} cases={healthCases} appointments={appointments} stats={dashboardStats} />;
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
