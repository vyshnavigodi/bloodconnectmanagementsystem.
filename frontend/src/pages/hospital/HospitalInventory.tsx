import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calendar,
  Clock,
  Trash2,
  Edit2
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

export const HospitalInventory: React.FC = () => {
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [componentFilter, setComponentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [units, setUnits] = useState<any[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [expiringUnits, setExpiringUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const [unitsRes, lowStockRes, expiringRes] = await Promise.all([
        api.get('/inventory/units?limit=50').catch(() => ({ data: { data: [] } })),
        api.get('/inventory/low-stock').catch(() => ({ data: { data: [] } })),
        api.get('/inventory/expiring').catch(() => ({ data: { data: [] } }))
      ]);

      setUnits(unitsRes.data?.data || []);
      setLowStockAlerts(lowStockRes.data?.data || []);
      setExpiringUnits(expiringRes.data?.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = async (id: string) => {
    if (!window.confirm('Are you sure you want to discard this blood unit? This action is logged.')) return;
    try {
      await api.post(`/inventory/${id}/discard`, { reason: 'Clinical quality quarantine' });
      setActionMessage({ text: 'Blood unit marked as EXPIRED and discarded from active reserves.', type: 'success' });
      fetchInventory();
    } catch (err: any) {
      setActionMessage({ text: err.response?.data?.message || 'Failed to discard unit', type: 'error' });
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/analytics/export/inventory', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BloodConnect_Inventory_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setActionMessage({ text: 'CSV export failed', type: 'error' });
    }
  };

  const filteredUnits = units.filter((item) => {
    const matchesBg = bloodGroupFilter === 'ALL' || item.bloodGroup === bloodGroupFilter;
    const matchesComp = componentFilter === 'ALL' || item.component === componentFilter;
    const matchesStat = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesBg && matchesComp && matchesStat;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge variant="green" size="sm">Available</Badge>;
      case 'RESERVED':
        return <Badge variant="yellow" size="sm">Reserved</Badge>;
      case 'ISSUED':
        return <Badge variant="blue" size="sm">Issued</Badge>;
      case 'EXPIRED':
      case 'DISCARDED':
        return <Badge variant="red" size="sm">Expired</Badge>;
      default:
        return <Badge variant="purple" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-red-400" />
            <span>Blood Inventory & Cold-Chain Management</span>
          </h2>
          <p className="text-sm text-white/50">
            Real-time batch tracking, shelf-life monitoring, and cold-storage allocation
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-all w-fit"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Inventory CSV</span>
        </button>
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
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Alerts Overview Cards */}
      {(lowStockAlerts.length > 0 || expiringUnits.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockAlerts.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Low-Stock Warning Alerts ({lowStockAlerts.length} Types)</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {lowStockAlerts.map((alert) => (
                  <span
                    key={alert.bloodGroup}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-500/30"
                  >
                    {alert.bloodGroup}: {alert.currentCount} left (Min: {alert.threshold})
                  </span>
                ))}
              </div>
            </div>
          )}

          {expiringUnits.length > 0 && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Expiring Soon Alerts (Next 7 Days: {expiringUnits.length} Units)</span>
              </div>
              <p className="text-xs text-red-200/80">
                Prioritize dispatching expiring units for non-critical matching or plasma fractionation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filter Row */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-semibold text-white/50">Blood Group:</span>
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="bg-navy-800 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Types</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-semibold text-white/50">Component:</span>
          <select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value)}
            className="bg-navy-800 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Components</option>
            <option value="PACKED_RED_CELLS">Packed Red Cells</option>
            <option value="WHOLE_BLOOD">Whole Blood</option>
            <option value="PLATELETS">Platelets</option>
            <option value="FRESH_FROZEN_PLASMA">Fresh Frozen Plasma</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-semibold text-white/50">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-navy-800 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="ISSUED">Issued</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredUnits.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/10 text-white/50 space-y-3">
          <Package className="w-12 h-12 mx-auto text-white/20" />
          <p className="text-base font-semibold text-white/70">No blood units match this filter.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="text-xs uppercase text-white/40 bg-white/5 border-b border-white/10">
                <tr>
                  <th className="py-4 px-6">Unit ID / Batch</th>
                  <th className="py-4 px-6">Blood Type</th>
                  <th className="py-4 px-6">Component</th>
                  <th className="py-4 px-6">Volume</th>
                  <th className="py-4 px-6">Storage Slot</th>
                  <th className="py-4 px-6">Expiry Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUnits.map((item) => {
                  const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null;
                  const isExpiring = expiryDate && expiryDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <tr key={item._id || item.bloodUnitId} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-red-400 block">
                          {item.bloodUnitId || 'BLD-UNIT'}
                        </span>
                        <span className="text-[10px] text-white/30 font-mono">
                          Batch: {item.batchNumber || 'B-BATCH'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-black text-lg text-white">{item.bloodGroup}</td>
                      <td className="py-4 px-6 text-xs text-white/80">{item.component}</td>
                      <td className="py-4 px-6 font-bold text-white text-xs">{item.volumeMl || 450} mL</td>
                      <td className="py-4 px-6 font-mono text-xs text-white/60">
                        {item.storageSlot || 'FRIDGE-A1'}
                      </td>
                      <td className="py-4 px-6 text-xs">
                        <span className={isExpiring ? 'text-amber-400 font-bold' : 'text-white/70'}>
                          {expiryDate ? expiryDate.toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
                      <td className="py-4 px-6">
                        {item.status === 'AVAILABLE' && (
                          <button
                            onClick={() => handleDiscard(item._id)}
                            className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-colors"
                            title="Discard / Quarantine Unit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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

export default HospitalInventory;
