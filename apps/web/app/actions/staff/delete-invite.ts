'use server';

import { db, invites, users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';

export async function deleteInvite(previousState: any, formData: FormData) {
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

  const inviteId = formData.get('inviteId');
  if (!inviteId) {
    return { error: 'Invite ID is required' };
  }

  const invite = await db.query.invites.findFirst({
    where: eq(invites.id, inviteId as string),
  });

  if (!invite) {
    return { error: 'Invite not found' };
  }

  await db.delete(invites).where(eq(invites.id, inviteId as string));
  return { success: 'Invite deleted successfully' };
}
