/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { NextRequest, NextResponse } from 'next/server';
import { deleteTokens, verifyToken } from '~/lib/tokens';

const protectedRoutes = ['/'];
const publicRoutes = ['/login', '/register'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const response = NextResponse.next();

  const accessToken = req.cookies.get('accessToken')?.value;
  let accessTokenPayload = await verifyToken(accessToken);

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
