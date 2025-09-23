import { db, users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';
import { User } from '~/lib/types';

export async function getAllOrganizationUsers(): Promise<User[]> {
  const token = await getToken();
  const decodedToken = await verifyToken(token);
  if (!decodedToken?.organizationId) {
    throw new Error('Organization ID not found');
  }
  const userResults = await db
    .select()
    .from(users)
    .where(eq(users.organizationId, String(decodedToken.organizationId)));
  return userResults as User[];
}
