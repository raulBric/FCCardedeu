import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Protect /dashboard routes with Supabase session verification.
 */
export async function middleware(req: NextRequest) {
  const wantsDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  // --- Crear Supabase client y comprobar sesión ---
  // Preparar respuesta mutable antes por si Supabase refresca cookies
  const res = NextResponse.next();

  // Fallback a variables NEXT_PUBLIC_ cuando las protegidas no están disponibles
  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // Si siguen sin definirse, lanza un error descriptivo en build para evitar sorpresas runtime
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase env vars missing: define SUPABASE_URL & SUPABASE_ANON_KEY (o sus equivalentes NEXT_PUBLIC_)');
  }

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      // No over-ride cookieEncoding; dejar a supabase default
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options?: CookieOptions) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options?: CookieOptions) => {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (wantsDashboard && (!user || error)) {
    const redirectUrl = new URL('/my-club', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    const redirectRes = NextResponse.redirect(redirectUrl);
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) redirectRes.headers.set('set-cookie', setCookie);
    return redirectRes;
  }

  // Si estamos autenticados o la ruta no es /dashboard* devolvemos la respuesta
  return res;
}

/**
 * Lightweight check for JWT expiration without external deps.
 * Returns true if token is expired or malformed.
 */
function isJwtExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    if (!payload) return true;
    // Decode base64url → base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // atob is available in Edge runtime; fallback to Buffer for tests/node
    const json = typeof atob !== 'undefined'
      ? atob(base64)
      : Buffer.from(base64, 'base64').toString('utf-8');
    const { exp } = JSON.parse(json);
    return typeof exp === 'number' ? exp * 1000 < Date.now() : true;
  } catch {
    return true;
  }
}

// Run middleware only for dashboard paths
export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};