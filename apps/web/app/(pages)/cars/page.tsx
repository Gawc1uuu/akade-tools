import React from 'react';
import CreateCarModal from '~/app/(pages)/cars/components/create-car-modal';
import DataDisplay from '~/app/(pages)/cars/data-display';
import { getAllOrganizationUsers } from '~/app/actions/cars/get-all-emails';
import { getAllMakes } from '~/app/actions/cars/get-all-makes';
import { getCars } from '~/app/actions/cars/get-cars';

interface CarsProps {
  searchParams?: {
    page?: string;
    pageSize?: string;
    make?: string;
    owner?: string;
  };
}

const Cars = async ({ searchParams }: CarsProps) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 5;
  const makes = await getAllMakes();
  const users = await getAllOrganizationUsers();

  const { cars, totalPages, currentPage } = await getCars({
    page: Number(page),
    pageSize: Number(pageSize),
    make: params?.make,
    owner: params?.owner,
  });

  return (
    <div>
      <CreateCarModal />
      <div className="flex flex-col gap-8 px-10 min-w-0">
        <DataDisplay cars={cars} totalPages={totalPages} currentPage={currentPage} pageSize={pageSize} makes={makes} users={users} />
      </div>
    </div>
  );
};
export default Cars;
