import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const barData = [
    { month: 'Jan', donations: 340, requests: 310 },
    { month: 'Feb', donations: 420, requests: 390 },
    { month: 'Mar', donations: 380, requests: 360 },
    { month: 'Apr', donations: 490, requests: 430 },
    { month: 'May', donations: 560, requests: 510 },
    { month: 'Jun', donations: 610, requests: 580 },
    { month: 'Jul', donations: 680, requests: 640 },
  ];

  const pieData = [
    { name: 'O+', value: 38, color: '#e11d48' },
    { name: 'A+', value: 30, color: '#f43f5e' },
    { name: 'B+', value: 20, color: '#8b5cf6' },
    { name: 'AB+', value: 7, color: '#3b82f6' },
    { name: 'O-', value: 3, color: '#10b981' },
    { name: 'A-', value: 2, color: '#f59e0b' },
  ];

  const lineData = [
    { day: 'Day 1', stock: 3200 },
    { day: 'Day 5', stock: 3450 },
    { day: 'Day 10', stock: 3380 },
    { day: 'Day 15', stock: 3650 },
    { day: 'Day 20', stock: 3500 },
    { day: 'Day 25', stock: 3780 },
    { day: 'Day 30', stock: 3850 },
  ];

  const areaData = [
    { time: '00:00', alerts: 2 },
    { time: '04:00', alerts: 1 },
    { time: '08:00', alerts: 8 },
    { time: '12:00', alerts: 14 },
    { time: '16:00', alerts: 11 },
    { time: '20:00', alerts: 6 },
    { time: '23:59', alerts: 3 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Advanced Healthcare Analytics</h2>
        <p className="text-sm text-white/50">Comprehensive visualization of network throughput, donor response times, and supply trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="glass-card p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-1">Monthly Donations vs Requests</h3>
          <p className="text-xs text-white/50 mb-6">Fulfillment balance over the past 7 months</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="donations" fill="#e11d48" radius={[4, 4, 0, 0]} name="Donations" />
                <Bar dataKey="requests" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-1">Blood Group Distribution</h3>
          <p className="text-xs text-white/50 mb-6">Percentage share across state inventory</p>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="glass-card p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-1">Inventory Reserve Trajectory</h3>
          <p className="text-xs text-white/50 mb-6">Total reserve units held across certified bank freezers</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff40" fontSize={12} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="stock" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart */}
        <div className="glass-card p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-1">Emergency Requests Over 24 Hours</h3>
          <p className="text-xs text-white/50 mb-6">SOS alert surge distribution during daily cycle</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="alerts" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#alertGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
