'use server';

import { db, users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';

export async function deleteWorker(previousState: any, formData: FormData) {
  const token = await getToken();
  if (!token) {
    return { error: 'Unauthorized' };
  }

  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    return { error: 'Unauthorized' };
  }

  if (decodedToken.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const workerId = formData.get('workerId');

  const worker = await db.query.users.findFirst({
    where: eq(users.id, workerId as string),
  });

  if (!worker) {
    return { error: 'Worker not found' };
  }

  if (worker.role !== 'USER') {
    return { error: 'Worker is not a user' };
  }

  await db.delete(users).where(eq(users.id, workerId as string));
  return { success: 'Worker deleted successfully' };
}
