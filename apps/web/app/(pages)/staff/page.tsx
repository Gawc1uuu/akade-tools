import AddWorkerDialog from '~/app/(pages)/staff/components/add-worker-dialog';
import StaffTableContainer from '~/app/(pages)/staff/components/staff-table-container';
import { parsePaginationParams } from '~/app/actions/cars/parsePaginationParams';
import { getOrganizationWorkers } from '~/app/actions/staff/get-organization-workers';

interface StaffProps {
  searchParams: {
    staffPage?: string;
    staffPageSize?: string;
    staffSearchTerm?: string;
  };
}

const Staff = async ({ searchParams }: StaffProps) => {
  const params = await searchParams;
  const { page, limit, offset } = await parsePaginationParams(params, 'staff');

  const workers = await getOrganizationWorkers({
    page,
    limit,
    offset,
    staffSearchTerm: params?.staffSearchTerm ?? '',
  });

  console.log(workers);

  return (
    <div>
      <StaffTableContainer />
      <AddWorkerDialog />
    </div>
  );
};

export default Staff;
