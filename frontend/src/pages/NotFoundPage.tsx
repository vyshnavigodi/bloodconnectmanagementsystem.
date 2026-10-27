import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ArrowLeft, Home, Search, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-card max-w-lg w-full p-8 md:p-12 rounded-3xl border border-white/10 text-center relative z-10 shadow-2xl backdrop-blur-2xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30">
          <Droplet className="w-10 h-10 text-white fill-white animate-bounce" />
        </div>

        <h1 className="text-6xl font-black tracking-tight text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-white/60 text-sm mb-8 leading-relaxed">
          The requested blood bank node, page, or clinical record could not be located in our distributed network.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/search"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2 border border-white/10 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search Blood</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
