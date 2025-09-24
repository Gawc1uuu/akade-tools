'use client';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useActionState, startTransition, useState } from 'react';
import { ClientDate } from '~/app/(pages)/cars/components/client-date';
import { Action, DataTable } from '~/app/(pages)/cars/components/data-table';
import DataTableFilter, { FilterConfig } from '~/app/(pages)/cars/components/data-table-filter';
import EditCarForm from '~/app/(pages)/cars/components/edit-car-form';
import { deleteCar } from '~/app/actions/cars/delete-car';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Car, User } from '~/lib/types';

interface DataDisplayI {
  cars: Car[];
  currentPage: number;
  totalPages: number;
  limit: number;
  makes: string[];
  users: User[];
}

const DataDisplay = ({ cars, currentPage, totalPages, limit, makes, users }: DataDisplayI) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(deleteCar, { success: false, deletedCar: null });
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const handleDeleteSave = (car: string) => {
    setDeletingCarId(car);
  };

  const handleDelete = (car: string) => {
    const formData = new FormData();
    formData.append('id', car);
    startTransition(() => {
      formAction(formData);
    });
    router.refresh();
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
  };

  const handleModalClose = () => {
    setEditingCar(null);
  };

  const columns: ColumnDef<Car>[] = [
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
  ];

  const getActions = (row: Car): Action<Car>[] => {
    if (deletingCarId === row.id) {
      return [
        {
          label: 'Zatwierdź',
          onClick: () => handleDelete(row.id),
          variant: 'destructive',
          disabled: isPending,
          className: 'cursor-pointer',
        },
        {
          label: 'Anuluj',
          onClick: () => setDeletingCarId(null),
          variant: 'outline',
          disabled: false,
          className: 'cursor-pointer',
        },
      ];
    }

    return [
      {
        label: 'Usuń',
        onClick: () => handleDeleteSave(row.id),
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
  };

  const carFilterConfig: FilterConfig[] = [
    {
      type:'select',
      param: 'carsMake',
      placeholder: 'Wybierz markę',
      options: makes.map(make => ({ value: make, label: make })),
    },
    {
      type:'select',
      param: 'carsOwner',
      placeholder: 'Wybierz użytkownika',
      options: users.map(user => ({ value: user.id, label: user.email })),
    },
    {
      type:'input',
      param:'carsSearchTerm',
      placeholder:'Wyszukaj po czymkolwiek',
    }
  ];

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
      />

      <Dialog open={!!editingCar} onOpenChange={isOpen => !isOpen && handleModalClose()}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edytuj pojazd</DialogTitle>
            <DialogDescription>Zaktualizuj dane wybranego pojazdu.</DialogDescription>
          </DialogHeader>
          {editingCar && <EditCarForm onSuccess={handleModalClose} initialData={editingCar} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataDisplay;
