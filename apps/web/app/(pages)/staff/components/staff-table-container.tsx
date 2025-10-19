'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import AddWorkerDialog from '~/app/(pages)/staff/components/add-worker-dialog';
import { DataTable } from '~/components/data-table';
import DataTableFilter, { FilterConfig } from '~/components/data-table-filter';
import { User } from '~/lib/types';

interface StaffTableContainerProps {
  page: number;
  limit: number;
  workers: User[];
  totalPages: number;
}

const StaffTableContainer = ({ page, limit, workers, totalPages }: StaffTableContainerProps) => {
  const columns: ColumnDef<User>[] = [
    {
      header: 'Imię',
      accessorKey: 'firstName',
      meta: {
        width: '10%',
      },
      cell: ({ row }) => {
        const firstName = row.getValue('firstName') as string;
        return <div>{firstName}</div>;
      },
    },
    {
      header: 'Nazwisko',
      accessorKey: 'lastName',
      meta: {
        width: '10%',
      },
      cell: ({ row }) => {
        const lastName = row.getValue('lastName') as string;
        return <div>{lastName}</div>;
      },
    },
    {
      header: 'Email',
      accessorKey: 'email',
      meta: {
        width: '10%',
      },
      cell: ({ row }) => {
        const email = row.getValue('email') as string;
        return <div>{email}</div>;
      },
    },
    {
      header: 'Rola',
      accessorKey: 'role',
      meta: {
        width: '10%',
      },
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return <div>{role}</div>;
      },
    },
  ];

  const staffFilterConfig: FilterConfig[] = [
    {
      type: 'input',
      param: 'staffSearchTerm',
      placeholder: 'Wyszukaj pracownika po czymkolwiek',
    },
  ];

  return (
    <DataTable
      title="Pracownicy"
      data={workers}
      page={page}
      totalPages={totalPages}
      limit={limit}
      paramName="staff"
      filters={<DataTableFilter filters={staffFilterConfig} />}
      columns={columns}
      action={<AddWorkerDialog />}
    />
  );
};

export default StaffTableContainer;
