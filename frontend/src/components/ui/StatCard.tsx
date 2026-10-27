import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  color?: 'red' | 'blue' | 'green' | 'purple' | 'yellow';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'red',
}) => {
  const colorMap = {
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/20',
      iconText: 'text-red-400',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconText: 'text-blue-400',
    },
    green: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconText: 'text-emerald-400',
    },
    purple: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      iconBg: 'bg-violet-500/20',
      iconText: 'text-violet-400',
    },
    yellow: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20',
      iconText: 'text-amber-400',
    },
  };

  const scheme = colorMap[color];

  return (
    <div className={`p-6 rounded-2xl glass-card border ${scheme.border} relative overflow-hidden transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/60 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-white/50 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className={`text-xs font-semibold ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend.value}
              </span>
              <span className="text-xs text-white/40">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-xl ${scheme.iconBg} ${scheme.iconText}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
