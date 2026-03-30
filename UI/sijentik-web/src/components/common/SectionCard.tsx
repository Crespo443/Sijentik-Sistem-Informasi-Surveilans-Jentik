import React from 'react';

interface SectionCardProps {
  title: string;
  icon: string;
  /** Section number prefix, e.g. "1." */
  number?: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon, number, children, className = '' }) => {
  return (
    <div className={`bg-surface border border-border-subtle shadow-card rounded p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
        </div>
        <h2 className="text-base font-bold font-heading text-text-main">
          {number ? `${number} ` : null}{title}
        </h2>
      </div>
      {children}
    </div>
  );
};