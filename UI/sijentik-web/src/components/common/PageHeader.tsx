import React from 'react';

interface PageHeaderProps {
  title: string;
  icon?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, icon, breadcrumbs, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        {breadcrumbs ? (
          <nav className="flex items-center gap-2 text-xs font-medium text-text-muted mb-2 overflow-x-auto whitespace-nowrap pb-1 sm:pb-0 no-scrollbar">
            <a href="/" className="hover:text-primary transition-colors flex items-center shrink-0">
              <span className="material-symbols-outlined text-[14px]">home</span>
            </a>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className="text-border-subtle shrink-0">/</span>
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-primary transition-colors shrink-0">{crumb.label}</a>
                ) : (
                  <span className="text-slate-400 shrink-0">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : null}
        
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-main flex items-center gap-2 sm:gap-3 truncate">
          {icon ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[18px] sm:text-[24px]">{icon}</span>
            </div>
          ) : null}
          <span className="truncate">{title}</span>
        </h1>
      </div>

      {/* Action Buttons Right */}
      {actions ? (
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {actions}
        </div>
      ) : null}
    </div>
  );
};
