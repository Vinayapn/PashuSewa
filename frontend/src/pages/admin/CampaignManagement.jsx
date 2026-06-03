import React, { useEffect, useState } from 'react';
import { Search, Megaphone, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function CampaignManagement() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getCampaigns();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (err) {
      console.error('Error fetching Campaigns:', err);
      toast.error('Failed to fetch Campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) {
      fetchCampaigns();
      return;
    }
    const lowerSearch = search.toLowerCase();
    const filtered = campaigns.filter(c => 
      c.title.toLowerCase().includes(lowerSearch) || 
      (c.createdBy && c.createdBy.organizationName && c.createdBy.organizationName.toLowerCase().includes(lowerSearch))
    );
    setCampaigns(filtered);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Megaphone size={28} color="#8b5cf6" /> Campaign Management
        </h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '500px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search Campaigns by title or NGO..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '10px 0' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 0, background: '#8b5cf6', color: '#fff' }}>Search</button>
        </form>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}><div className="spinner" style={{ margin: 'auto' }}></div></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Campaign Title</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Created By (NGO)</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Funding Goal</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Created On</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No campaigns found.</td>
                  </tr>
                ) : campaigns.map(campaign => (
                  <tr key={campaign._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '15px' }}>{campaign.title}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>{campaign.createdBy?.organizationName || 'Unknown NGO'}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{campaign.createdBy?.email}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--green)' }}>Raised: ₹{campaign.raised}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Goal: ₹{campaign.goal}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        background: campaign.status === 'active' ? 'var(--blue)20' : 'var(--green)20',
                        color: campaign.status === 'active' ? 'var(--blue)' : 'var(--green)',
                        textTransform: 'capitalize'
                      }}>
                        {campaign.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {new Date(campaign.date || campaign.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
