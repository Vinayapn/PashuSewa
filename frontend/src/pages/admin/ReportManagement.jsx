import React, { useEffect, useState } from 'react';
import { Search, Filter, AlertTriangle, MapPin, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function ReportManagement() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAlerts();
      if (data.success) {
        let filteredData = data.data;
        if (statusFilter !== 'all') {
          filteredData = filteredData.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase());
        }
        setAlerts(filteredData);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      toast.error('Failed to fetch reports/alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // basic client side search for title or description
    if (!search) {
      fetchAlerts();
      return;
    }
    const lowerSearch = search.toLowerCase();
    const filtered = alerts.filter(a => 
      a.title.toLowerCase().includes(lowerSearch) || 
      a.description.toLowerCase().includes(lowerSearch)
    );
    setAlerts(filtered);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'var(--red)';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return 'var(--blue)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#eab308';
      case 'active': return 'var(--blue)';
      case 'inprogress': return '#f97316';
      case 'resolved': return 'var(--green)';
      case 'cancelled': return 'var(--red)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Reports & Complaints</h2>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, minWidth: '300px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search reports..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '10px 0' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 0 }}>Search</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <Filter size={20} color="var(--text-muted)" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '10px 0', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inprogress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="cancelled">Cancelled</option>
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
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Report Details</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Reporter</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Severity</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No reports found.</td>
                  </tr>
                ) : alerts.map(alert => (
                  <tr key={alert._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <AlertTriangle size={16} color={getSeverityColor(alert.severity)} />
                          {alert.title}
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {alert.description}
                        </p>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} /> {alert.address || 'Location provided via coordinates'}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="var(--text-secondary)" />
                        <div>
                          <p style={{ margin: 0, fontSize: '14px' }}>{alert.createdBy?.name || 'Unknown'}</p>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{alert.createdBy?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '11px', 
                        fontWeight: '600',
                        background: `${getSeverityColor(alert.severity)}20`,
                        color: getSeverityColor(alert.severity),
                        border: `1px solid ${getSeverityColor(alert.severity)}40`
                      }}>
                        {alert.severity}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        background: `${getStatusColor(alert.status)}20`,
                        color: getStatusColor(alert.status)
                      }}>
                        {alert.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '18px' }}>
                        {new Date(alert.createdAt).toLocaleTimeString()}
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
