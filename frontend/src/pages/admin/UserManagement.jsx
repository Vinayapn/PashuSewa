import React, { useEffect, useState } from 'react';
import { Search, Filter, Edit, Trash2, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers(roleFilter, search);
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const { data } = await adminAPI.updateUserStatus(id, !currentStatus);
      if (data.success) {
        toast.success(data.message);
        setUsers(users.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const { data } = await adminAPI.deleteUser(id);
      if (data.success) {
        toast.success('User deleted successfully');
        setUsers(users.filter(u => u._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'ngo': return '#f97316';
      case 'doctor': return '#10b981';
      case 'rescuer': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>User Management</h2>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, minWidth: '300px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '10px 0' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 0 }}>Search</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <Filter size={20} color="var(--text-muted)" />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '10px 0', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="ngo">NGO</option>
            <option value="doctor">Doctor</option>
            <option value="rescuer">Rescuer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}><div className="spinner" style={{ margin: 'auto' }}></div></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>User</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Role & Info</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Joined</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Last Login</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No users found matching your criteria.</td>
                  </tr>
                ) : users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '600' }}>{user.name}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          background: `${getRoleColor(user.role)}20`,
                          color: getRoleColor(user.role),
                          textTransform: 'capitalize'
                        }}>
                          {user.role}
                        </span>
                        {user.role === 'ngo' && user.organizationName && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Org: {user.organizationName}</span>
                        )}
                        {user.role === 'doctor' && user.licenseNumber && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>License: {user.licenseNumber}</span>
                        )}
                        {user.role === 'rescuer' && user.teamId && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Team ID: {user.teamId}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {user.isActive ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--green)', fontSize: '14px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }}></span> Active
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--red)', fontSize: '14px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)' }}></span> Suspended
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {user.lastLogin ? (
                        <>
                          <div>{new Date(user.lastLogin).toLocaleDateString()}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(user.lastLogin).toLocaleTimeString()}</div>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Never logged in</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {user.role !== 'admin' && (
                          <>
                            <button 
                              onClick={() => toggleUserStatus(user._id, user.isActive)}
                              title={user.isActive ? "Suspend User" : "Activate User"}
                              style={{ background: 'transparent', border: '1px solid var(--border)', padding: '8px', borderRadius: '8px', color: user.isActive ? 'var(--orange)' : 'var(--green)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {user.isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
                            </button>
                            <button 
                              onClick={() => deleteUser(user._id)}
                              title="Delete User"
                              style={{ background: 'transparent', border: '1px solid var(--border)', padding: '8px', borderRadius: '8px', color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                        {user.role === 'admin' && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Protected</span>}
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
