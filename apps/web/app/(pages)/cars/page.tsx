import React from 'react';
import CreateCarModal from '~/app/(pages)/cars/components/create-car-modal';
import DataDisplay from '~/app/(pages)/cars/data-display';
import { getCars } from '~/app/actions/cars/get-cars';

interface CarsProps {
  searchParams?: {
    page?: string;
    pageSize?: string;
  };
}

const Cars = async ({ searchParams }: CarsProps) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 5;
  const { cars, totalPages, currentPage } = await getCars({ page: Number(page), pageSize: Number(pageSize) });

  return (
    <div className="border border-black">
      <CreateCarModal />
      <div className="flex flex-col gap-8 px-10 min-w-0 border border-black">
        <DataDisplay cars={cars} totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
};
export default Cars;
