import React from 'react';
import { Button } from './Button';

interface SearchBarProps {
  placeholder?: string;
  filterLabel?: string;
  addLabel?: string;
  addHref?: string;
  onFilter?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Cari...',
  filterLabel = 'Filter',
  addLabel,
  addHref,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 shrink-0 animate-fade-in mb-6">
      <div className="flex-1 relative group max-w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-text-muted text-[18px]">search</span>
        </div>
        <input
          className="block w-full pl-10 pr-3 py-2 border border-border-subtle rounded leading-5 bg-surface text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-colors"
          placeholder={placeholder}
          type="text"
        />
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex-1 sm:flex-initial">
          <Button variant="secondary" icon="filter_list" className="w-full sm:w-auto justify-center">
            <span className="sm:inline">{filterLabel}</span>
          </Button>
        </div>
        {addLabel && addHref ? (
          <div className="flex-1 sm:flex-initial">
            <Button variant="primary" icon="add" href={addHref} className="w-full sm:w-auto justify-center">
              <span>{addLabel}</span>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
