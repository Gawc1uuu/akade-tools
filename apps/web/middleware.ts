import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '~/lib/session';
import { verifyToken } from '~/lib/tokens';

const protectedRoutes = ['/', '/cars', '/staff'];
const publicRoutes = ['/login', '/register'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = req.cookies.get('accessToken')?.value;

  if (!accessToken) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    return NextResponse.next();
  }


  const accessTokenPayload = await verifyToken(accessToken);

  if (accessTokenPayload) {
    const session = await getSession();

    if (!session) {
      const response = NextResponse.redirect(req.nextUrl);

      response.cookies.set({
        name: 'session',
        value: JSON.stringify({
          id: accessTokenPayload.userId as string,
          email: accessTokenPayload.email as string,
          role: accessTokenPayload.role as string,
          organizationId: accessTokenPayload.organizationId as string,
        }),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1000 * 5 * 60),
      });

      return response;
    }

    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  } else {
    if (isProtectedRoute) {
      const response = NextResponse.redirect(new URL('/login', req.nextUrl));
      response.cookies.delete('accessToken');
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
