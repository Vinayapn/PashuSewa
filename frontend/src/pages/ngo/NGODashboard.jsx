import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ngoAPI } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Bell, LayoutDashboard } from 'lucide-react';

// Sub-components
import NGOSidebar from './components/NGOSidebar';
import NGODashboardOverview from './components/NGODashboardOverview';
import NGOCampaigns from './components/NGOCampaigns';
import NGONewCampaignForm from './components/NGONewCampaignForm';
import NGODonations from './components/NGODonations';
import NGONewDonationForm from './components/NGONewDonationForm';
import NGOVolunteers from './components/NGOVolunteers';
import NGONewVolunteerForm from './components/NGONewVolunteerForm';
import NGOAdoptionAnimal from './components/NGOAdoptionAnimal';
import NGOProfile from './components/NGOProfile';
import NGOReports from './components/NGOReports';

export default function NGODashboard() {
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState({ stats: {}, resources: [], volunteers: [], alerts: [] });
  const [loading, setLoading] = useState(true);

  const [campaigns, setCampaigns] = useState([
    { id: 1, title: 'Street Dogs Rescue', desc: 'Rescue and shelter street dogs', raised: 32500, goal: 50000, status: 'active', date: '2025-04-01' },
    { id: 2, title: 'Cow Shelter Build', desc: 'Build shelter for abandoned cows', raised: 78000, goal: 100000, status: 'active', date: '2025-03-15' },
    { id: 3, title: 'Vaccination Drive', desc: 'Free vaccination for stray animals', raised: 25000, goal: 25000, status: 'completed', date: '2025-02-20' },
  ]);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [volunteers, setVolunteers] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@email.com', phone: '+91 98765 43210', skills: ['Rescue', 'Transport'], status: 'active', contributions: '120 hrs', cases: '18 cases', joined: '2025-01-15' },
    { id: 2, name: 'Priya Patel', email: 'priya@email.com', phone: '+91 98765 43211', skills: ['Medical', 'Foster Care'], status: 'active', contributions: '95 hrs', cases: '12 cases', joined: '2025-02-10' },
    { id: 3, name: 'Amit Kumar', email: 'amit@email.com', phone: '+91 98765 43212', skills: ['Social Media', 'Fundraising'], status: 'active', contributions: '60 hrs', cases: '8 cases', joined: '2025-03-05' },
    { id: 4, name: 'Seema Gupta', email: 'seema@email.com', phone: '+91 98765 43213', skills: ['Rescue', 'Photography'], status: 'pending', contributions: '0 hrs', cases: '0 cases', joined: '2025-04-20' },
  ]);
  const [editingVolunteer, setEditingVolunteer] = useState(null);

  const [donations, setDonations] = useState([
    { id: 1, donor: 'Amit Kumar', email: 'amit@email.com', phone: '+91 98765 43210', campaign: 'Street Dogs Rescue', msg: '"Keep up the great work!"', amount: 5000, method: 'UPI', status: 'completed', date: '2025-04-28' },
    { id: 2, donor: 'Seema Gupta', email: 'seema@email.com', phone: '+91 98765 43211', campaign: 'Cow Shelter Build', msg: '"Happy to help animals"', amount: 10000, method: 'Card', status: 'completed', date: '2025-04-27' },
    { id: 3, donor: 'Rajesh Patil', email: 'rajesh@email.com', phone: '+91 98765 43212', campaign: 'Street Dogs Rescue', msg: '—', amount: 2500, method: 'UPI', status: 'completed', date: '2025-04-27' },
    { id: 4, donor: 'Neetu Sharma', email: 'neetu@email.com', phone: '+91 98765 43213', campaign: 'Cow Shelter Build', msg: '"For the cows!"', amount: 7500, method: 'Net Banking', status: 'completed', date: '2025-04-26' },
    { id: 5, donor: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 98765 43214', campaign: 'Vaccination Drive', msg: '"Protect all animals"', amount: 15000, method: 'Card', status: 'completed', date: '2025-04-25' },
    { id: 6, donor: 'Priya Patel', email: 'priya@email.com', phone: '+91 98765 43215', campaign: 'Street Dogs Rescue', msg: '—', amount: 3000, method: 'UPI', status: 'pending', date: '2025-04-28' },
    { id: 7, donor: 'Rahul Verma', email: 'rahul@email.com', phone: '+91 98765 43216', campaign: 'Cow Shelter Build', msg: '"Great initiative"', amount: 8000, method: 'Card', status: 'completed', date: '2025-04-24' },
    { id: 8, donor: 'Anita Desai', email: 'anita@email.com', phone: '+91 98765 43217', campaign: 'Vaccination Drive', msg: '"For my pet who passed away"', amount: 12000, method: 'Net Banking', status: 'completed', date: '2025-04-23' },
  ]);
  const [editingDonation, setEditingDonation] = useState(null);

  const { user, logout } = useAuth();
  const { onEvent } = useSocket();

  const handleTabChange = (newTab) => {
    if (newTab !== 'new-campaign') {
      setEditingCampaign(null);
    }
    if (newTab !== 'new-volunteer') {
      setEditingVolunteer(null);
    }
    if (newTab !== 'new-donation') {
      setEditingDonation(null);
    }
    setTab(newTab);
  };

  const fetchData = async () => {
    try {
      const { data: d } = await ngoAPI.getDashboard();
      setData(d);
    } catch {
      // toast.error('Failed to load dashboard'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for events
    const cleanupAlert = onEvent('alert_created', (alert) => {
      fetchData();
      toast(`New SOS Alert: ${alert.title}`, { icon: '⚠️' });
    });

    const cleanupUpdate = onEvent('alert_updated', (alert) => {
      fetchData();
    });

    return () => {
      cleanupAlert();
      cleanupUpdate();
    };
  }, []);

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <NGODashboardOverview setTab={handleTabChange} stats={data.stats} />;
      case 'campaigns': return <NGOCampaigns campaigns={campaigns} setCampaigns={setCampaigns} setTab={handleTabChange} setEditingCampaign={setEditingCampaign} />;
      case 'new-campaign': return <NGONewCampaignForm setTab={handleTabChange} setCampaigns={setCampaigns} editingCampaign={editingCampaign} />;
      case 'donations': return <NGODonations donations={donations} setDonations={setDonations} setTab={handleTabChange} setEditingDonation={setEditingDonation} />;
      case 'new-donation': return <NGONewDonationForm setTab={handleTabChange} setDonations={setDonations} editingDonation={editingDonation} campaigns={campaigns} />;
      case 'volunteers': return <NGOVolunteers volunteers={volunteers} setVolunteers={setVolunteers} setTab={handleTabChange} setEditingVolunteer={setEditingVolunteer} />;
      case 'new-volunteer': return <NGONewVolunteerForm setTab={handleTabChange} setVolunteers={setVolunteers} editingVolunteer={editingVolunteer} />;
      case 'adoption': return <NGOAdoptionAnimal />;
      case 'profile': return <NGOProfile />;
      case 'reports': return <NGOReports />;
      default: return <NGODashboardOverview setTab={handleTabChange} stats={data.stats} campaigns={campaigns} donations={donations} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <NGOSidebar activeTab={tab} setTab={handleTabChange} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <LayoutDashboard size={18} />
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              NGO - <span className="text-emerald-600">{tab.replace('-', ' ').toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-gray-100"></div>

            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right">
                <div className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{user?.name || 'sameer'}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">NGO Administrator</div>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold border-2 border-transparent group-hover:border-emerald-100 transition-all">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
