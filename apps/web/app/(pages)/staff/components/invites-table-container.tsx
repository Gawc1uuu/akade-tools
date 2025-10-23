'use client';
import { ColumnDef } from '@tanstack/react-table';
import React, { startTransition, useActionState, useCallback, useEffect, useState } from 'react';
import { ClientDate } from '~/components/client-date';
import { Action, DataTable } from '~/components/data-table';
import { Invite } from '~/lib/types';
import { deleteInvite } from '~/app/actions/staff/delete-invite';
import { useRouter } from 'next/navigation';

const InvitesTableContainer = ({
  page,
  limit,
  invites,
  totalPages,
}: {
  page: number;
  limit: number;
  invites: Invite[];
  totalPages: number;
}) => {
  const router = useRouter();
  const [deletingInviteId, setDeletingInviteId] = useState<string | null>(null);
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteInvite, null);

  useEffect(() => {
    if (deleteState?.success) {
      router.refresh();
      setDeletingInviteId(null);
    }
  }, [deleteState, router]);

  const columns: ColumnDef<Invite>[] = [
    {
      header: 'Email',
      accessorKey: 'email',
      meta: {
        width: '30%',
      },
      cell: ({ row }) => {
        const email = row.getValue('email') as string;
        return <div>{email}</div>;
      },
    },
    {
      header: 'Data utworzenia',
      accessorKey: 'createdAt',
      meta: {
        width: '30%',
      },
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as Date;
        return <ClientDate date={createdAt} />;
      },
    },
  ];

  const getActions = useCallback(
    (row: Invite): Action<Invite>[] => {
      if (deletingInviteId === row.id) {
        return [
          {
            label: isDeleting ? 'Usuwanie...' : 'Zatwierdź',
            onClick: () => {
              startTransition(() => {
                const formData = new FormData();
                formData.append('inviteId', row.id);
                deleteAction(formData);
              });
            },
            variant: 'destructive',
            disabled: isDeleting,
            className: 'cursor-pointer w-20',
          },
          {
            label: 'Anuluj',
            onClick: () => setDeletingInviteId(null),
            variant: 'outline',
            disabled: isDeleting,
            className: 'cursor-pointer w-20',
          },
        ];
      }

      return [
        {
          label: 'Usuń',
          onClick: () => setDeletingInviteId(row.id),
          variant: 'destructive',
          disabled: isDeleting,
          className: 'cursor-pointer w-20',
        },
      ];
    },
    [deletingInviteId, isDeleting, deleteAction]
  );

  return (
    <DataTable
      title="Zaproszenia"
      data={invites}
      page={page}
      totalPages={totalPages}
      limit={limit}
      paramName="invites"
      columns={columns}
      actions={getActions}
    />
  );
};

export default InvitesTableContainer;
