import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter, XCircle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const PatientRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([
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
      id: 'REQ-1088',
      patientName: 'Sarah Jenkins',
      bloodGroup: 'B+',
      component: 'Platelets',
      units: 1,
      urgency: 'NORMAL',
      status: 'PENDING',
      hospital: 'City Clinic',
      createdAt: '2026-09-18',
    },
    {
      id: 'REQ-1044',
      patientName: 'Sarah Jenkins',
      bloodGroup: 'B+',
      component: 'Packed Red Cells',
      units: 2,
      urgency: 'NORMAL',
      status: 'FULFILLED',
      hospital: 'Metro General Hospital',
      createdAt: '2026-07-22',
    },
  ]);

  const handleCancel = (id: string) => {
    if (confirm(`Are you sure you want to cancel request ${id}?`)) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FULFILLED':
        return <Badge variant="green" size="sm">Fulfilled</Badge>;
      case 'PROCESSING':
        return <Badge variant="yellow" size="sm">Matching Donors</Badge>;
      case 'PENDING':
        return <Badge variant="blue" size="sm">Pending</Badge>;
      case 'CANCELLED':
        return <Badge variant="gray" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">My Request History</h2>
          <p className="text-sm text-white/50">Manage active blood supply requests and dispatch updates</p>
        </div>
        <Link to="/patient/request" className="btn-primary flex items-center gap-2 text-sm w-fit">
          <PlusCircle className="w-4 h-4" />
          <span>New Blood Request</span>
        </Link>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search request ID or blood..."
            className="input-field pl-10 text-sm py-2"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase text-white/40 bg-white/5 border-b border-white/10">
              <tr>
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Blood Spec</th>
                <th className="py-4 px-6">Units</th>
                <th className="py-4 px-6">Urgency</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Hospital</th>
                <th className="py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-red-400">{req.id}</td>
                  <td className="py-4 px-6 text-white font-medium">
                    <span className="text-red-400 font-bold mr-1.5">{req.bloodGroup}</span>
                    {req.component}
                  </td>
                  <td className="py-4 px-6 font-bold text-white">{req.units}</td>
                  <td className="py-4 px-6">
                    <Badge variant={req.urgency === 'EMERGENCY' ? 'red' : 'purple'} size="sm">
                      {req.urgency}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(req.status)}</td>
                  <td className="py-4 px-6">{req.hospital}</td>
                  <td className="py-4 px-6">
                    {req.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(req.id)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
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
