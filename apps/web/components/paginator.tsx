import {
  generatePaginationLinks,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';

import React from 'react';

interface PaginatorProps {
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
  showPreviousNext: boolean;
  className?: string;
}

const Paginator = ({ onPageChange, page, totalPages, showPreviousNext, className }: PaginatorProps) => {
  return (
    <Pagination className={className}>
      <PaginationContent>
        {showPreviousNext && totalPages ? (
          <PaginationItem>
            <PaginationPrevious className={`${page === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => page > 1 && onPageChange(page - 1)} disabled={page === 1} />
          </PaginationItem>
        ) : null}
        {generatePaginationLinks(page, totalPages, onPageChange)}
        {showPreviousNext && totalPages ? (
          <PaginationItem>
            <PaginationNext className={`${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => page < totalPages && onPageChange(page + 1)} disabled={page === totalPages} />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
};

export default Paginator;
