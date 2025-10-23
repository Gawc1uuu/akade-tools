'use client';
import { ColumnDef } from '@tanstack/react-table';
import React, { startTransition, useActionState, useCallback, useEffect, useState } from 'react';
import AddWorkerDialog from '~/app/(pages)/staff/components/add-worker-dialog';
import { Action, DataTable } from '~/components/data-table';
import DataTableFilter, { FilterConfig } from '~/components/data-table-filter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { User } from '~/lib/types';
import { deleteWorker } from '~/app/actions/staff/delete-worker';
import { useRouter } from 'next/navigation';
import { updateWorker } from '~/app/actions/staff/update-worker';
import { Loader2 } from 'lucide-react';

interface StaffTableContainerProps {
  page: number;
  limit: number;
  workers: User[];
  totalPages: number;
}

const StaffTableContainer = ({ page, limit, workers, totalPages }: StaffTableContainerProps) => {
  const router = useRouter();
  const [deletingWorkerId, setDeletingWorkerId] = useState<string | null>(null);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [editedWorkerRole, setEditedWorkerRole] = useState<string | null>(null);

  const [deleteState, deleteAction, isDeleting] = useActionState(deleteWorker, null);
  const [updateState, updateAction, isUpdating] = useActionState(updateWorker, null);

  useEffect(() => {
    if (deleteState?.success) {
      router.refresh();
      setDeletingWorkerId(null);
    }
    if (deleteState?.error) {
      console.error(deleteState.error);
      setDeletingWorkerId(null);
    }
  }, [deleteState, router]);

  useEffect(() => {
    if (updateState?.success) {
      router.refresh();
      setEditingWorkerId(null);
      setEditedWorkerRole(null);
    }
    if (updateState?.error) {
      console.error(updateState.error);
      setEditingWorkerId(null);
    }
  }, [updateState, router]);

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
          <Select value={editedWorkerRole || role} onValueChange={value => setEditedWorkerRole(value)} disabled={isUpdating}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz rolę" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="USER">USER</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div>{role}</div>
        );
      },
    },
  ];

  const getActions = useCallback(
    (row: User): Action<User>[] => {
      if (deletingWorkerId === row.id) {
        return [
          {
            label: isDeleting ? "Usuwanie..." : 'Zatwierdź',
            onClick: () => {
              startTransition(() => {
                // 4. Wywołaj akcję serwera z FormData
                const formData = new FormData();
                formData.append('workerId', row.id);
                deleteAction(formData);
              });
            },
            variant: 'destructive',
            disabled: isDeleting,
            className: 'cursor-pointer w-20',
          },
          {
            label: 'Anuluj',
            onClick: () => setDeletingWorkerId(null),
            variant: 'outline',
            disabled: isDeleting,
            className: 'cursor-pointer w-20',
          },
        ];
      }

      if (editingWorkerId === row.id) {
        return [
          {
            label: isUpdating ? "Aktualizowanie..." : 'Zatwierdź',
            onClick: () => {
              startTransition(() => {
                const formData = new FormData();
                formData.append('workerId', row.id);
                formData.append('role', editedWorkerRole as string);
                updateAction(formData);
              });
            },
            variant: 'default',
            disabled: isUpdating,
            className: 'cursor-pointer w-20',
          },
          {
            label: 'Anuluj',
            onClick: () => setEditingWorkerId(null),
            variant: 'outline',
            disabled: isUpdating,
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
    },
    [deletingWorkerId, editingWorkerId, isDeleting, deleteAction, isUpdating, updateAction, editedWorkerRole]
  );

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
