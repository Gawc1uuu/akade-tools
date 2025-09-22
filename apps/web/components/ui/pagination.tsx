import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav role="navigation" aria-label="pagination" data-slot="pagination" className={cn('flex justify-center', className)} {...props} />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="pagination-content" className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<'button'>;

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return <Button aria-current={isActive ? 'page' : undefined} variant={isActive ? 'outline' : 'ghost'} className={className} {...props} />;
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to previous page" className={cn('gap-1 px-2.5 sm:pl-2.5', className)} {...props}>
      <ChevronLeftIcon />
      <span className="hidden sm:block">Poprzednia</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" className={cn('gap-1 px-2.5 sm:pr-2.5', className)} {...props}>
      <span className="hidden sm:block">Następna</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn('flex size-9 items-center justify-center', className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">Więcej stron</span>
    </span>
  );
}

const generatePaginationLinks = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
  const pages: React.ReactNode[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink className={`${i === currentPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => onPageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    for (let i = 1; i <= 2; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    if (currentPage > 2 && currentPage < totalPages - 1) {
      pages.push(<PaginationEllipsis key="start-ellipsis" />);
      pages.push(
        <PaginationItem key={currentPage}>
          <PaginationLink onClick={() => onPageChange(currentPage)} isActive={true}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
      );
    }
    pages.push(<PaginationEllipsis key="end-ellipsis" />);
    for (let i = totalPages - 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  }

  return pages;
};

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  generatePaginationLinks,
};
