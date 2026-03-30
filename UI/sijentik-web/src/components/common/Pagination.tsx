import React from 'react';
import { Button } from './Button';

interface PaginationProps {
  /** e.g. "Menampilkan 1-5 dari 21 data" */
  label: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ label, currentPage = 1, totalPages = 5, onPageChange }) => {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className="p-4 border-t border-border-subtle flex items-center justify-between">
      <span className="text-sm text-text-muted">{label}</span>
      <div className="flex gap-1">
        <Button 
          variant="secondary" 
          className="!px-2 !py-1" 
          disabled={currentPage === 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
        >
          Prev
        </Button>
        {pages.map((p) => (
          <Button 
            key={p} 
            variant={p === currentPage ? 'primary' : 'secondary'} 
            className="!px-2 !py-1"
            onClick={() => onPageChange && onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        {totalPages > 5 ? (
          <>
            <Button variant="secondary" className="!px-2 !py-1" disabled>...</Button>
            <Button 
              variant="secondary" 
              className="!px-2 !py-1"
              onClick={() => onPageChange && onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        ) : null}
        <Button 
          variant="secondary" 
          className="!px-2 !py-1" 
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
