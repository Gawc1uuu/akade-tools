/* eslint-disable no-useless-escape */
'use server';
import * as z from 'zod';
import { db, getUserById, users } from '@repo/db';
import { deleteTokens, saveAccessTokenToCookies, saveRefreshTokenToCookies, verifyAccessToken } from '~/lib/tokens';
import { deleteSession } from '~/lib/session';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { AccessTokenPayload } from '~/lib/types';

const registerFormSchema = z.object({
  email: z.email('This is not correct email').trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    }),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function signup(currentState: FormState, formData: FormData) {
  const validatedFields = registerFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
    })
    .returning();

  const user = data[0];

  if (!user) {
    return {
      message: 'Error occured while creating your account',
    };
  }
  await saveAccessTokenToCookies({userId:user.id,email:user.email,role:user.role});
  await saveRefreshTokenToCookies({userId:user.id})
  redirect('/');
}

export async function getMe() {
  const payload = await verifyAccessToken() as AccessTokenPayload
  if(!payload){
    return null
  }
  const user = await getUserById(payload.userId)
  return user
}

export async function logout() {
  await deleteSession();
  await deleteTokens();
  // redirect('/login');
}
