import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    { label: 'Admin', email: 'admin@bloodconnect.org', pass: 'Admin@123', role: 'ADMIN' },
    { label: 'Donor', email: 'donor@bloodconnect.org', pass: 'Donor@123', role: 'DONOR' },
    { label: 'Patient', email: 'patient@bloodconnect.org', pass: 'Patient@123', role: 'PATIENT' },
    { label: 'Hospital', email: 'hospital@bloodconnect.org', pass: 'Hospital@123', role: 'HOSPITAL' },
    { label: 'Staff', email: 'staff@bloodconnect.org', pass: 'Staff@123', role: 'STAFF' },
  ];

  const fillCredentials = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      const role = user.role;
      if (role === 'DONOR') navigate('/donor/dashboard');
      else if (role === 'PATIENT') navigate('/patient/dashboard');
      else if (role === 'HOSPITAL') navigate('/hospital/dashboard');
      else if (role === 'ADMIN' || role === 'STAFF') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-white">Sign In to BloodConnect</h2>
        <p className="text-sm text-white/50 mt-1">Access your secure blood coordination dashboard</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bloodconnect.org"
              className="input-field pl-11"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-11"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Fast-Fill */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-xs text-center font-semibold text-white/60 mb-3 uppercase tracking-wider">
          Quick Demo Credentials
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {demoAccounts.map((acc) => (
            <button
              key={acc.label}
              type="button"
              onClick={() => fillCredentials(acc)}
              className="px-2.5 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-colors text-center truncate"
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-white/60">
        Don't have an account?{' '}
        <Link to="/register" className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-4">
          Register now
        </Link>
      </div>
    </motion.div>
  );
};
