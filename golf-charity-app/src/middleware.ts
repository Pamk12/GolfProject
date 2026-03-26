import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Failsafe: if the user hasn't configured local environment variables, 
    // bypass the middleware checks rather than crashing the Next.js server.
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /user and /admin routes
  const isUserRoute = request.nextUrl.pathname.startsWith('/user');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (!user && (isUserRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Phase 1: Access Control - Enforce Active Subscription
  // Only block users who are explicitly lapsed/cancelled. New users (active or null) pass through.
  if (user && isUserRoute) {
    const { data: dbUser } = await supabase
      .from('users')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    const status = dbUser?.subscription_status;
    if (status === 'lapsed' || status === 'cancelled') {
      return NextResponse.redirect(new URL('/charities', request.url));
    }
  }

  // Future logic: verify is_admin flag for /admin routes

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, assets, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
