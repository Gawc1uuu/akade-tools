import { db, cars } from '@repo/db';
import { and, count, eq } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';
import { Car, User } from '~/lib/types';


interface GetCarsParams {
  page?: number;
  pageSize?: number;
  make?: string;
  owner?:string;
}

export async function getCars({ page = 1, pageSize = 5, make, owner }: GetCarsParams = {}) {
  const token = await getToken();
  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    throw new Error('Unauthenticated'); 
  }

  if (!decodedToken.organizationId) {
    throw new Error('Organization ID not found');
  }

  const conidtions = [
    eq(cars.organizationId, String(decodedToken.organizationId)),
  ];

  if (make) {
    conidtions.push(eq(cars.make, make));
  }

  if(owner){
    conidtions.push(eq(cars.createdBy,owner))
  }

  const whereClause = and(...conidtions);

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
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: (cars, { desc }) => [desc(cars.createdAt)],
    });

    const totalResult = await tx
      .select({ count: count() })
      .from(cars)
      .where(whereClause);

    const total = totalResult[0]?.count ?? 0;

    return { data, total };
  });

  return {
    cars: data as Car[],
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
}
