import * as jose from 'jose';
import { cookies } from 'next/headers';
import { AccessTokenPayload, RefreshTokenPayload } from '~/lib/types';

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createAccessToken(payload: AccessTokenPayload, expiresAt: Date) {
  return new jose.SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(expiresAt).sign(encodedKey);
}

export async function verifyToken(token: string = '') {
  try {
    const { payload } = await jose.jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Failed to verify token');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    return null;
  }
}

export async function saveAccessTokenToCookies(payload: AccessTokenPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const accessToken = await createAccessToken(payload, expiresAt);
  const cookieStore = await cookies();

  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  return accessToken;
}

export async function deleteTokens() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
}
