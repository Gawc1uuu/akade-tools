import React from 'react';
import CarsTable from '~/app/(pages)/cars/components/cars-table';
import { getAllOrganizationUsers } from '~/app/actions/cars/get-all-emails';
import { getAllMakes } from '~/app/actions/cars/get-all-makes';
import { getCars } from '~/app/actions/cars/get-cars';
import { parsePaginationParams } from '~/app/actions/cars/parsePaginationParams';

interface CarsProps {
  searchParams: {
    carsPage?: string;
    carsPageSize?: string;
    carsMake?: string;
    carsOwner?: string;
    carsSearchTerm?: string;
  };
}

const Cars = async ({ searchParams }: CarsProps) => {
  const params = await searchParams;
  const { page, limit, offset } = await parsePaginationParams(params, 'cars');
  const makes = await getAllMakes();
  const users = await getAllOrganizationUsers();

  const { cars, totalPages, currentPage } = await getCars({
    page,
    limit,
    offset,
    carsMake: params?.carsMake,
    carsOwner: params?.carsOwner,
    carsSearchTerm: params?.carsSearchTerm,
  });

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-8 px-4 md:px-6 lg:px-10 min-w-0 mt-6 md:mt-10">
        <CarsTable cars={cars} totalPages={totalPages} currentPage={currentPage} limit={limit} makes={makes} users={users} />
      </div>
    </div>
  );
};
export default Cars;
