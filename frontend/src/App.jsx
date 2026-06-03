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
  const userRole = (user.role || 'user').trim().toLowerCase();
  if (allowedRole && userRole !== allowedRole.toLowerCase()) return <Navigate to={`/${userRole}`} replace />;
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
  if (user) {
    const role = (user.role || 'user').trim().toLowerCase();
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'user') return <Navigate to="/" replace />;
    return <Navigate to={`/${role}`} replace />;
  }
  return children;
};

// ── Root Route (redirect admins) ──────────────────────────────────────────────
const RootRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  const role = user ? (user.role || 'user').trim().toLowerCase() : null;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return children;
};

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ReportManagement from './pages/admin/ReportManagement';
import NGOManagement from './pages/admin/NGOManagement';
import DoctorManagement from './pages/admin/DoctorManagement';
import RescuerManagement from './pages/admin/RescuerManagement';
import CampaignManagement from './pages/admin/CampaignManagement';
import DonationManagement from './pages/admin/DonationManagement';
import AdminSettings from './pages/admin/AdminSettings';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute><HomePage /></RootRoute>} />
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
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        {/* Placeholder routes for other admin sections */}
        <Route path="ngos" element={<NGOManagement />} />
        <Route path="doctors" element={<DoctorManagement />} />
        <Route path="rescuers" element={<RescuerManagement />} />
        <Route path="campaigns" element={<CampaignManagement />} />
        <Route path="donations" element={<DonationManagement />} />
        <Route path="reports" element={<ReportManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

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
