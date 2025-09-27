'use client';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useCallback } from 'react';
import { ClientDate } from '~/components/client-date';
import CreateCarModal from '~/app/(pages)/cars/components/create-car-modal';
import { Action, DataTable } from '~/components/data-table';
import DataTableFilter, { FilterConfig } from '~/components/data-table-filter';
import UpdateCarModal from '~/app/(pages)/cars/components/update-car-modal';
import { useCarActions } from '~/hooks/use-car-actions';
import { Car, User } from '~/lib/types';

interface CarsTableI {
  cars: Car[];
  currentPage: number;
  totalPages: number;
  limit: number;
  makes: string[];
  users: User[];
}

const CarsTable = ({ cars, currentPage, totalPages, limit, makes, users }: CarsTableI) => {
  const {
    state,
    editingCar,
    deletingCarId,
    isPending,
    handleEdit,
    handleCloseModal,
    handleDeletePrompt,
    handleCancelDelete,
    handleConfirmDelete,
  } = useCarActions();

  const columns: ColumnDef<Car>[] = useMemo(
    () => [
      {
        header: 'Marka',
        accessorKey: 'make',
        meta: {
          width: '10%',
        },
        cell: ({ row }) => {
          const make = row.getValue('make') as string;
          return <div>{make}</div>;
        },
      },
      {
        header: 'Model',
        accessorKey: 'model',
        meta: {
          width: '10%',
        },
        cell: ({ row }) => {
          const model = row.getValue('model') as string;
          return <div>{model}</div>;
        },
      },
      {
        header: 'Numer rejestracyjny',
        accessorKey: 'registrationNumber',
        meta: {
          width: '10%',
        },
        cell: ({ row }) => {
          const registrationNumber = row.getValue('registrationNumber') as string;
          return <div>{registrationNumber}</div>;
        },
      },
      {
        header: 'Data ważności ubezpieczenia',
        accessorKey: 'insuranceEndDate',
        meta: {
          width: '10%',
        },
        cell: ({ row }) => {
          const insuranceEndDate = row.getValue('insuranceEndDate') as string;
          return <ClientDate date={insuranceEndDate} />;
        },
      },
      {
        header: 'Data ważności przeglądu',
        accessorKey: 'inspectionEndDate',
        meta: {
          width: '10%',
        },
        cell: ({ row }) => {
          const inspectionEndDate = row.getValue('inspectionEndDate') as string;
          return <ClientDate date={inspectionEndDate} />;
        },
      },
      {
        header: 'Utworzono przez',
        accessorKey: 'owner',
        meta: {
          width: '15%',
        },
        cell: ({ row }) => {
          const owner = row.getValue('owner') as { id: string; email: string };
          return <div>{owner.email}</div>;
        },
      },
    ],
    []
  );

  const getActions = useCallback(
    (row: Car): Action<Car>[] => {
      if (deletingCarId === row.id) {
        return [
          {
            label: 'Zatwierdź',
            onClick: () => handleConfirmDelete(row.id),
            variant: 'destructive',
            disabled: isPending,
            className: 'cursor-pointer',
          },
          {
            label: 'Anuluj',
            onClick: () => handleCancelDelete(),
            variant: 'outline',
            disabled: false,
            className: 'cursor-pointer',
          },
        ];
      }

      return [
        {
          label: 'Usuń',
          onClick: () => handleDeletePrompt(row.id),
          variant: 'destructive',
          disabled: isPending,
          className: 'cursor-pointer',
        },
        {
          label: 'Edytuj',
          onClick: () => handleEdit(row),
          variant: 'default',
          disabled: false,
          className: 'cursor-pointer',
        },
      ];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deletingCarId, isPending]
  );

  const carFilterConfig: FilterConfig[] = useMemo(
    () => [
      {
        type: 'select',
        param: 'carsMake',
        placeholder: 'Filtruj po marce',
        options: makes.map(make => ({ value: make, label: make })),
      },
      {
        type: 'select',
        param: 'carsOwner',
        placeholder: 'Filtruj po użytkowniku',
        options: users.map(user => ({ value: user.id, label: user.email })),
      },
      {
        type: 'input',
        param: 'carsSearchTerm',
        placeholder: 'Wyszukaj po czymkolwiek',
      },
    ],
    [makes, users]
  );

  return (
    <div>
      <DataTable
        actions={row => getActions(row)}
        columns={columns}
        data={cars as Car[]}
        title="Pojazdy"
        page={currentPage}
        totalPages={totalPages}
        limit={limit}
        filters={<DataTableFilter filters={carFilterConfig} />}
        paramName="cars"
        action={<CreateCarModal />}
      />
      <UpdateCarModal car={editingCar} onOpenChange={handleCloseModal} isOpen={!!editingCar} />
    </div>
  );
};

export default CarsTable;
