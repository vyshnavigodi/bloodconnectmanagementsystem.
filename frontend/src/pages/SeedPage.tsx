import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import api from '../services/api';

export const SeedPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await api.post('/seed');
      setResult(res.data?.message || 'Database seeded successfully with default users & mock records.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Seeding failed or backend seed route unreachable.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'ADMIN', email: 'admin@bloodconnect.org', pass: 'Admin@123' },
    { role: 'DONOR', email: 'donor@bloodconnect.org', pass: 'Donor@123' },
    { role: 'PATIENT', email: 'patient@bloodconnect.org', pass: 'Patient@123' },
    { role: 'HOSPITAL', email: 'hospital@bloodconnect.org', pass: 'Hospital@123' },
    { role: 'STAFF', email: 'staff@bloodconnect.org', pass: 'Staff@123' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Database className="w-6 h-6 text-red-500" />
          <span>Development Database Seeder</span>
        </h2>
        <p className="text-sm text-white/50">
          Reset or initialize test accounts, blood banks, inventories, and sample requests.
        </p>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Seed Initial Data</h3>
          <p className="text-xs text-white/60 mt-1">
            Calls POST /api/seed on the backend to insert fresh demonstration credentials.
          </p>
        </div>

        {result && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{result}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={loading}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-sm"
        >
          {loading ? <LoadingSpinner size="sm" /> : <Database className="w-4 h-4" />}
          <span>Trigger Backend Seed</span>
        </button>
      </div>

      {/* Demo Credentials Table */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white">Configured Demo Credentials</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase text-white/40 bg-white/5 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Default Password</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {demoAccounts.map((acc) => (
                <tr key={acc.role}>
                  <td className="py-3 px-4 font-bold text-red-400 font-sans">{acc.role}</td>
                  <td className="py-3 px-4 text-white">{acc.email}</td>
                  <td className="py-3 px-4 text-white/60">{acc.pass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
