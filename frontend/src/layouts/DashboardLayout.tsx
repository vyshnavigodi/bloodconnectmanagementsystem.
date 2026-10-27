import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from '../components/notifications/NotificationBell';
import {
  Activity,
  Heart,
  Calendar,
  Award,
  Bell,
  User,
  PlusCircle,
  FileText,
  Building2,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Droplet,
  Database,
  Search,
  AlertTriangle
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case 'DONOR':
        return [
          { to: '/donor/dashboard', label: 'Dashboard', icon: Activity },
          { to: '/donor/history', label: 'Donation History', icon: Calendar },
          { to: '/donor/certificates', label: 'Certificates', icon: Award },
          { to: '/donor/alerts', label: 'Emergency Alerts', icon: AlertTriangle },
          { to: '/donor/camps', label: 'Donation Drives', icon: Heart },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/donor/profile', label: 'My Profile', icon: User },
        ];
      case 'PATIENT':
        return [
          { to: '/patient/dashboard', label: 'Dashboard', icon: Activity },
          { to: '/patient/search', label: 'Search Blood', icon: Search },
          { to: '/patient/request', label: 'New Request', icon: PlusCircle },
          { to: '/patient/requests', label: 'My Requests', icon: FileText },
          { to: '/emergency', label: 'Emergency SOS', icon: AlertTriangle },
          { to: '/patient/camps', label: 'Donation Camps', icon: Heart },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/patient/profile', label: 'My Profile', icon: User },
        ];
      case 'HOSPITAL':
        return [
          { to: '/hospital/dashboard', label: 'Dashboard', icon: Activity },
          { to: '/hospital/requests', label: 'Blood Requests', icon: FileText },
          { to: '/hospital/inventory', label: 'Inventory & Cold-Chain', icon: Package },
          { to: '/hospital/camps', label: 'Donation Camps', icon: Heart },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/hospital/profile', label: 'Hospital Profile', icon: Building2 },
        ];
      case 'ADMIN':
      case 'STAFF':
      default:
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: Activity },
          { to: '/admin/users', label: 'User Management', icon: Users },
          { to: '/admin/analytics', label: 'Analytics & Reports', icon: BarChart3 },
          { to: '/hospital/inventory', label: 'Blood Units & Stock', icon: Package },
          { to: '/hospital/requests', label: 'All Requests & Issue', icon: FileText },
          { to: '/admin/camps', label: 'Donation Drives', icon: Heart },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/admin/settings', label: 'System Settings', icon: Settings },
          { to: '/seed', label: 'Seed Data (Dev)', icon: Database },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-navy-900 text-white flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-navy-800/90 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Droplet className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                BloodConnect
              </span>
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">{user?.role || 'PORTAL'}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout in Sidebar bottom */}
        <div className="p-4 border-t border-white/10 bg-navy-900/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-300 font-bold text-sm">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">{user?.fullName || 'User'}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-navy-800/40 backdrop-blur-md border-b border-white/10 px-6 sm:px-8 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Welcome back, {user?.fullName || 'User'}
              </h1>
              <p className="text-xs text-white/50 hidden sm:block">
                Lifesaving Blood Management & Emergency Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-white/10">
              {user?.bloodGroup && (
                <span className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold rounded-lg flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-red-400" />
                  {user.bloodGroup}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-navy-900 to-black">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
