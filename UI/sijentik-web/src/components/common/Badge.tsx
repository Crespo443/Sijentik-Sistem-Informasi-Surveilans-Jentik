import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'orange' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: string;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string, text: string, border: string, dot: string }> = {
  success: { bg: 'bg-green-50', text: 'text-success', border: 'border-green-200', dot: 'bg-success' },
  warning: { bg: 'bg-yellow-50', text: 'text-warning', border: 'border-yellow-200', dot: 'bg-warning' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', dot: 'bg-orange-500' },
  danger: { bg: 'bg-red-50', text: 'text-danger', border: 'border-red-100', dot: 'bg-danger' },
  info: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', dot: 'bg-primary' },
  neutral: { bg: 'bg-slate-100', text: 'text-text-muted', border: 'border-slate-200', dot: 'bg-slate-400' },
};

export const Badge = ({ variant = 'neutral', children, icon, pulse = false, className = '' }: BadgeProps) => {
  const styles = variantStyles[variant];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase transition-colors ${styles.bg} ${styles.text} border ${styles.border} ${className}`}>
      {icon ? (
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${pulse ? 'animate-pulse-slow' : ''}`}></span>
      )}
      {children}
    </span>
  );
};
