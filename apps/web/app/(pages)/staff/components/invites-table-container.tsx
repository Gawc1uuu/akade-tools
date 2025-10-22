'use client';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { ClientDate } from '~/components/client-date';
import { Action, DataTable } from '~/components/data-table';
import { Invite } from '~/lib/types';

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

  const [deletingInviteId, setDeletingInviteId] = useState<string | null>(null);

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

  const getActions = useCallback((row: Invite): Action<Invite>[] => {

    if (deletingInviteId === row.id) {
      return [
        {
          label: 'Zatwierdź',
          onClick: () => setDeletingInviteId(null),
          variant: 'destructive',
          disabled: false,
          className: 'cursor-pointer w-20',
        },
        {
          label: 'Anuluj',
          onClick: () => setDeletingInviteId(null),
          variant: 'outline',
          disabled: false,
          className: 'cursor-pointer w-20',
        },
      ];
    }

    return [
      {
        label: 'Usuń',
        onClick: () => setDeletingInviteId(row.id),
        variant: 'destructive',
        disabled: false,
        className: 'cursor-pointer w-20',
      },
    ]
  }, [deletingInviteId]);


  return (
    <DataTable title="Zaproszenia" data={invites} page={page} totalPages={totalPages} limit={limit} paramName="invites" columns={columns} actions={getActions} />
  );
};

export default InvitesTableContainer;
