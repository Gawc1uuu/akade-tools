'use client';
import React from 'react';
import { columns } from '~/app/(pages)/cars/components/columns';
import { Action, DataTable } from '~/app/(pages)/cars/components/data-table';
import { Car } from '~/lib/types';

interface DataDisplayI {
  cars: Car[];
  currentPage: number;
  totalPages: number;
}

const DataDisplay = ({ cars, currentPage, totalPages }: DataDisplayI) => {
  const getActions = (row: Car): Action<Car>[] => {
    return [
      {
        label: 'delete',
        onClick: () => console.log('hello'),
        variant: 'destructive',
        disabled: false,
      },
    ];
  };

  return (
    <div>
      <DataTable
        actions={row => getActions(row)}
        columns={columns}
        data={cars as Car[]}
        title="Pojazdy"
        page={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default DataDisplay;
