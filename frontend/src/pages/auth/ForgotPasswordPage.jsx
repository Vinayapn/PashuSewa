import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const STEPS = { EMAIL: 1, OTP: 2, RESET: 3, DONE: 4 };

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  const sendOTP = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    if (!email) { setError('Email is required.'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      toast.success('OTP sent! Check your email.');
      setStep(STEPS.OTP);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setLoading(false); }
  };

  // ── Resend OTP (clears state first) ───────────────────────────────────────
  const resendOTP = async () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      toast.success('OTP resent! Check your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally { setLoading(false); }
  };

  // ── Step 2: OTP input handler ─────────────────────────────────────────────
  const handleOTPChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOTPKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };
  const handleOTPPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    const otpStr = otp.join('');
    if (otpStr.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }
    setLoading(true);
    try {
      await authAPI.verifyOTP({ email, otp: otpStr });
      toast.success('OTP verified!');
      setStep(STEPS.RESET);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally { setLoading(false); }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!passwords.newPassword || !passwords.confirmPassword) { setError('Please fill both fields.'); return; }
    if (passwords.newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, otp: otp.join(''), newPassword: passwords.newPassword });
      toast.success('Password reset successfully!');
      setStep(STEPS.DONE);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🐾</span>
          <h1>PashuRashak</h1>
          <p>Password Recovery</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
          {['Email', 'OTP', 'Reset'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, background: step > i + 1 ? 'var(--green)' : step === i + 1 ? 'var(--green)' : 'var(--bg-card)',
                color: step >= i + 1 ? 'white' : 'var(--text-muted)', border: `2px solid ${step >= i + 1 ? 'var(--green)' : 'var(--border)'}`,
              }}>{step > i + 1 ? '✓' : i + 1}</div>
              <span style={{ fontSize: 12, color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
              {i < 2 && <div style={{ width: 24, height: 1, background: 'var(--border)' }} />}
            </div>
          ))}
        </div>

        {error && <div className="alert-banner alert-error">⚠️ {error}</div>}

        {/* STEP 1 */}
        {step === STEPS.EMAIL && (
          <form onSubmit={sendOTP}>
            <h2 className="auth-title">Forgot Password</h2>
            <p className="auth-subtitle">Enter your email to receive a 6-digit OTP</p>
            <div className="form-group">
              <label className="form-label"><Mail size={14} style={{ marginRight: 4 }} />Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} id="forgot-email" />
            </div>
            <button className="btn btn-primary" disabled={loading} id="send-otp-btn">
              {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Sending...</> : 'Send OTP'}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === STEPS.OTP && (
          <form onSubmit={verifyOTP}>
            <h2 className="auth-title">Enter OTP</h2>
            <p className="auth-subtitle">We sent a 6-digit code to <strong>{email}</strong></p>
            <div className="otp-row" onPaste={handleOTPPaste}>
              {otp.map((digit, i) => (
                <input key={i} ref={el => otpRefs.current[i] = el} className="otp-input"
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleOTPChange(i, e.target.value)}
                  onKeyDown={e => handleOTPKey(i, e)} id={`otp-${i}`} />
              ))}
            </div>
            <button className="btn btn-primary" disabled={loading || otp.join('').length < 6} id="verify-otp-btn">
              {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Verifying...</> : 'Verify OTP'}
            </button>
            <p className="auth-link" style={{ marginTop: 12 }}>
              Didn't receive it? <button type="button" className="link-btn" disabled={loading} onClick={resendOTP}>Resend OTP</button>
            </p>
          </form>
        )}

        {/* STEP 3 */}
        {step === STEPS.RESET && (
          <form onSubmit={resetPassword}>
            <h2 className="auth-title">New Password</h2>
            <p className="auth-subtitle">Set a strong new password for your account</p>
            <div className="form-group">
              <label className="form-label"><Lock size={14} style={{ marginRight: 4 }} />New Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters"
                value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} id="new-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" placeholder="Re-enter password"
                value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} id="confirm-password" />
            </div>
            <button className="btn btn-primary" disabled={loading} id="reset-password-btn">
              {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Resetting...</> : 'Reset Password'}
            </button>
          </form>
        )}

        {/* STEP 4 */}
        {step === STEPS.DONE && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={60} color="var(--green)" style={{ marginBottom: 16 }} />
            <h2 className="auth-title">Password Reset!</h2>
            <p className="auth-subtitle" style={{ marginBottom: 24 }}>Your password has been updated successfully.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')} id="go-login-btn">
              Go to Login
            </button>
          </div>
        )}

        {step < STEPS.DONE && (
          <p className="auth-link" style={{ marginTop: 16 }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
