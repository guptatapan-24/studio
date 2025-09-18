
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

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
  
  if (user && !isProtectedPath && !isPublicPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/levels'
      return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
