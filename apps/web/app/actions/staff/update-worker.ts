'use server';

import { db, users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';

export async function updateWorker(previousState: any, formData: FormData) {
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
  if (!workerId) {
    return { error: 'Worker ID is required' };
  }

  const worker = await db.query.users.findFirst({
    where: eq(users.id, workerId as string),
  });

  if (!worker) {
    return { error: 'Worker not found' };
  }

  const role = formData.get('role') as 'ADMIN' | 'USER';

  await db
    .update(users)
    .set({
      role: role,
    })
    .where(eq(users.id, workerId as string));

  return { success: 'Worker updated successfully' };
}
