import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Droplet, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'DONOR' | 'PATIENT' | 'HOSPITAL'>('DONOR');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    city: '',
    bloodGroup: 'O+',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await register({
        ...formData,
        role,
      });
      if (user.role === 'DONOR') navigate('/donor/dashboard');
      else if (user.role === 'PATIENT') navigate('/patient/dashboard');
      else if (user.role === 'HOSPITAL') navigate('/hospital/dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
        <p className="text-sm text-white/50 mt-1">Join the verified BloodConnect network</p>
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-navy-800/80 rounded-2xl border border-white/10 mb-6">
        {(['DONOR', 'PATIENT', 'HOSPITAL'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              role === r
                ? 'bg-red-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wider">
            {role === 'HOSPITAL' ? 'Hospital Name' : 'Full Name'}
          </label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder={role === 'HOSPITAL' ? 'Apex Care Hospital' : 'John Doe'}
              className="input-field pl-11"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@domain.com"
              className="input-field pl-11"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="input-field pl-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wider">
              Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+1 555-0199"
                className="input-field pl-9 text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wider">
              City
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New York"
                className="input-field pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Conditional Blood Group for Donor */}
        {role === 'DONOR' && (
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wider">
              Blood Group
            </label>
            <div className="relative">
              <Droplet className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400" />
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="input-field pl-11 bg-navy-800 text-white"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg} className="bg-navy-800 text-white">
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-white/60">
        Already registered?{' '}
        <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-4">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
};
