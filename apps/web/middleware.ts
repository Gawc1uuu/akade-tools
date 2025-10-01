import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '~/lib/session';
import { deleteTokens, verifyToken } from '~/lib/tokens';

const protectedRoutes = ['/', '/cars', '/staff'];
const publicRoutes = ['/login', '/register'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = req.cookies.get('accessToken')?.value;
  const accessTokenPayload = await verifyToken(accessToken);

  // If the user is authenticated (has a valid token payload)
  if (accessTokenPayload) {
    const session = await getSession();

    // If the session cookie is missing/expired, refresh it via redirect
    if (!session) {
      // Create a redirect response to the same URL
      const response = NextResponse.redirect(req.nextUrl);

      // Manually set the new 5-second session cookie on the redirect response
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
        expires: new Date(Date.now() + 1000 * 5 * 60), // Keeping your 5-second expiry
      });

      return response; // Execute the redirect
    }

    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  } else {
    // If an unauthenticated user tries to access a protected route, redirect them.
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
