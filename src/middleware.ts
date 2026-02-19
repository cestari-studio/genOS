import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieOptions = { name: string; value: string; options?: Record<string, unknown> };

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieOptions[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isApiRoute = pathname.startsWith('/api/');
  const isAiRoute = pathname.startsWith('/api/ai/');

  // API routes: return JSON errors instead of HTML redirects
  if (isApiRoute) {
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // AI routes: resolve org_id and pass as header
    if (isAiRoute) {
      const { data: orgId, error: orgError } = await supabase.rpc('get_user_org_id');

      if (orgError || !orgId) {
        console.error(`TENTATIVA DE VIOLAÇÃO: user ${user.id} sem organização tentou acessar ${pathname}`);
        return NextResponse.json(
          { error: 'Usuário sem organização vinculada' },
          { status: 403 }
        );
      }

      // Clone the request headers and add org context
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-org-id', orgId as string);
      requestHeaders.set('x-user-id', user.id);

      supabaseResponse = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Re-apply cookie changes
      const cookieStore = request.cookies.getAll();
      cookieStore.forEach(cookie => {
        supabaseResponse.cookies.set(cookie.name, cookie.value);
      });
    }

    return supabaseResponse;
  }

  // Page routes: existing redirect behavior
  const publicRoutes = ['/login', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
