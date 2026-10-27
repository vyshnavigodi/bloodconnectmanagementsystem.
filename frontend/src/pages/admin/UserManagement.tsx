import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Shield, Mail, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [users, setUsers] = useState([
    { id: 'usr-1', fullName: 'Dr. Evelyn Reed', email: 'admin@bloodconnect.org', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-01-15' },
    { id: 'usr-2', fullName: 'Marcus Vance', email: 'donor@bloodconnect.org', role: 'DONOR', status: 'ACTIVE', createdAt: '2025-03-20' },
    { id: 'usr-3', fullName: 'Sarah Jenkins', email: 'patient@bloodconnect.org', role: 'PATIENT', status: 'ACTIVE', createdAt: '2025-06-11' },
    { id: 'usr-4', fullName: 'St. Jude General Hospital', email: 'hospital@bloodconnect.org', role: 'HOSPITAL', status: 'ACTIVE', createdAt: '2025-02-04' },
    { id: 'usr-5', fullName: 'Nurse Claire Evans', email: 'staff@bloodconnect.org', role: 'STAFF', status: 'ACTIVE', createdAt: '2025-04-12' },
    { id: 'usr-6', fullName: 'Alexander Cole', email: 'alex.cole@email.com', role: 'DONOR', status: 'INACTIVE', createdAt: '2025-07-29' },
  ]);

  useEffect(() => {
    api.get('/users')
      .then((res) => {
        const d = res.data?.data || res.data;
        if (Array.isArray(d) && d.length > 0) {
          setUsers(d);
        }
      })
      .catch(() => {});
  }, []);

  const toggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          return {
            ...u,
            status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
          };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">System User Governance</h2>
          <p className="text-sm text-white/50">Manage accounts, authorization levels, and platform access</p>
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
            placeholder="Search name or email..."
            className="input-field pl-10 text-sm py-2"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-navy-800 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 w-full sm:w-auto"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="DONOR">DONOR</option>
            <option value="PATIENT">PATIENT</option>
            <option value="HOSPITAL">HOSPITAL</option>
            <option value="STAFF">STAFF</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase text-white/40 bg-white/5 border-b border-white/10">
              <tr>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Registered</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white text-xs">
                        {u.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{u.fullName}</p>
                        <p className="text-xs text-white/40">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-xs tracking-wider text-red-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={u.status === 'ACTIVE' ? 'green' : 'gray'} size="sm">
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-xs text-white/40">{u.createdAt}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                        u.status === 'ACTIVE'
                          ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
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
