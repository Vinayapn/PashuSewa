import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'PashuRashak ReliefLink',
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    smsAlerts: false,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings updated successfully!');
      setLoading(false);
    }, 800);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={28} color="var(--blue)" /> Platform Settings
        </h2>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {loading ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* General Settings */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={20} color="var(--blue)" /> General
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Platform Name</label>
            <input 
              type="text" 
              value={settings.siteName} 
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
            <div>
              <p style={{ margin: 0, fontWeight: '500' }}>Maintenance Mode</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Disable public access to the platform</p>
            </div>
            <button 
              onClick={() => handleToggle('maintenanceMode')}
              style={{ width: '44px', height: '24px', borderRadius: '12px', background: settings.maintenanceMode ? 'var(--blue)' : 'var(--bg-main)', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
            >
              <span style={{ position: 'absolute', top: '2px', left: settings.maintenanceMode ? '22px' : '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: '0.3s' }}></span>
            </button>
          </div>
        </div>

        {/* Security & Access */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--orange)" /> Security & Access
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div>
              <p style={{ margin: 0, fontWeight: '500' }}>Allow New Registrations</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Users can create new accounts</p>
            </div>
            <button 
              onClick={() => handleToggle('allowRegistrations')}
              style={{ width: '44px', height: '24px', borderRadius: '12px', background: settings.allowRegistrations ? 'var(--green)' : 'var(--bg-main)', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
            >
              <span style={{ position: 'absolute', top: '2px', left: settings.allowRegistrations ? '22px' : '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: '0.3s' }}></span>
            </button>
          </div>
          <div style={{ marginTop: '16px', padding: '16px', background: 'var(--orange)10', borderRadius: '8px', border: '1px solid var(--orange)30' }}>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--orange)' }}>
              <strong>Note:</strong> Admin accounts can only be created directly via database seeding for security purposes.
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--green)" /> Notifications
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div>
              <p style={{ margin: 0, fontWeight: '500' }}>Admin Email Alerts</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Receive emails for critical reports</p>
            </div>
            <button 
              onClick={() => handleToggle('emailNotifications')}
              style={{ width: '44px', height: '24px', borderRadius: '12px', background: settings.emailNotifications ? 'var(--green)' : 'var(--bg-main)', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
            >
              <span style={{ position: 'absolute', top: '2px', left: settings.emailNotifications ? '22px' : '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: '0.3s' }}></span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
            <div>
              <p style={{ margin: 0, fontWeight: '500' }}>SMS Alerts</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Receive SMS for SOS alerts</p>
            </div>
            <button 
              onClick={() => handleToggle('smsAlerts')}
              style={{ width: '44px', height: '24px', borderRadius: '12px', background: settings.smsAlerts ? 'var(--green)' : 'var(--bg-main)', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
            >
              <span style={{ position: 'absolute', top: '2px', left: settings.smsAlerts ? '22px' : '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: '0.3s' }}></span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
