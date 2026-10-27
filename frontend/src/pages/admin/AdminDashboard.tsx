import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Users, Droplet, Building2, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [kpis, setKpis] = useState({
    totalUsers: '14,820',
    availableUnits: '3,850',
    emergencyCount: '12',
    fulfillmentRate: '99.4%',
  });

  useEffect(() => {
    api.get('/analytics/kpis')
      .then((res) => {
        const d = res.data?.data || res.data;
        if (d) {
          setKpis({
            totalUsers: d.totalDonors ? `${d.totalDonors.toLocaleString()}` : '14,820',
            availableUnits: d.availableUnits ? `${d.availableUnits.toLocaleString()}` : '3,850',
            emergencyCount: '12',
            fulfillmentRate: d.fulfillmentRate ? `${d.fulfillmentRate}%` : '99.4%',
          });
        }
      })
      .catch(() => {});
  }, []);

  const monthlyDonations = [
    { month: 'Jan', donations: 340, requests: 310 },
    { month: 'Feb', donations: 420, requests: 390 },
    { month: 'Mar', donations: 380, requests: 360 },
    { month: 'Apr', donations: 490, requests: 430 },
    { month: 'May', donations: 560, requests: 510 },
    { month: 'Jun', donations: 610, requests: 580 },
  ];

  const bloodGroupDistribution = [
    { name: 'O+', value: 38, color: '#e11d48' },
    { name: 'A+', value: 30, color: '#f43f5e' },
    { name: 'B+', value: 20, color: '#8b5cf6' },
    { name: 'AB+', value: 7, color: '#3b82f6' },
    { name: 'Negatives (O-, A-, B-, AB-)', value: 5, color: '#10b981' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">System Executive Control</h2>
        <p className="text-sm text-white/50">Comprehensive network monitoring, user governance, and supply metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered Accounts"
          value={kpis.totalUsers}
          subtitle="Donors, Patients, Hospitals"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Blood Stock Units"
          value={kpis.availableUnits}
          subtitle="Monitored in cold chain"
          icon={Droplet}
          color="red"
        />
        <StatCard
          title="Active Emergency Alerts"
          value={kpis.emergencyCount}
          subtitle="Broadcasted across city"
          icon={AlertTriangle}
          color="purple"
        />
        <StatCard
          title="System Fulfillment Rate"
          value={kpis.fulfillmentRate}
          subtitle="90s avg matching latency"
          icon={Activity}
          color="green"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Donations vs Requests</h3>
              <p className="text-xs text-white/50">Volumetric supply & demand comparison</p>
            </div>
            <Link to="/admin/analytics" className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1">
              Full Analytics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDonations}>
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} />
                <Bar dataKey="donations" fill="#e11d48" radius={[4, 4, 0, 0]} name="Donations" />
                <Bar dataKey="requests" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Blood Group Distribution</h3>
            <p className="text-xs text-white/50 mb-6">Population demographic inventory %</p>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bloodGroupDistribution} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                    {bloodGroupDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5 pt-4 border-t border-white/10">
            {bloodGroupDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-white/70">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
