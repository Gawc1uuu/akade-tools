import { db, users } from '@repo/db';
import { and, count, eq, ilike, like, or } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';
import { User } from '~/lib/types';

export async function getOrganizationWorkers({
  page,
  limit,
  offset,
  staffSearchTerm,
}: {
  page: number;
  limit: number;
  offset: number;
  staffSearchTerm: string;
}) {
  const token = await getToken();
  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    throw new Error('Unauthenticated');
  }

  if (!decodedToken.organizationId) {
    throw new Error('Organization ID not found');
  }

  const conditions = [eq(users.organizationId, String(decodedToken.organizationId))];

  if (staffSearchTerm) {
    const searchTermWithWildcards = `%${staffSearchTerm}%`;
    conditions.push(or(ilike(users.email, searchTermWithWildcards), ilike(users.firstName, searchTermWithWildcards), ilike(users.lastName, searchTermWithWildcards)));
  }

  const whereClause = and(...conditions);

  const { data, total } = await db.transaction(async tx => {
    const data = await tx.query.users.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    const totalResult = await tx.select({ count: count() }).from(users).where(whereClause);

    const total = totalResult[0]?.count ?? 0;

    return { data, total };
  });

  return {
    data: data as User[],
    total,
    totalPages: total === 0 ? 1 : Math.ceil(total / limit),
    currentPage: page,
  };
}
