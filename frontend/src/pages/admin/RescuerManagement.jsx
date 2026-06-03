import React, { useEffect, useState } from 'react';
import { Search, HardHat } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function RescuerManagement() {
  const [rescuers, setRescuers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRescuers();
  }, []);

  const fetchRescuers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers('rescuer', search);
      if (data.success) {
        setRescuers(data.data);
      }
    } catch (err) {
      console.error('Error fetching Rescuers:', err);
      toast.error('Failed to fetch Rescuers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRescuers();
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const { data } = await adminAPI.updateUserStatus(id, !currentStatus);
      if (data.success) {
        toast.success(data.message);
        setRescuers(rescuers.map(r => r._id === id ? { ...r, isActive: !currentStatus } : r));
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HardHat size={28} color="var(--red)" /> Rescuer Management
        </h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '500px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search Rescuers by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '10px 0' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 0, background: 'var(--red)', color: '#fff' }}>Search</button>
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
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Rescuer Details</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Team ID & Contact</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Joined Date</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rescuers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No rescuers found matching your criteria.</td>
                  </tr>
                ) : rescuers.map(rescuer => (
                  <tr key={rescuer._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--red)20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--red)' }}>
                          {rescuer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', fontSize: '15px' }}>{rescuer.name}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Field Rescuer</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Team: {rescuer.teamId || 'N/A'}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{rescuer.email}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {rescuer.isActive ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--green)', fontSize: '13px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }}></span> Active
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--red)', fontSize: '13px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)' }}></span> Suspended
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {new Date(rescuer.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button 
                        onClick={() => toggleUserStatus(rescuer._id, rescuer.isActive)}
                        title={rescuer.isActive ? "Suspend Rescuer" : "Activate Rescuer"}
                        style={{ background: 'transparent', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px', color: rescuer.isActive ? 'var(--orange)' : 'var(--green)', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                      >
                        {rescuer.isActive ? 'Suspend' : 'Activate'}
                      </button>
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
