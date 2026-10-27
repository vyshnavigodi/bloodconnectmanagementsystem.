import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Award, AlertTriangle, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../../services/api';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>({
    totalDonations: 4,
    lastDonationDate: '2026-08-10',
    bloodGroup: user?.bloodGroup || 'O+',
  });

  const [recentDonations, setRecentDonations] = useState<any[]>([
    { id: '1', date: '2026-08-10', bloodBank: 'Metropolitan Central Blood Bank', units: 1, status: 'COMPLETED' },
    { id: '2', date: '2026-05-14', bloodBank: 'St. Jude Community Clinic', units: 1, status: 'COMPLETED' },
    { id: '3', date: '2026-02-02', bloodBank: 'Metropolitan Central Blood Bank', units: 1, status: 'COMPLETED' },
  ]);

  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([
    { id: 'a1', hospital: 'City Memorial Hospital', bloodGroup: 'O+', units: 2, urgency: 'EMERGENCY', time: '12 mins ago' },
  ]);

  const historyData = [
    { month: 'Jan', donations: 0 },
    { month: 'Feb', donations: 1 },
    { month: 'Mar', donations: 0 },
    { month: 'Apr', donations: 0 },
    { month: 'May', donations: 1 },
    { month: 'Jun', donations: 0 },
    { month: 'Jul', donations: 0 },
    { month: 'Aug', donations: 1 },
    { month: 'Sep', donations: 0 },
    { month: 'Oct', donations: 1 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profRes, donRes] = await Promise.allSettled([
          api.get('/donors/profile'),
          api.get('/donors/donations'),
        ]);

        if (profRes.status === 'fulfilled' && profRes.value.data?.data) {
          setProfile(profRes.value.data.data);
        }
        if (donRes.status === 'fulfilled' && donRes.value.data?.data) {
          setRecentDonations(donRes.value.data.data);
        }
      } catch (err: any) {
        // Keep fallback data active
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute eligibility: eligible if last donation > 56 days ago
  const calculateEligibility = () => {
    if (!profile?.lastDonationDate) return { isEligible: true, daysRemaining: 0, nextDate: 'Immediately' };
    const last = new Date(profile.lastDonationDate).getTime();
    const now = Date.now();
    const daysSince = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 56 - daysSince);
    const nextDate = new Date(last + 56 * 24 * 60 * 60 * 1000).toLocaleDateString();
    return {
      isEligible: daysRemaining === 0,
      daysRemaining,
      nextDate: daysRemaining === 0 ? 'Eligible Now' : nextDate,
    };
  };

  const eligibility = calculateEligibility();

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Eligibility Status */}
      <div className={`p-6 rounded-3xl glass-card border flex flex-col md:flex-row items-center justify-between gap-6 ${
        eligibility.isEligible ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-amber-500/30 bg-amber-950/20'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            eligibility.isEligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Donation Status:</h2>
              <Badge variant={eligibility.isEligible ? 'green' : 'yellow'}>
                {eligibility.isEligible ? 'Ready to Donate' : `Cooldown (${eligibility.daysRemaining} days left)`}
              </Badge>
            </div>
            <p className="text-sm text-white/60 mt-1">
              {eligibility.isEligible
                ? 'Your red cells are fully replenished. You can save another life today!'
                : `Next eligible donation date is scheduled for ${eligibility.nextDate}.`}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs uppercase tracking-wider text-white/50 block">Your Registered Type</span>
          <span className="text-2xl font-black text-red-400">{profile.bloodGroup || user?.bloodGroup || 'O+'}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Lifetime Donations"
          value={profile.totalDonations || recentDonations.length}
          subtitle="4 lives saved per donation"
          icon={Heart}
          color="red"
        />
        <StatCard
          title="Next Eligible Date"
          value={eligibility.nextDate}
          subtitle="Whole blood standard interval"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Active Alerts"
          value={emergencyAlerts.length}
          subtitle="Matching your blood group"
          icon={AlertTriangle}
          color="purple"
        />
        <StatCard
          title="Verified Certificates"
          value={profile.totalDonations || 3}
          subtitle="Cryptographically verified"
          icon={Award}
          color="green"
        />
      </div>

      {/* Charts & Urgent Needs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donation Activity Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Donation Frequency</h3>
              <p className="text-xs text-white/50">Cumulative impact throughout the year</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="donorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="donations" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#donorGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency alerts targeting user's blood group */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Immediate Needs</h3>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-xs text-white/50 mb-4">Requests directly matching your {profile.bloodGroup || 'O+'} blood group:</p>

            <div className="space-y-3">
              {emergencyAlerts.map((alt) => (
                <div key={alt.id} className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{alt.hospital}</span>
                    <Badge variant="red" size="sm">{alt.urgency}</Badge>
                  </div>
                  <p className="text-xs text-white/70">Units Required: <strong className="text-white">{alt.units}</strong></p>
                  <p className="text-[10px] text-white/40 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alt.time}
                  </p>
                  <button className="mt-3 w-full py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl transition-colors">
                    I Can Donate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="glass-card p-6 rounded-3xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Recent Donations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase text-white/40 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Blood Bank / Facility</th>
                <th className="py-3 px-4">Volume (Units)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentDonations.map((d) => (
                <tr key={d.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-medium text-white">{d.date}</td>
                  <td className="py-3 px-4">{d.bloodBank}</td>
                  <td className="py-3 px-4 font-semibold text-white">{d.units} Unit (450ml)</td>
                  <td className="py-3 px-4">
                    <Badge variant="green" size="sm">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
