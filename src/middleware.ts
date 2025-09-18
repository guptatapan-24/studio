
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedPaths = ['/levels', '/design', '/play'];
  const publicPaths = ['/login', '/reset-password', '/auth/callback'];

  const isPublicPath = publicPaths.some(p => request.nextUrl.pathname.startsWith(p)) || request.nextUrl.pathname === '/';
  const isProtectedPath = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));


  // if user is not signed in and the current path is protected, redirect the user to /login
  if (!user && isProtectedPath) {
     const url = request.nextUrl.clone()
     url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  // if user is signed in and trying to access a public-only path, redirect to levels
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/reset-password')) {
      const url = request.nextUrl.clone()
      url.pathname = '/levels'
      return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
