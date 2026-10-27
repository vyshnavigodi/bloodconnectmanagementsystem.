import React, { useState } from 'react';
import { Calendar, Search, Filter, CheckCircle2, Download } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const DonorHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const history = [
    { id: 'DON-901', date: '2026-08-10', location: 'Metropolitan Central Blood Bank', units: 1, type: 'Whole Blood', hb: '14.2 g/dL', status: 'COMPLETED' },
    { id: 'DON-842', date: '2026-05-14', location: 'St. Jude Community Clinic', units: 1, type: 'Whole Blood', hb: '13.9 g/dL', status: 'COMPLETED' },
    { id: 'DON-719', date: '2026-02-02', location: 'Metropolitan Central Blood Bank', units: 1, type: 'Platelets', hb: '14.5 g/dL', status: 'COMPLETED' },
    { id: 'DON-604', date: '2025-11-19', location: 'City Memorial Blood Drive', units: 1, type: 'Whole Blood', hb: '14.1 g/dL', status: 'COMPLETED' },
    { id: 'DON-521', date: '2025-08-28', location: 'Central Hospital Dispatch Center', units: 1, type: 'Whole Blood', hb: '13.8 g/dL', status: 'COMPLETED' },
  ];

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.location.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Donation History</h2>
          <p className="text-sm text-white/50">Comprehensive record of all verified blood donations</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID or clinic..."
            className="input-field pl-10 text-sm py-2"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-white/50 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-navy-800 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 w-full sm:w-auto"
          >
            <option value="ALL">All Components</option>
            <option value="Whole Blood">Whole Blood</option>
            <option value="Platelets">Platelets</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase text-white/40 bg-white/5 border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Record ID</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Facility</th>
                <th className="py-4 px-6">Component</th>
                <th className="py-4 px-6">Hemoglobin</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-red-400">{item.id}</td>
                  <td className="py-4 px-6 text-white font-medium">{item.date}</td>
                  <td className="py-4 px-6">{item.location}</td>
                  <td className="py-4 px-6 text-white">{item.type}</td>
                  <td className="py-4 px-6 text-white/90">{item.hb}</td>
                  <td className="py-4 px-6">
                    <Badge variant="green" size="sm">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {item.status}
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
