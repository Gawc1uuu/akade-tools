'use server';

import { db, invites, users } from '@repo/db';
import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { getToken, verifyToken } from '~/lib/tokens';

export type InviteWorkerState = {
  success: boolean;
  errors: {
    email?: string[];
    other?: string[];
  };
  data?: {
    email?: string;
  };
};

const inviteWorkerSchema = z.object({
  email: z.email({message: 'Nieprawidłowy email'}),
});

export async function inviteWorker(prevState: InviteWorkerState, formData: FormData): Promise<InviteWorkerState> {
  const newState = prevState ?? { success: false, errors: {}, data: {} };
  const token = await getToken();
  const verifiedToken = await verifyToken(token);

  if (!verifiedToken) {
      return { ...newState, success: false, errors: { other: ['Nieprawidłowy token'] } };
    }

  const validatedFields = inviteWorkerSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return { ...newState, success: false, errors: validatedFields.error.flatten().fieldErrors, data: { email: formData.get('email') as string } };
  }

  const { email } = validatedFields.data;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (user) {
    return { ...newState, success: false, errors: { email: ['Pracownik już istnieje'] }, data: { email: formData.get('email') as string } };
  } 

  if(!verifiedToken.organizationId) {
    return { ...newState, success: false, errors: { other: ['Nieprawidłowy token'] } };
  } 
     await db.insert(invites).values({
    email: email as string,
    organizationId: verifiedToken.organizationId as string,
  })

  return { ...newState, success: true, data: { email } };
}
