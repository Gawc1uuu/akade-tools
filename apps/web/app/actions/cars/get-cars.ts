import { db, cars } from '@repo/db';
import { and, count, eq, ilike, or } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';
import { Car } from '~/lib/types';

interface GetCarsParams {
  page?: number;
  limit?: number;
  offset?: number;
  carsMake?: string;
  carsOwner?: string;
  carsSearchTerm?: string;
}

export async function getCars({ page = 1, limit = 10, offset, carsMake, carsOwner, carsSearchTerm }: GetCarsParams = {}) {
  const token = await getToken();
  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    throw new Error('Unauthenticated');
  }

  if (!decodedToken.organizationId) {
    throw new Error('Organization ID not found');
  }

  const conditions = [eq(cars.organizationId, String(decodedToken.organizationId))];

  if (carsMake) {
    conditions.push(eq(cars.make, carsMake));
  }

  if (carsOwner) {
    conditions.push(eq(cars.createdBy, carsOwner));
  }

  if (carsSearchTerm) {
    const searchTermWithWildcards = `%${carsSearchTerm}%`;
    conditions.push(
      or(
        ilike(cars.make, searchTermWithWildcards),
        ilike(cars.model, searchTermWithWildcards),
        ilike(cars.registrationNumber, searchTermWithWildcards)
      )
    );
  }

  const whereClause = and(...conditions);

  const { data, total } = await db.transaction(async tx => {
    const data = await tx.query.cars.findMany({
      where: whereClause,
      with: {
        owner: {
          columns: {
            id: true,
            email: true,
          },
        },
      },
      limit,
      offset,
      orderBy: (cars, { desc }) => [desc(cars.createdAt)],
    });

    const totalResult = await tx.select({ count: count() }).from(cars).where(whereClause);

    const total = totalResult[0]?.count ?? 0;

    return { data, total };
  });

  return {
    cars: data as Car[],
    total,
    totalPages: total === 0 ? 1 : Math.ceil(total / limit),
    currentPage: page,
  };
}
