'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Paginator from '~/components/paginator';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { SelectContent, SelectItem } from '~/components/ui/select';
import { Select, SelectTrigger } from '~/components/ui/select';
import { SelectValue } from '~/components/ui/select';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  page: number;
  totalPages: number;
  actions?: Action<TData>[] | ((row: TData) => Action<TData>[]);
  limit: number;
  filters?: React.ReactNode;
  paramName: string;
  action?: React.ReactNode;
}

export interface Action<T> {
  label: string;
  onClick?: (row: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'success';
  condition?: (row: T) => boolean;
  className?: string;
  disabled: boolean;
  renderer?: (row: T) => React.ReactNode;
  width?: number | string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  page,
  totalPages,
  actions,
  limit,
  filters,
  paramName,
  action,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pageParamName = `${paramName}Page`;
  const limitParamName = `${paramName}PageSize`;

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      const params = new URLSearchParams(searchParams);
      params.set(pageParamName, totalPages.toString());
      push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [page, totalPages, limit, pageParamName, pathname, push, searchParams]);

  const getRowActions = (row: TData): Action<TData>[] | undefined => {
    return typeof actions === 'function' ? actions(row) : actions;
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(pageParamName, page.toString());
    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(limitParamName, pageSize.toString());
    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="rounded-md border p-4 md:p-6 min-w-0">
      <div className="flex flex-col gap-4 md:gap-8 pb-3 mb-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div>{action}</div>
        </div>
        <div>{filters}</div>
      </div>
      <div className="-mx-4 md:-mx-6">
        <div className="px-4 md:px-6">
          <Table>
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
                      <TableCell
                        style={{
                          width: cell.column.columnDef.meta?.width ?? cell.column.getSize(),
                        }}
                        key={cell.id}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                    {actions && getRowActions(row.original) && (
                      <TableCell style={{ width: '20%', minWidth: '20%', maxWidth: '20%' }}>
                        <div className="flex gap-2">
                          {getRowActions(row.original)?.map((action, actionIndex) => {
                            return (
                              <Button
                                onClick={e => {
                                  e.stopPropagation();
                                  if (action.onClick) {
                                    action.onClick(row.original);
                                  }
                                }}
                                key={actionIndex}
                                className={action.className}
                                variant={action.variant}
                                disabled={action.disabled}
                              >
                                {action.label}
                              </Button>
                            );
                          })}
                        </div>
                      </TableCell>
                    )}
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
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 my-6">
            <div className="flex items-center gap-2">
              <Label>Rozmiar strony</Label>
              <Select value={limit.toString()} onValueChange={value => handlePageSizeChange(Number(value))}>
                <SelectTrigger className="border border-gray-400 w-20">
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Paginator onPageChange={handlePageChange} page={page} totalPages={totalPages} showPreviousNext={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
