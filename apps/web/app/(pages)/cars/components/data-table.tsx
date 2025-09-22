'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Paginator from '~/components/paginator';
import { Button } from '~/components/ui/button';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { cn } from '~/lib/utils';

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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  page: number;
  totalPages: number;
  actions?: Action<TData>[] | ((row: TData) => Action<TData>[]);
}

export function DataTable<TData, TValue>({ columns, data, title, page, totalPages, actions }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getRowActions = (row: TData): Action<TData>[] | undefined => {
    return typeof actions === 'function' ? actions(row) : actions;
  };

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
                      <TableHead key={header.id} style={{ width: header.column.columnDef.meta?.width ?? header.getSize() }}>
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
                        <div>
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
                                variant={action.variant as any}
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
          <div className="flex justify-end mt-4">
            <Paginator onPageChange={handlePageChange} page={page} totalPages={totalPages} showPreviousNext={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
