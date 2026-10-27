import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'green' | 'yellow' | 'blue' | 'purple' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  className = '',
}) => {
  const variantClasses = {
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    yellow: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    purple: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    gray: 'bg-white/10 text-white/70 border-white/20',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};
