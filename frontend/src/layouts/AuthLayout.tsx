import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy-900 bg-hero-gradient flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="mb-8 text-center z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-xl shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Droplet className="w-7 h-7 text-white fill-white" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-2xl tracking-tight text-white">BloodConnect</span>
            <p className="text-xs text-red-400 font-semibold tracking-wide">EMERGENCY NETWORK</p>
          </div>
        </Link>
      </div>

      {/* Auth Content Container */}
      <div className="w-full max-w-md z-10">
        <Outlet />
      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-white/40 z-10">
        &copy; {new Date().getFullYear()} BloodConnect. Real-time Blood Supply & Donor Coordination.
      </div>
    </div>
  );
};
