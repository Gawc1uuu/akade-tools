/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { NextRequest, NextResponse } from 'next/server';
import { decodeAccessTokenJwt, deleteTokens, saveAccessTokenToCookies, saveRefreshTokenToCookies, verifyToken } from '~/lib/tokens';
import { getSession, saveSession } from '~/lib/session';
import { getMe, logout } from '~/app/actions/auth';
import { AccessTokenPayload } from '~/lib/types';

const protectedRoutes = ['/'];
const publicRoutes = ['/login', '/register'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const response = NextResponse.next()

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  let accessTokenPayload = await verifyToken(accessToken);
  const session = await getSession();

  if(!accessTokenPayload && refreshToken){
    const refreshTokenPayload = await verifyToken(refreshToken)
    if(refreshTokenPayload && typeof refreshTokenPayload.userId === 'string'){

      const decodedAccessToken = await decodeAccessTokenJwt(accessToken) as AccessTokenPayload;

      if (!decodedAccessToken || !decodedAccessToken.userId) {
        await logout();
        return NextResponse.redirect("/login");
      }

      const newAccesToken = await saveAccessTokenToCookies({
        userId: decodedAccessToken.userId,
        email: decodedAccessToken.email,
        role: decodedAccessToken.role ?? null
      });

      accessTokenPayload = await verifyToken(newAccesToken);
      await saveRefreshTokenToCookies({ userId: (accessTokenPayload as AccessTokenPayload).userId });
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
    await deleteTokens()
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && accessTokenPayload?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  runtime: 'nodejs',
};
