import React from 'react';
import CreateCarModal from '~/app/(pages)/cars/components/create-car-modal';
import DataDisplay from '~/app/(pages)/cars/data-display';
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
  };
}

const Cars = async ({ searchParams }: CarsProps) => {
  const params = await searchParams;
  const {page,limit,offset} = await parsePaginationParams(params,'cars')
  const makes = await getAllMakes();
  const users = await getAllOrganizationUsers();

  const { cars, totalPages, currentPage } = await getCars({
    page,
    limit,
    offset,
    carsMake:params?.carsMake,
    carsOwner:params?.carsOwner,
  });

  return (
    <div>
      <CreateCarModal />
      <div className="flex flex-col gap-8 px-10 min-w-0">
        <DataDisplay cars={cars} totalPages={totalPages} currentPage={currentPage} limit={limit} makes={makes} users={users} />
      </div>
    </div>
  );
};
export default Cars;
