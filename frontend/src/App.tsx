import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Layouts — loaded eagerly (small, always needed)
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Public & Common Pages — lazy loaded
const LandingPage        = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage          = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage       = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const VerifyCertificate  = lazy(() => import('./pages/VerifyCertificate').then(m => ({ default: m.VerifyCertificate })));
const SeedPage           = lazy(() => import('./pages/SeedPage').then(m => ({ default: m.SeedPage })));
const BloodSearchPage    = lazy(() => import('./pages/BloodSearchPage').then(m => ({ default: m.BloodSearchPage })));
const EmergencyPage      = lazy(() => import('./pages/EmergencyPage').then(m => ({ default: m.EmergencyPage })));
const CampsPage          = lazy(() => import('./pages/CampsPage').then(m => ({ default: m.CampsPage })));
const NotificationsPage  = lazy(() => import('./pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Donor Pages — lazy loaded
const DonorDashboard    = lazy(() => import('./pages/donor/DonorDashboard').then(m => ({ default: m.DonorDashboard })));
const DonorHistory      = lazy(() => import('./pages/donor/DonorHistory').then(m => ({ default: m.DonorHistory })));
const DonorCertificates = lazy(() => import('./pages/donor/DonorCertificates').then(m => ({ default: m.DonorCertificates })));
const DonorAlerts       = lazy(() => import('./pages/donor/DonorAlerts').then(m => ({ default: m.DonorAlerts })));
const DonorProfile      = lazy(() => import('./pages/donor/DonorProfile').then(m => ({ default: m.DonorProfile })));

// Patient Pages — lazy loaded
const PatientDashboard  = lazy(() => import('./pages/patient/PatientDashboard').then(m => ({ default: m.PatientDashboard })));
const CreateRequest     = lazy(() => import('./pages/patient/CreateRequest').then(m => ({ default: m.CreateRequest })));
const PatientRequests   = lazy(() => import('./pages/patient/PatientRequests').then(m => ({ default: m.PatientRequests })));

// Hospital Pages — lazy loaded
const HospitalDashboard = lazy(() => import('./pages/hospital/HospitalDashboard').then(m => ({ default: m.HospitalDashboard })));
const HospitalRequests  = lazy(() => import('./pages/hospital/HospitalRequests').then(m => ({ default: m.HospitalRequests })));
const HospitalInventory = lazy(() => import('./pages/hospital/HospitalInventory').then(m => ({ default: m.HospitalInventory })));

// Admin Pages — lazy loaded
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const UserManagement    = lazy(() => import('./pages/admin/UserManagement').then(m => ({ default: m.UserManagement })));
const AnalyticsPage     = lazy(() => import('./pages/admin/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const AdminSettings     = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If not matching role, redirect to appropriate home
    if (user.role === 'DONOR') return <Navigate to="/donor/dashboard" replace />;
    if (user.role === 'PATIENT') return <Navigate to="/patient/dashboard" replace />;
    if (user.role === 'HOSPITAL') return <Navigate to="/hospital/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

const PageFallback = () => (
  <div className="min-h-screen bg-navy-900 flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public Landing & Discovery Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<BloodSearchPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/camps" element={<CampsPage />} />
          <Route path="/verify/:certId" element={<VerifyCertificate />} />
          <Route path="/seed" element={<SeedPage />} />

          {/* Auth Layout Pages */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Shared Notifications Route for Logged-In Users */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Donor Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['DONOR', 'ADMIN', 'STAFF']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/donor/dashboard" element={<DonorDashboard />} />
            <Route path="/donor/history" element={<DonorHistory />} />
            <Route path="/donor/certificates" element={<DonorCertificates />} />
            <Route path="/donor/alerts" element={<DonorAlerts />} />
            <Route path="/donor/camps" element={<CampsPage />} />
            <Route path="/donor/profile" element={<DonorProfile />} />
          </Route>

          {/* Patient Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['PATIENT', 'ADMIN', 'STAFF']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/request" element={<CreateRequest />} />
            <Route path="/patient/requests" element={<PatientRequests />} />
            <Route path="/patient/search" element={<BloodSearchPage />} />
            <Route path="/patient/camps" element={<CampsPage />} />
            <Route path="/patient/profile" element={<DonorProfile />} />
          </Route>

          {/* Hospital Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['HOSPITAL', 'ADMIN', 'STAFF']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
            <Route path="/hospital/requests" element={<HospitalRequests />} />
            <Route path="/hospital/inventory" element={<HospitalInventory />} />
            <Route path="/hospital/camps" element={<CampsPage />} />
            <Route path="/hospital/profile" element={<DonorProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/inventory" element={<HospitalInventory />} />
            <Route path="/admin/requests" element={<HospitalRequests />} />
            <Route path="/admin/camps" element={<CampsPage />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* 404 Not Found Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
