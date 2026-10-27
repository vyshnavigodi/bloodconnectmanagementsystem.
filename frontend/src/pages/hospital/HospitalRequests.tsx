import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Droplet,
  Send,
  XCircle,
  PackageCheck
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

export const HospitalRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/blood-requests');
      const data = res.data?.data || res.data || [];
      setRequests(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    setActionMessage(null);
    try {
      await api.patch(`/blood-requests/${id}/approve`);
      setActionMessage({ text: 'Blood request approved and matched against inventory!', type: 'success' });
      fetchRequests();
    } catch (err: any) {
      setActionMessage({ text: err.response?.data?.message || 'Failed to approve request', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleIssue = async (id: string) => {
    setActionLoadingId(id);
    setActionMessage(null);
    try {
      await api.post(`/blood-requests/${id}/issue`);
      setActionMessage({ text: 'Blood unit issued and dispatched to hospital!', type: 'success' });
      fetchRequests();
    } catch (err: any) {
      setActionMessage({ text: err.response?.data?.message || 'Failed to issue blood unit', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    setActionMessage(null);
    try {
      await api.patch(`/blood-requests/${id}/reject`, { reason: 'Clinical documentation mismatch' });
      setActionMessage({ text: 'Blood request rejected.', type: 'success' });
      fetchRequests();
    } catch (err: any) {
      setActionMessage({ text: err.response?.data?.message || 'Failed to reject request', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesUrgency = filterUrgency === 'ALL' || r.urgency === filterUrgency;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesUrgency && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FULFILLED':
        return <Badge variant="green" size="sm">Fulfilled</Badge>;
      case 'AVAILABLE':
      case 'PARTIALLY_AVAILABLE':
        return <Badge variant="blue" size="sm">Stock Matched</Badge>;
      case 'MATCHING':
        return <Badge variant="purple" size="sm">Matching</Badge>;
      case 'PENDING':
        return <Badge variant="yellow" size="sm">Pending</Badge>;
      case 'REJECTED':
      case 'CANCELLED':
        return <Badge variant="red" size="sm">{status}</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-red-400" />
            <span>Blood Requisitions & Order Fulfillment</span>
          </h2>
          <p className="text-sm text-white/50">
            Review incoming hospital requests, verify stock matching, and issue authorized blood units
          </p>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-semibold text-white/50">Urgency:</span>
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="bg-navy-800 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Urgencies</option>
            <option value="EMERGENCY">Emergency (SOS)</option>
            <option value="URGENT">Urgent</option>
            <option value="NORMAL">Normal</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-semibold text-white/50">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-navy-800 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="MATCHING">Matching</option>
            <option value="AVAILABLE">Stock Matched</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/10 text-white/50 space-y-3">
          <FileText className="w-12 h-12 mx-auto text-white/20" />
          <p className="text-base font-semibold text-white/70">No blood requests match this filter.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="text-xs uppercase text-white/40 bg-white/5 border-b border-white/10">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Patient / Requester</th>
                  <th className="py-4 px-6">Blood Type</th>
                  <th className="py-4 px-6">Component</th>
                  <th className="py-4 px-6">Units</th>
                  <th className="py-4 px-6">Urgency</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.map((r) => {
                  const isProcessing = actionLoadingId === r._id;
                  const canApprove = r.status === 'PENDING';
                  const canIssue = ['MATCHING', 'AVAILABLE', 'PARTIALLY_AVAILABLE', 'PENDING'].includes(r.status);
                  const canReject = ['PENDING', 'MATCHING', 'PARTIALLY_AVAILABLE'].includes(r.status);

                  return (
                    <tr key={r._id || r.requestId} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-red-400">
                        {r.requestId || 'REQ'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-white">{r.patientName || 'Emergency Patient'}</div>
                        <div className="text-xs text-white/40">{r.contactPhone || 'Public Requisition'}</div>
                      </td>
                      <td className="py-4 px-6 font-bold text-white text-base">
                        {r.bloodGroup}
                      </td>
                      <td className="py-4 px-6 text-xs text-white/80">
                        {r.component || 'Whole Blood'}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        {r.unitsIssued || 0} / {r.unitsRequired} Units
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant={
                            r.urgency === 'EMERGENCY'
                              ? 'red'
                              : r.urgency === 'URGENT'
                              ? 'yellow'
                              : 'blue'
                          }
                          size="sm"
                        >
                          {r.urgency}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(r.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {canApprove && (
                            <button
                              onClick={() => handleApprove(r._id)}
                              disabled={isProcessing}
                              className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-semibold border border-purple-500/40 transition-all flex items-center gap-1"
                              title="Approve & Match Inventory"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Match</span>
                            </button>
                          )}

                          {canIssue && (
                            <button
                              onClick={() => handleIssue(r._id)}
                              disabled={isProcessing}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-all flex items-center gap-1"
                              title="Issue & Release Unit"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                              <span>Issue</span>
                            </button>
                          )}

                          {canReject && (
                            <button
                              onClick={() => handleReject(r._id)}
                              disabled={isProcessing}
                              className="px-2 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-semibold border border-red-500/30 transition-all"
                              title="Reject Request"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {!canApprove && !canIssue && !canReject && (
                            <span className="text-xs text-white/30 italic">Completed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalRequests;
