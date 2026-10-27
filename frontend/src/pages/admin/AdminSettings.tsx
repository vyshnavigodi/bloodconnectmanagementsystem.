import React, { useState } from 'react';
import { Settings, Shield, AlertTriangle, Save, Check } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const AdminSettings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [thresholds, setThresholds] = useState({
    criticalLow: 5,
    lowStock: 15,
    reorderLevel: 25,
    autoDispatchUrgent: true,
  });

  const compatibilityMatrix = [
    { recipient: 'O-', canReceive: ['O-'] },
    { recipient: 'O+', canReceive: ['O+', 'O-'] },
    { recipient: 'A-', canReceive: ['A-', 'O-'] },
    { recipient: 'A+', canReceive: ['A+', 'A-', 'O+', 'O-'] },
    { recipient: 'B-', canReceive: ['B-', 'O-'] },
    { recipient: 'B+', canReceive: ['B+', 'B-', 'O+', 'O-'] },
    { recipient: 'AB-', canReceive: ['AB-', 'A-', 'B-', 'O-'] },
    { recipient: 'AB+', canReceive: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'] },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white">System Settings & Transfusion Rules</h2>
        <p className="text-sm text-white/50">Manage inventory warning thresholds and review biological compatibility matrix</p>
      </div>

      {/* Threshold Configuration */}
      <form onSubmit={handleSave} className="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>Inventory Stock Thresholds</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase">Critical Low (Units)</label>
            <input
              type="number"
              value={thresholds.criticalLow}
              onChange={(e) => setThresholds({ ...thresholds, criticalLow: parseInt(e.target.value) || 0 })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase">Low Stock (Units)</label>
            <input
              type="number"
              value={thresholds.lowStock}
              onChange={(e) => setThresholds({ ...thresholds, lowStock: parseInt(e.target.value) || 0 })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase">Reorder Level (Units)</label>
            <input
              type="number"
              value={thresholds.reorderLevel}
              onChange={(e) => setThresholds({ ...thresholds, reorderLevel: parseInt(e.target.value) || 0 })}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-white">Autonomous Emergency Broadcasts</h4>
            <p className="text-xs text-white/50">Automatically alert verified donors when stock dips below critical low</p>
          </div>
          <input
            type="checkbox"
            checked={thresholds.autoDispatchUrgent}
            onChange={(e) => setThresholds({ ...thresholds, autoDispatchUrgent: e.target.checked })}
            className="w-5 h-5 accent-red-600 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Threshold configurations updated
            </span>
          )}
          <button type="submit" className="btn-primary text-xs px-6 py-2.5 ml-auto flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Update Parameters</span>
          </button>
        </div>
      </form>

      {/* Compatibility Matrix Editor / Viewer */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          <span>Biological Compatibility Matrix (Red Blood Cells)</span>
        </h3>
        <p className="text-xs text-white/50">Strict clinical guidelines governing automated donor-patient matching</p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase text-white/40 bg-white/5 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Recipient Type</th>
                <th className="py-3 px-4">Compatible Donor Blood Types</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {compatibilityMatrix.map((item) => (
                <tr key={item.recipient} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-black text-red-400 text-base">{item.recipient}</td>
                  <td className="py-3 px-4 flex flex-wrap gap-1.5">
                    {item.canReceive.map((donorType) => (
                      <span key={donorType} className="px-2 py-0.5 rounded-md bg-white/10 text-white text-xs font-semibold">
                        {donorType}
                      </span>
                    ))}
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
