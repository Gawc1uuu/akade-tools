'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Paginator from '~/components/paginator';
import { Button } from '~/components/ui/button';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { cn } from '~/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  page: number;
  totalPages: number;
}

export function DataTable<TData, TValue>({ columns, data, title, page, totalPages }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col p-6 border border-border">
      <div className="flex flex-col gap-4 px-3 pb-3">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className={cn('w-full relative bg-transparent')}>
        <div className="w-full overflow-auto min-w-0">
          <Table className={`min-w-full bg-transparent border-spacing-0`}>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Paginator onPageChange={handlePageChange} page={page} totalPages={totalPages} showPreviousNext={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
