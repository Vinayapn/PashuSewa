import React, { useEffect, useState } from 'react';
import { Search, HeartHandshake, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function DonationManagement() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getDonations();
      if (data.success) {
        setDonations(data.data);
      }
    } catch (err) {
      console.error('Error fetching Donations:', err);
      toast.error('Failed to fetch Donations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) {
      fetchDonations();
      return;
    }
    const lowerSearch = search.toLowerCase();
    const filtered = donations.filter(d => 
      d.donor.toLowerCase().includes(lowerSearch) || 
      d.campaign.toLowerCase().includes(lowerSearch) ||
      (d.ngo && d.ngo.organizationName && d.ngo.organizationName.toLowerCase().includes(lowerSearch))
    );
    setDonations(filtered);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HeartHandshake size={28} color="#ec4899" /> Donation Management
        </h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '500px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search Donations by donor, campaign, or NGO..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '10px 0' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 0, background: '#ec4899', color: '#fff' }}>Search</button>
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
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Donor Details</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Amount & Method</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Campaign / NGO</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No donations found.</td>
                  </tr>
                ) : donations.map(donation => (
                  <tr key={donation._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '15px' }}>{donation.donor}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{donation.email || 'No email provided'}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: 'var(--green)' }}>₹{donation.amount}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Method: {donation.method}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{donation.campaign}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>To: {donation.ngo?.organizationName || 'Unknown NGO'}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        background: donation.status === 'completed' ? 'var(--green)20' : donation.status === 'failed' ? 'var(--red)20' : '#eab30820',
                        color: donation.status === 'completed' ? 'var(--green)' : donation.status === 'failed' ? 'var(--red)' : '#eab308',
                        textTransform: 'capitalize'
                      }}>
                        {donation.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {new Date(donation.date).toLocaleDateString()}
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
