import React from 'react';
import { columns } from '~/app/(pages)/cars/components/columns';
import CreateCarModal from '~/app/(pages)/cars/components/create-car-modal';
import { DataTable } from '~/app/(pages)/cars/components/data-table';
import { getCars } from '~/app/actions/cars/get-cars';
import { Car } from '~/lib/types';

const Cars = async () => {
  const cars = await getCars();

  return (
    <div>
      <CreateCarModal />
      <div className="flex flex-col gap-8 px-10">
        <DataTable columns={columns} data={cars as Car[]} title="Pojazdy" />
      </div>
    </div>
  );
};
export default Cars;
