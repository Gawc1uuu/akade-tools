/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { NextRequest, NextResponse } from 'next/server';
import { deleteTokens, saveAccessTokenToCookies, saveRefreshTokenToCookies, verifyToken } from '~/lib/tokens';
import { getSession, saveSession } from '~/lib/session';
import { getMe, logout } from '~/app/actions/auth';
import { getUserById } from '@repo/db';

const protectedRoutes = ['/'];
const publicRoutes = ['/login', '/register'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const response = NextResponse.next();

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  let accessTokenPayload = await verifyToken(accessToken);
  const session = await getSession();

  if (!accessTokenPayload && refreshToken) {
    const refreshTokenPayload = await verifyToken(refreshToken);
    if (refreshTokenPayload && typeof refreshTokenPayload.userId === 'string') {
      const user = await getUserById(refreshTokenPayload.userId);

      if (!user) {
        await logout();
        return NextResponse.redirect(new URL('/login', req.nextUrl));
      }

      const newAccesToken = await saveAccessTokenToCookies({
        userId: user.id,
        email: user.email,
        role: user.role ?? null,
      });

      accessTokenPayload = await verifyToken(newAccesToken);
      await saveRefreshTokenToCookies({ userId: user.id });
    }
  }

  if (!session && accessTokenPayload) {
    const meResponse = await getMe();
    if (!meResponse) {
      await logout();
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    saveSession(meResponse);
  }

  if (isProtectedRoute && !accessTokenPayload?.userId) {
    await deleteTokens();
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && accessTokenPayload?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  runtime: 'nodejs',
};
