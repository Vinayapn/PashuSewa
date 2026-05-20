import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { rescuerAPI } from '../../services/api';
import { useSocket } from '../../context/SocketContext';

// New Components
import RescuerSidebar from './components/RescuerSidebar';
import DashboardOverview from './components/DashboardOverview';
import MyCases from './components/MyCases';
import NewCaseForm from './components/NewCaseForm';
import MapExplore from './components/MapExplore';
import ProfileView from './components/ProfileView';
import ReportsAnalytics from './components/ReportsAnalytics';

export default function RescuerDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState({ stats: {}, alerts: [], mapAlerts: [] });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { onEvent } = useSocket();

  const fetchData = async () => {
    try {
      const [dash, map] = await Promise.all([
        rescuerAPI.getDashboard(),
        rescuerAPI.getMapAlerts()
      ]);
      setData({ 
        stats: dash.data.stats, 
        alerts: dash.data.alerts, 
        mapAlerts: map.data.alerts 
      });
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Listen for real-time updates
    const unsubCreated = onEvent('alert_created', () => fetchData());
    const unsubUpdated = onEvent('alert_updated', () => fetchData());
    return () => {
      unsubCreated?.();
      unsubUpdated?.();
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold animate-pulse">Loading PashuRashak...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (tab) {
      case 'dashboard':
        return <DashboardOverview setTab={setTab} stats={data.stats} alerts={data.alerts} />;
      case 'my-cases':
        return <MyCases alerts={data.alerts} refresh={fetchData} />;
      case 'new-case':
        return <NewCaseForm setTab={setTab} />;
      case 'map':
        return <MapExplore alerts={data.mapAlerts} />;
      case 'profile':
        return <ProfileView user={user} />;
      case 'reports':
        return <ReportsAnalytics stats={data.stats} alerts={data.alerts} />;
      default:
        return <DashboardOverview setTab={setTab} stats={data.stats} alerts={data.alerts} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8F9FA] overflow-hidden font-inter">
      {/* Sidebar */}
      <RescuerSidebar activeTab={tab} setTab={setTab} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 sticky top-0 z-40 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
             <div className="lg:hidden text-2xl">🐾</div>
             <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden lg:block"></div>
             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
               {tab.replace('-', ' ')}
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-[10px] font-bold text-emerald-700 uppercase">Live System</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-gray-800 leading-none">{user?.name}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Senior Rescuer</div>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
