import InvitesTableContainer from '~/app/(pages)/staff/components/invites-table-container';
import StaffTableContainer from '~/app/(pages)/staff/components/staff-table-container';
import { parsePaginationParams } from '~/app/actions/cars/parsePaginationParams';
import { getOrganizationInvites } from '~/app/actions/staff/get-invites';
import { getOrganizationWorkers } from '~/app/actions/staff/get-organization-workers';

interface StaffProps {
  searchParams: {
    staffPage?: string;
    staffPageSize?: string;
    staffSearchTerm?: string;
    invitesPage?: string;
    invitesPageSize?: string;
  };
}

const Staff = async ({ searchParams }: StaffProps) => {
  const params = await searchParams;
  const { page: staffPage, limit: staffLimit, offset: staffOffset } = await parsePaginationParams(params, 'staff');
  const { page: invitesPage, limit: invitesLimit, offset: invitesOffset } = await parsePaginationParams(params, 'invites');

  const workers = await getOrganizationWorkers({
    page: staffPage,
    limit: staffLimit,
    offset: staffOffset,
    staffSearchTerm: params?.staffSearchTerm ?? '',
  });

  console.log(workers);

  const invites = await getOrganizationInvites({
    page: invitesPage,
    limit: invitesLimit,
    offset: invitesOffset,
  });

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-8 px-4 md:px-6 lg:px-10 min-w-0 mt-6 md:mt-10">
        <StaffTableContainer page={staffPage} limit={staffLimit} workers={workers.data} totalPages={workers.totalPages} />
        <InvitesTableContainer page={invitesPage} limit={invitesLimit} invites={invites.data} totalPages={invites.totalPages} />
      </div>
    </div>
  );
};

export default Staff;
