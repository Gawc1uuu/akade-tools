import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '~/lib/tokens'
import { getSession, saveSession } from '~/lib/session'
import { getMe, logout } from '~/app/actions/auth'

 
const protectedRoutes = ['/']
const publicRoutes = ['/login', '/register']


 
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
 
  const accessToken = req.cookies.get('accessToken')?.value
  const accessTokenPayload = await verifyAccessToken(accessToken)
  
  const session = await getSession()

  if(!session && accessTokenPayload){
    const meResponse = await getMe(); 
    if(!meResponse){
        await logout()
        return NextResponse.redirect(new URL('/login',req.nextUrl))
    }
    saveSession(meResponse)
  }
 
  if (isProtectedRoute && !accessTokenPayload?.id) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  if (
    isPublicRoute &&
    accessTokenPayload?.id
  ) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  runtime:'nodejs'
}