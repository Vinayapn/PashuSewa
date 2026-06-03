import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { id: 'user', emoji: '👤', name: 'User', desc: 'General public & supporter', activeClass: 'active-user' },
  { id: 'rescuer', emoji: '🦺', name: 'Rescuer', desc: 'Field operations & SOS', activeClass: 'active-rescuer' },
  { id: 'ngo', emoji: '🏥', name: 'NGO', desc: 'Resources & shelters', activeClass: 'active-ngo' },
  { id: 'doctor', emoji: '👨‍⚕️', name: 'Doctor', desc: 'Medical & triage', activeClass: 'active-doctor' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', organizationName: '', licenseNumber: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!role) { setError('Please select your role.'); return; }
    if (!form.name || !form.email || !form.password) { setError('Name, email, and password are required.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (role === 'ngo' && !form.organizationName) { setError('Organization name is required for NGO.'); return; }
    if (role === 'doctor' && !form.licenseNumber) { setError('License number is required for Doctor.'); return; }

    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, password: form.password, role, phone: form.phone };
      if (role === 'ngo') payload.organizationName = form.organizationName;
      if (role === 'doctor') payload.licenseNumber = form.licenseNumber;

      const { data } = await authAPI.register(payload);
      login(data.user, data.token);
      toast.success(data.message || 'Account created!');
      navigate(`/${data.user.role}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <span className="logo-icon">🐾</span>
          <h1>PashuRashak</h1>
          <p>Create your account</p>
        </div>

        <h2 className="auth-title">Register Account</h2>
        <p className="auth-subtitle">Choose your role to get started</p>

        {/* Role Selector */}
        <div className="role-cards">
          {ROLES.map(r => (
            <div key={r.id} className={`role-card ${role === r.id ? r.activeClass : ''}`}
              onClick={() => setRole(r.id)} id={`role-${r.id}`}>
              <span className="role-emoji">{r.emoji}</span>
              <div className="role-name">{r.name}</div>
              <div className="role-desc">{r.desc}</div>
            </div>
          ))}
        </div>

        {error && <div className="alert-banner alert-error">⚠️ {error}</div>}

        {role && (
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" type="text" name="name" placeholder="Enter your Name" value={form.name} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handle} />
            </div>
            {role === 'ngo' && (
              <div className="form-group">
                <label className="form-label">Organization Name *</label>
                <input className="form-input" type="text" name="organizationName" placeholder="Red Cross India" value={form.organizationName} onChange={handle} />
              </div>
            )}
            {role === 'doctor' && (
              <div className="form-group">
                <label className="form-label">Medical License Number *</label>
                <input className="form-input" type="text" name="licenseNumber" placeholder="MCI-12345678" value={form.licenseNumber} onChange={handle} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-wrapper">
                <input className="form-input" type={showPw ? 'text' : 'password'} name="password"
                  placeholder="Min. 6 characters" value={form.password} onChange={handle} />
                <button type="button" className="input-icon" onClick={() => setShowPw(p => !p)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-input" type="password" name="confirmPassword"
                placeholder="Re-enter password" value={form.confirmPassword} onChange={handle} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} id="register-btn">
              {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Creating...</>
                : <><UserPlus size={18} />Create Account</>}
            </button>
          </form>
        )}
        {!role && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, padding: '10px 0' }}>
            👆 Select a role above to continue
          </p>
        )}
        <p className="auth-link" style={{ marginTop: 16 }}>Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}
