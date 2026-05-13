import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import RescuerDashboard from './pages/rescuer/RescuerDashboard';
import NGODashboard from './pages/ngo/NGODashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import HomePage from './pages/common/HomePage';
import ServicesPage from './pages/common/ServicesPage';
import AboutPage from './pages/common/AboutPage';
import ContactPage from './pages/common/ContactPage';
import ReportPage from './pages/common/ReportPage';

// ── Protected Route ────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p style={{ color: 'var(--text-secondary)' }}>Loading PashuRashak...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}`} replace />;
  return children;
};

// ── Role redirect ─────────────────────────────────────────────────────────────
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
};

// ── Public Route (redirect if already logged in) ──────────────────────────────
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={`/${user.role}`} replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/rescuer" element={<ProtectedRoute allowedRole="rescuer"><RescuerDashboard /></ProtectedRoute>} />
      <Route path="/ngo" element={<ProtectedRoute allowedRole="ngo"><NGODashboard /></ProtectedRoute>} />
      <Route path="/doctor" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1a1a2e', color: '#f0f0f5', border: '1px solid rgba(255,255,255,0.1)' },
              duration: 4000,
            }}
          />
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
