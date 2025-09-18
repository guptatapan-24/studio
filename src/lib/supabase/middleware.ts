
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function updateSession(req: NextRequest) {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let res = NextResponse.next({
      request: {
        headers: req.headers,
      },
    })

    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If the user is signed in and the current path is /login, redirect to /levels
    if (user && req.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/levels', req.url))
    }

    const protectedPaths = ['/levels', '/design', '/play'];
    const isProtectedPath = protectedPaths.some(p => req.nextUrl.pathname.startsWith(p));

    // If the user is not signed in and the current path is a protected one, redirect to /login
    if (!user && isProtectedPath) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // Refresh the session if it's about to expire
    await supabase.auth.getSession()

    return res
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: req.headers,
      },
    })
  }
}
