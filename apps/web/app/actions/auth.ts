/* eslint-disable no-useless-escape */
'use server';
import * as z from 'zod';
import { db, getUserByEmail, organizations, users } from '@repo/db';
import { deleteTokens, saveAccessTokenToCookies } from '~/lib/tokens';
import { deleteSession } from '~/lib/session';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';

const registerFormSchema = z.object({
  email: z.email('This is not correct email').trim(),
  password: z
    .string()
    .min(8, { message: 'Password must bee at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    }),
});

export type FormState = {
  success: boolean;
  errors: {
    email?: string[];
    password?: string[];
    other?: string[];
  };
  data?: {
    email?: string;
    password?: string;
  };
};

export async function signup(currentState: FormState, formData: FormData): Promise<FormState> {
  const rawData = {
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  };

  const validatedFields = registerFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      data: rawData,
    };
  }

  const userCheck = await getUserByEmail(rawData.email);

  if (userCheck) {
    return {
      success: false,
      errors: { other: ['Uzytkownik juz istnieje'] },
      data: rawData,
    };
  }

  const { email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { organization, user } = await db.transaction(async tx => {
    const [organization] = await tx
      .insert(organizations)
      .values({
        name: `${email.split('@')[0]}'s Organization`,
        organizationEmail: email,
      })
      .returning();

    if (!organization) {
      throw new Error('Failed to create organization');
    }

    const [user] = await tx
      .insert(users)
      .values({
        email: email,
        password: hashedPassword,
        firstName: '',
        lastName: '',
        organizationId: organization.id,
      })
      .returning();

    if (!user) {
      throw new Error('Failed to create user');
    }

    return { organization, user };
  });

  await saveAccessTokenToCookies({ userId: user.id, email: user.email, role: user.role, organizationId: organization?.id });
  redirect('/');
}

export async function login(currentState: FormState, formData: FormData): Promise<FormState> {
  const rawData = {
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  };

  const validatedFields = registerFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      data: rawData,
    };
  }
  const { email, password } = validatedFields.data;

  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    return {
      success: false,
      errors: { other: ['Nieprawidłowy email lub hasło'] },
      data: rawData,
    };
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return {
      success: false,
      errors: { other: ['Nieprawidłowy email lub hasło'] },
      data: rawData,
    };
  }

  if (!user.organizationId) {
    return {
      success: false,
      errors: { other: ['Nieprawidłowy email lub hasło'] },
      data: rawData,
    };
  }

  await saveAccessTokenToCookies({ userId: user.id, email: user.email, role: user.role, organizationId: user.organizationId });
  redirect('/');
}

export async function logout() {
  await deleteSession();
  await deleteTokens();
  redirect('/login');
}
