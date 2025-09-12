/* eslint-disable no-useless-escape */
'use server';
import * as z from 'zod';
import { db, getUserById, users } from '@repo/db';
import { deleteToken, saveAccessTokenToCookies, verifyAccessToken } from '~/lib/tokens';
import { deleteSession } from '~/lib/session';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

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
    .returning({ id: users.id });

  const user = data[0];

  if (!user) {
    return {
      message: 'Error occured while creating your account',
    };
  }
  await saveAccessTokenToCookies(user.id);
  redirect('/');
}

export async function getMe() {
    const cookiesStore = await cookies()
    const token = cookiesStore.get('accessToken')?.value;
  const session = await verifyAccessToken(token);
  if (session && typeof session.id === 'string') {
    const user = await getUserById(session.id);
    return user;
  }
  return null;
}

export async function logout() {
  await deleteSession();
  await deleteToken();
  redirect('/login');
}
