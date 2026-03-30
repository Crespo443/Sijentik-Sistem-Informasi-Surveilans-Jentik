import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  /** Icon for the subtitle area (e.g. trending_up) */
  trendIcon?: string;
  /** Trend text like "+2.6%" */
  trend?: string;
  /** Color theme: primary, danger, success, warning */
  color?: 'primary' | 'danger' | 'success' | 'warning';
  /** Progress bar percentage (0-100) */
  progress?: number;
  /** Explanatory text to display inside a tooltip */
  tooltipText?: string;
}

const colorMap: Record<string, string> = {
  primary: 'var(--color-primary)',
  danger: 'var(--color-danger)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
};

const iconBgMap: Record<string, string> = {
  primary: 'text-primary bg-primary/10',
  danger: 'text-danger bg-danger/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
};

export const KPICard: React.FC<KPICardProps> = ({
  title, value, icon, subtitle, trendIcon, trend, color = 'primary', progress, tooltipText,
}) => {
  return (
    <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card relative hover:-translate-y-1 hover:shadow-md transition-transform z-10 hover:z-20">
      <div className="h-1 rounded-t-lg" style={{ backgroundColor: colorMap[color] }}></div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider">{title}</h3>
            {tooltipText && (
              <div className="group/tooltip relative flex items-center">
                <span className="material-symbols-outlined text-[10px] text-slate-400/70 cursor-help hover:text-primary transition-colors">info</span>
                <div className="absolute left-1/2 -top-2.5 -translate-y-full -translate-x-1/2 z-50 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none">
                  <div className="bg-white text-slate-600 text-[11px] leading-relaxed p-3 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-200 w-56 text-left relative font-medium normal-case tracking-normal">
                    {tooltipText}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b border-r border-slate-200 rotate-45 rounded-sm"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBgMap[color]}`}>
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        </div>
        <div className={`text-3xl font-bold font-heading tracking-tight data-mono text-${color}`}>{value}</div>
        <div className="flex items-center gap-1.5 mt-2">
          {trendIcon ? <span className={`material-symbols-outlined text-[14px] text-${color}`}>{trendIcon}</span> : null}
          {trend ? <span className="text-xs text-text-muted font-medium">{trend}</span> : null}
          {subtitle ? <span className="text-xs text-text-muted">{subtitle}</span> : null}
        </div>
        {progress !== undefined ? (
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full bg-${color}/50`} style={{ width: `${progress}%` }}></div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
