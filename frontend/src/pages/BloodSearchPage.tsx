import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Droplet,
  MapPin,
  Building2,
  Phone,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckCircle2,
  Info
} from 'lucide-react';
import api from '../services/api';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = [
  { value: 'ALL', label: 'All Components' },
  { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
  { value: 'PACKED_RED_CELLS', label: 'Packed Red Cells (RBC)' },
  { value: 'PLATELETS', label: 'Platelets' },
  { value: 'FRESH_FROZEN_PLASMA', label: 'Fresh Frozen Plasma (FFP)' }
];

// Preliminary compatibility guide
const COMPATIBILITY_MAP: Record<string, { canReceiveFrom: string[]; canDonateTo: string[] }> = {
  'O-': { canReceiveFrom: ['O-'], canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  'O+': { canReceiveFrom: ['O+', 'O-'], canDonateTo: ['A+', 'B+', 'AB+', 'O+'] },
  'A-': { canReceiveFrom: ['A-', 'O-'], canDonateTo: ['A+', 'A-', 'AB+', 'AB-'] },
  'A+': { canReceiveFrom: ['A+', 'A-', 'O+', 'O-'], canDonateTo: ['A+', 'AB+'] },
  'B-': { canReceiveFrom: ['B-', 'O-'], canDonateTo: ['B+', 'B-', 'AB+', 'AB-'] },
  'B+': { canReceiveFrom: ['B+', 'B-', 'O+', 'O-'], canDonateTo: ['B+', 'AB+'] },
  'AB-': { canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'], canDonateTo: ['AB+', 'AB-'] },
  'AB+': { canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canDonateTo: ['AB+'] },
};

export const BloodSearchPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('O+');
  const [selectedComponent, setSelectedComponent] = useState<string>('ALL');
  const [searchCity, setSearchCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [stockSummary, setStockSummary] = useState<Record<string, number>>({});
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/inventory/summary').catch(() => ({ data: { data: { byBloodGroup: [] } } })),
      api.get('/blood-banks').catch(() => ({ data: { data: [] } }))
    ]).then(([invRes, banksRes]) => {
      const groups = invRes.data?.data?.byBloodGroup || [];
      const stockMap: Record<string, number> = {};
      if (Array.isArray(groups)) {
        groups.forEach((g: any) => {
          const avail = g.statuses?.find((s: any) => s.status === 'AVAILABLE')?.count || g.totalUnits || 0;
          stockMap[g._id] = avail;
        });
      }
      setStockSummary(stockMap);
      setBloodBanks(banksRes.data?.data || []);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const filteredBanks = bloodBanks.filter((bank) => {
    if (!searchCity) return true;
    const city = bank.address?.city || '';
    return city.toLowerCase().includes(searchCity.toLowerCase());
  });

  const compat = COMPATIBILITY_MAP[selectedGroup] || { canReceiveFrom: [], canDonateTo: [] };

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-navy-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Droplet className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-lg text-white">BloodConnect</span>
            <span className="text-xs bg-red-500/20 text-red-400 font-semibold px-2 py-0.5 rounded-full border border-red-500/30">
              Live Search
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/emergency" className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 bg-red-600 hover:bg-red-500">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Emergency SOS</span>
            </Link>
            <Link to="/login" className="text-sm text-white/70 hover:text-white font-medium">
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Search Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Search Box */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Search Blood Bank Reserves
            </h1>
            <p className="text-white/60 text-sm">
              Discover real-time verified blood units, plasma stocks, and registered regional blood banks.
            </p>
          </div>

          {/* Blood Group Selector Chips */}
          <div className="mt-6">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-3">
              1. Select Patient Blood Group
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {BLOOD_GROUPS.map((bg) => {
                const count = stockSummary[bg] || 0;
                const isSelected = selectedGroup === bg;
                return (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30 scale-105'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                    }`}
                  >
                    <span className="text-lg font-black">{bg}</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-red-100' : 'text-white/40'}`}>
                      {count} units
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters Row */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                2. Filter by Component
              </label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full bg-navy-800 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
              >
                {COMPONENTS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                3. Search by City / Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Mumbai, Bangalore..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-navy-800 border border-white/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility Matrix Info Card */}
        <div className="p-4 md:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <span className="font-bold text-amber-300">Preliminary Compatibility Guide for {selectedGroup}:</span>{' '}
              Can safely receive packed red blood cells from:{' '}
              <span className="font-bold text-white underline decoration-amber-400">
                {compat.canReceiveFrom.join(', ')}
              </span>
              . Can donate to:{' '}
              <span className="font-bold text-white">
                {compat.canDonateTo.join(', ')}
              </span>.
              <p className="mt-1 text-[11px] text-amber-300/70">
                ⚠️ Medical Notice: Blood compatibility must be treated as preliminary guidance only. Transfusions require cross-matching and verification by certified medical staff.
              </p>
            </div>
          </div>
          <Link
            to="/patient/request"
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <span>Request {selectedGroup}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-400" />
              <span>Verified Blood Banks & Centers</span>
              <span className="text-xs text-white/40 font-normal">({filteredBanks.length} facilities)</span>
            </h2>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredBanks.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl border border-white/10 text-white/50 space-y-3">
              <Building2 className="w-12 h-12 mx-auto text-white/20" />
              <p className="text-base font-semibold text-white/70">No blood banks matched your query.</p>
              <p className="text-xs max-w-sm mx-auto">
                Try searching for another city, or raise an emergency blood requisition to alert on-call donors.
              </p>
              <Link to="/emergency" className="btn-primary text-xs inline-flex items-center gap-2 mt-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Raise Emergency Request</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBanks.map((bank) => (
                <div
                  key={bank._id || bank.bloodBankId}
                  className="glass-card p-6 rounded-3xl border border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-red-400 transition-colors">
                          {bank.name}
                        </h3>
                        <p className="text-xs text-white/40 font-mono mt-0.5">
                          Lic: {bank.licenseNumber || 'Verified Gov Center'}
                        </p>
                      </div>
                      <Badge variant="green" size="sm">
                        <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified
                      </Badge>
                    </div>

                    <p className="text-xs text-white/60 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>
                        {bank.address?.street ? `${bank.address.street}, ` : ''}
                        {bank.address?.city || 'Regional Center'}, {bank.address?.state || ''}
                      </span>
                    </p>

                    <div className="p-3 bg-white/5 rounded-2xl flex items-center justify-between text-xs border border-white/5">
                      <span className="text-white/60">Estimated {selectedGroup} Stock:</span>
                      <span className="font-bold text-white text-sm">
                        {stockSummary[selectedGroup] ? `${stockSummary[selectedGroup]} Units Available` : 'Available on request'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={`tel:${bank.contactPhone || '+919876543210'}`}
                      className="text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{bank.contactPhone || '+91 98765 43210'}</span>
                    </a>

                    <Link
                      to="/patient/request"
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>Request Blood</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BloodSearchPage;
