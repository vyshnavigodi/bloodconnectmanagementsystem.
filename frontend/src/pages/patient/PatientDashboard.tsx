import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, AlertTriangle, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

export const PatientDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([
    {
      id: 'REQ-1092',
      patientName: 'Sarah Jenkins',
      bloodGroup: 'B+',
      component: 'Packed Red Cells',
      units: 2,
      urgency: 'URGENT',
      status: 'PROCESSING',
      hospital: 'Metro General Hospital',
      createdAt: '2026-10-10',
    },
    {
      id: 'REQ-1044',
      patientName: 'Sarah Jenkins',
      bloodGroup: 'B+',
      component: 'Platelets',
      units: 1,
      urgency: 'NORMAL',
      status: 'FULFILLED',
      hospital: 'Metro General Hospital',
      createdAt: '2026-07-22',
    },
  ]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/blood-requests');
        const data = res.data?.data || res.data;
        if (Array.isArray(data) && data.length > 0) {
          setRequests(data);
        }
      } catch {
        // Fallback to sample data
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const pendingCount = requests.filter(r => r.status === 'PENDING' || r.status === 'PROCESSING').length;
  const fulfilledCount = requests.filter(r => r.status === 'FULFILLED').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FULFILLED':
        return <Badge variant="green" size="sm">Fulfilled</Badge>;
      case 'PROCESSING':
        return <Badge variant="yellow" size="sm">Matching Donors</Badge>;
      case 'PENDING':
        return <Badge variant="blue" size="sm">Pending Approval</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Patient Request Portal</h2>
          <p className="text-sm text-white/50">Track active blood requests and match status across medical centers</p>
        </div>
        <Link to="/patient/request" className="btn-primary flex items-center gap-2 text-sm w-fit">
          <PlusCircle className="w-4 h-4" />
          <span>New Blood Request</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Active Requests"
          value={pendingCount}
          subtitle="Currently matching donors"
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Fulfilled Units"
          value={fulfilledCount * 2}
          subtitle="Transfusions verified"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Total Requests Logged"
          value={requests.length}
          subtitle="Lifetime requests"
          icon={FileText}
          color="blue"
        />
      </div>

      {/* Active Requests List */}
      <div className="glass-card p-6 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">My Blood Requests</h3>
          <Link to="/patient/requests" className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-red-400">{req.id}</span>
                  {getStatusBadge(req.status)}
                  <Badge variant={req.urgency === 'EMERGENCY' ? 'red' : 'purple'} size="sm">
                    {req.urgency}
                  </Badge>
                </div>
                <h4 className="font-bold text-white text-base">
                  {req.units} Units of {req.component} ({req.bloodGroup})
                </h4>
                <p className="text-xs text-white/50">
                  Hospital: {req.hospital || 'Assigned Center'} &bull; Date Requested: {req.createdAt}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/patient/requests"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  Track Dispatch
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
