import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users,
  Building2, 
  Stethoscope, 
  HardHat, 
  Megaphone, 
  HeartHandshake, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/ngos', icon: <Building2 size={20} />, label: 'NGOs' },
    { to: '/admin/doctors', icon: <Stethoscope size={20} />, label: 'Doctors' },
    { to: '/admin/rescuers', icon: <HardHat size={20} />, label: 'Rescuers' },
    { to: '/admin/campaigns', icon: <Megaphone size={20} />, label: 'Campaigns' },
    { to: '/admin/donations', icon: <HeartHandshake size={20} />, label: 'Donations' },
    { to: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'var(--bg-card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>Admin Panel</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? 'var(--blue)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s ease'
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{user?.name || 'Admin User'}</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>ReliefLink Administration</h1>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
              <Bell size={24} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: 'var(--red)', borderRadius: '50%', border: '2px solid var(--bg-card)' }}></span>
            </button>
          </div>
        </header>
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
