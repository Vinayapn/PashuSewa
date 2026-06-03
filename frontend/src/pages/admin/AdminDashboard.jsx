import React, { useEffect, useState } from 'react';
import { Users, Building2, Stethoscope, HardHat, Megaphone, HeartHandshake, AlertTriangle } from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNgos: 0,
    totalDoctors: 0,
    totalRescuers: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalDonations: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await adminAPI.getDashboardStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <Users size={24} />, color: 'var(--blue)' },
    { title: 'NGOs', value: stats.totalNgos, icon: <Building2 size={24} />, color: 'var(--orange)' },
    { title: 'Doctors', value: stats.totalDoctors, icon: <Stethoscope size={24} />, color: 'var(--green)' },
    { title: 'Rescuers', value: stats.totalRescuers, icon: <HardHat size={24} />, color: 'var(--red)' },
    { title: 'Reports', value: stats.totalReports, icon: <AlertTriangle size={24} />, color: '#ef4444' },
    { title: 'Total Donations', value: `₹${stats.totalDonations}`, icon: <HeartHandshake size={24} />, color: '#ec4899' },
  ];

  if (loading) return <div className="spinner" style={{ margin: 'auto' }}></div>;

  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: 'bold' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {statCards.map((card, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.2s', cursor: 'default' }}
               onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${card.color}20`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.icon}
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>{card.title}</p>
              <h3 style={{ margin: '4px 0 0', fontSize: '28px', fontWeight: 'bold', color: 'var(--text-main)' }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts / Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', height: '400px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', fontWeight: '600' }}>Platform Activity Overview</h3>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            [Chart Area]
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', height: '400px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', fontWeight: '600' }}>Recent Registrations</h3>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            [Activity List]
          </div>
        </div>
      </div>
    </div>
  );
}
