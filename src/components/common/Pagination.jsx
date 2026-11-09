import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const visiblePages = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => {
      const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
      return start + index;
    }
  );

  const buttonClass =
    'pagination-button ui-interactive ui-button flex h-10 w-10 items-center justify-center rounded-full border border-[#232C48] text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        className={buttonClass}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {visiblePages.map((page) => (
        <button
          type="button"
          key={page}
          className={`${buttonClass} ${
            page === currentPage
              ? 'pagination-active ui-primary-button'
              : 'ui-secondary-button'
          }`}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className={buttonClass}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;
