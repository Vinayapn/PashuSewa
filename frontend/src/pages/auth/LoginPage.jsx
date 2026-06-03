import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.user, data.token);
      toast.success(data.message || 'Login successful!');
      const role = (data.user.role || 'user').trim().toLowerCase();
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'user') {
        navigate('/', { replace: true });
      } else {
        navigate(`/${role}`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = { rescuer: { emoji: '🦺', color: 'var(--orange)' }, ngo: { emoji: '🏥', color: 'var(--blue)' }, doctor: { emoji: '👨‍⚕️', color: 'var(--green)' } };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🐾</span>
          <h1>PashuRashak</h1>
          <p>Animal Welfare & Rescue Platform</p>
        </div>

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to access your dashboard</p>

        {error && <div className="alert-banner alert-error">⚠️ {error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handle} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input className="form-input" type={showPw ? 'text' : 'password'} name="password"
                placeholder="Enter your password" value={form.password} onChange={handle} autoComplete="current-password" />
              <button type="button" className="input-icon" onClick={() => setShowPw(p => !p)}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="forgot-link">
            <Link to="/forgot-password" alt="Forgot Password?" className="link-btn" style={{ fontSize: 13, color: 'var(--green)' }}>
              Forgot Password?
            </Link>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} id="login-btn">
            {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Signing in...</> : <><LogIn size={18} />Sign In</>}
          </button>
        </form>

        <div className="divider"><span>Role-based access</span></div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          {Object.entries(roleInfo).map(([role, { emoji, color }]) => (
            <div key={role} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 12, color
            }}>
              {emoji} {role.charAt(0).toUpperCase() + role.slice(1)}
            </div>
          ))}
        </div>
        <p className="auth-link">Don't have an account? <Link to="/register">Create Account</Link></p>
      </div>
    </div>
  );
}
