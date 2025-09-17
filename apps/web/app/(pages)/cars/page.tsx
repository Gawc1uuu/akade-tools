import React from 'react';
import { columns } from '~/app/(pages)/cars/components/columns';
import CreateCarModal from '~/app/(pages)/cars/components/create-car-modal';
import { DataTable } from '~/app/(pages)/cars/components/data-table';
import { getCars } from '~/app/actions/cars/get-cars';
import { Car } from '~/lib/types';

interface CarsProps {
  searchParams?: {
    page?: string;
  };
}

const Cars = async ({ searchParams }: CarsProps) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const { cars, totalPages, currentPage, total } = await getCars({ page: Number(page) });

  return (
    <div>
      <CreateCarModal />
      <div className="flex flex-col gap-8 px-10 min-w-0">
        <DataTable columns={columns} data={cars as Car[]} title="Pojazdy" page={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};
export default Cars;
