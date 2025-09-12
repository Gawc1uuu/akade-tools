import * as jose from 'jose';
import { cookies } from 'next/headers';
import { JWTPayload } from '~/lib/types';

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createAccessToken(payload: JWTPayload) {
  return new jose.SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(encodedKey);
}

export async function verifyAccessToken(token: string | undefined = '') {
  try {
    const { payload } = await jose.jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}

export async function saveAccessTokenToCookies(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await createAccessToken({ id: userId });
  const cookieStore = await cookies();

  cookieStore.set('accessToken', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteToken() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
}
