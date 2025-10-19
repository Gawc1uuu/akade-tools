'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { ClientDate } from '~/components/client-date';
import { DataTable } from '~/components/data-table';
import { Invite } from '~/lib/types';

const InvitesTableContainer = ({ page, limit, invites, totalPages }: { page: number; limit: number; invites: Invite[]; totalPages: number }) => {
  const columns: ColumnDef<Invite>[] = [
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
      header: 'Data utworzenia',
      accessorKey: 'createdAt',
      meta: {
        width: '10%',
      },
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as Date;
        return <ClientDate date={createdAt} />;
      },
    },
  ];

  return (
    <DataTable title="Zaproszenia" data={invites} page={page} totalPages={totalPages} limit={limit} paramName="invites" columns={columns} />
  );
};

export default InvitesTableContainer;
