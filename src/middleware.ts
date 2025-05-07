import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware mejorado para Next.js con Supabase Auth Helpers
 * Este middleware protege todas las rutas del dashboard verificando la sesión
 * de autenticación. Si no hay sesión, redirecciona al usuario al login.
 */
export async function middleware(req: NextRequest) {
  // Crear una respuesta para modificar con las cookies de autenticación
  const res = NextResponse.next();

  try {
    // Crear cliente de Supabase específico para middleware usando helpers oficiales
    const supabase = createMiddlewareClient({ req, res });
    
    // Obtener la sesión de autenticación, respetando las cookies
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // Ruta actual en la solicitud
    const { pathname } = req.nextUrl;
    
    // Solo aplicamos verificación a rutas del dashboard
    if (pathname.startsWith('/dashboard')) {
      // Si hay error o no hay sesión, redirigir al login
      if (error || !session) {
        const redirectUrl = new URL('/my-club', req.url);
        redirectUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }
    
    // Usuario autenticado o ruta no protegida: permitir la navegación
    return res;
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
    // Si hay error, lo más seguro es redirigir al login para rutas protegidas
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/my-club', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Para otras rutas, permitir la navegación
    return res;
  }
}

// Especificar las rutas donde se ejecutará este middleware
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*'
  ],
};
