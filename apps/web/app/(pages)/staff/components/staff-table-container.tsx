'use client';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import AddWorkerDialog from '~/app/(pages)/staff/components/add-worker-dialog';
import { Action, DataTable } from '~/components/data-table';
import DataTableFilter, { FilterConfig } from '~/components/data-table-filter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { User } from '~/lib/types';

interface StaffTableContainerProps {
  page: number;
  limit: number;
  workers: User[];
  totalPages: number;
}

const StaffTableContainer = ({ page, limit, workers, totalPages }: StaffTableContainerProps) => {
  const [deletingWorkerId, setDeletingWorkerId] = useState<string | null>(null);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [editedWorkerRole, setEditedWorkerRole] = useState<string | null>(null);
  
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
        return editingWorkerId === row.original.id ? (
          <Select defaultValue={role} onValueChange={(value) => setEditedWorkerRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz rolę" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="USER">USER</SelectItem>
            </SelectContent>
          </Select>
        ) : <div>{role}</div>;
      },
    },
  ];


  const getActions = useCallback((row: User): Action<User>[] => {

    if (deletingWorkerId === row.id) {
      return [
        {
          label: 'Zatwierdź',
          onClick: () => setDeletingWorkerId(null),
          variant: 'destructive',
          disabled: false,
          className: 'cursor-pointer w-20',
        },
        {
          label: 'Anuluj',
          onClick: () => setDeletingWorkerId(null),
          variant: 'outline',
          disabled: false,
          className: 'cursor-pointer w-20',
        },
      ];
    }

    if (editingWorkerId === row.id) {
      return [
        {
          label: 'Zatwierdź',
          onClick: () => console.log('edit'),
          variant: 'default',
          disabled: false,
          className: 'cursor-pointer w-20',
        },
        {
          label: 'Anuluj',
          onClick: () => setEditingWorkerId(null),
          variant: 'outline',
          disabled: false,
          className: 'cursor-pointer w-20',
        },
      ];
    }

    return [
      {
        label: 'Usuń',
        onClick: () => setDeletingWorkerId(row.id),
        variant: 'destructive',
        disabled: false,
        className: 'cursor-pointer w-20',
      },
      {
        label: 'Edytuj',
        onClick: () => setEditingWorkerId(row.id),
        variant: 'default',
        disabled: false,
        className: 'cursor-pointer w-20',
      },
    ];
  }, [deletingWorkerId, editingWorkerId]);

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
      actions={getActions}
    />
  );
};

export default StaffTableContainer;
