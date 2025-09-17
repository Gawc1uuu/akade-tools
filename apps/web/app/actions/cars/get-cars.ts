import { db, cars } from '@repo/db';
import { count, eq } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';

interface GetCarsParams {
  page?: number;
  limit?: number;
}

export async function getCars({page=1,limit=5}:GetCarsParams={}) {
  const token = await getToken();
  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    throw new Error('Unauthenticated');
  }

  if (!decodedToken.organizationId) {
    throw new Error('Organization ID not found');
  }

  const {data,total} = await db.transaction(async (tx) => {
  const data = await tx.query.cars.findMany({
    where: eq(cars.organizationId, String(decodedToken.organizationId)),
    with:{
      owner:{
        columns:{
          id:true,
          email:true,
        }
      }
    },
    limit:limit,
    offset: (page - 1) * limit,
    orderBy: (cars, { desc }) => [desc(cars.createdAt)],
  });

  const totalResult= await tx.select({count:count()}).from(cars).where(eq(cars.organizationId, String(decodedToken.organizationId)));

  const total = totalResult[0]?.count ?? 0;

  return {data,total};
  });

  return {
    cars:data,
    total,
    totalPages:Math.ceil(total / limit),
    currentPage:page,
  };
}
