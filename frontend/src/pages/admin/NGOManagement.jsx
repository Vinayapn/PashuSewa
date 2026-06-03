import React, { useEffect, useState } from 'react';
import { Search, Building2, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function NGOManagement() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers('ngo', search);
      if (data.success) {
        setNgos(data.data);
      }
    } catch (err) {
      console.error('Error fetching NGOs:', err);
      toast.error('Failed to fetch NGOs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNgos();
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const { data } = await adminAPI.updateUserStatus(id, !currentStatus);
      if (data.success) {
        toast.success(data.message);
        setNgos(ngos.map(n => n._id === id ? { ...n, isActive: !currentStatus } : n));
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
          <Building2 size={28} color="var(--orange)" /> NGO Management
        </h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '500px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search NGOs by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '10px 0' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 0, background: 'var(--orange)', color: '#000' }}>Search</button>
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
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Organization Details</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Contact Info</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Joined Date</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ngos.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No NGOs found matching your criteria.</td>
                  </tr>
                ) : ngos.map(ngo => (
                  <tr key={ngo._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--orange)20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--orange)' }}>
                          {ngo.organizationName ? ngo.organizationName.charAt(0).toUpperCase() : 'N'}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', fontSize: '15px' }}>{ngo.organizationName || 'Unnamed NGO'}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Rep: {ngo.name}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ margin: 0, fontSize: '13px' }}>{ngo.email}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{ngo.phone || 'No phone provided'}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {ngo.isActive ? (
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
                      {new Date(ngo.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button 
                        onClick={() => toggleUserStatus(ngo._id, ngo.isActive)}
                        title={ngo.isActive ? "Suspend NGO" : "Activate NGO"}
                        style={{ background: 'transparent', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px', color: ngo.isActive ? 'var(--orange)' : 'var(--green)', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                      >
                        {ngo.isActive ? 'Suspend' : 'Activate'}
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
