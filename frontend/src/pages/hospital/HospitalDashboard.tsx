import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Building2, Package, FileText, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const HospitalDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    activeRequests: 8,
    bloodAvailable: 342,
    emergencyAlerts: 3,
  });

  const recentHospitalRequests = [
    { id: 'HREQ-401', bloodGroup: 'O-', component: 'Packed Red Cells', units: 4, urgency: 'EMERGENCY', status: 'DISPATCHED', time: '10 mins ago' },
    { id: 'HREQ-402', bloodGroup: 'A+', component: 'Whole Blood', units: 2, urgency: 'URGENT', status: 'MATCHING', time: '25 mins ago' },
    { id: 'HREQ-403', bloodGroup: 'B+', component: 'Platelets', units: 6, urgency: 'NORMAL', status: 'PROCESSING', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Hospital Operations Command</h2>
        <p className="text-sm text-white/50">Manage hospital blood requests, inventory reserves, and emergency broadcasts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Active Requests"
          value={stats.activeRequests}
          subtitle="Matching or in transit"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Blood Units Available"
          value={stats.bloodAvailable}
          subtitle="Regional blood bank pool"
          icon={Package}
          color="green"
        />
        <StatCard
          title="Emergency Alerts"
          value={stats.emergencyAlerts}
          subtitle="Broadcasted to active donors"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Recent Hospital Requests Table */}
      <div className="glass-card p-6 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Active Blood Dispatches</h3>
          <Link to="/hospital/requests" className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1">
            Manage All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase text-white/40 bg-white/5 border-b border-white/10">
              <tr>
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Blood Type</th>
                <th className="py-4 px-6">Component</th>
                <th className="py-4 px-6">Units</th>
                <th className="py-4 px-6">Urgency</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentHospitalRequests.map((r) => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-red-400">{r.id}</td>
                  <td className="py-4 px-6 font-bold text-white">{r.bloodGroup}</td>
                  <td className="py-4 px-6">{r.component}</td>
                  <td className="py-4 px-6 text-white font-bold">{r.units}</td>
                  <td className="py-4 px-6">
                    <Badge variant={r.urgency === 'EMERGENCY' ? 'red' : 'yellow'} size="sm">
                      {r.urgency}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={r.status === 'DISPATCHED' ? 'green' : 'blue'} size="sm">
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-xs text-white/40">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
