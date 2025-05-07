import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

/**
 * Middleware para proteger rutas privadas del dashboard.
 * 
 * ATENCIÓN: Para que este middleware funcione en desarrollo, es necesario
 * ejecutar Next.js SIN Turbopack: `next dev` (sin --turbopack).
 * En producción (next build && next start) siempre funciona correctamente.
 */
export async function middleware(req: NextRequest) {
  console.log(`🔒 Middleware ejecutándose para: ${req.nextUrl.pathname}`);
  
  // Crear respuesta que se modificará según el resultado de autenticación
  const res = NextResponse.next();
  
  try {
    // Crear cliente de Supabase para el middleware
    const supabase = createMiddlewareClient({ req, res });
    
    // Obtener la sesión del usuario actual
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error al verificar sesión:', error.message);
      // Ante un error, redirigir al login para evitar falsos positivos
      return redirectToLogin(req);
    }
    
    // Verificación explícita: la sesión debe existir Y tener un usuario
    const isAuthenticated = !!data.session && !!data.session.user;
    console.log(`👤 Usuario autenticado: ${isAuthenticated ? 'SÍ' : 'NO'}`);

    if (!isAuthenticated) {
      return redirectToLogin(req);
    }
    
    // Usuario autenticado: permitir acceso
    console.log('✅ Acceso permitido al dashboard');
    return res;
    
  } catch (err) {
    console.error('Error en middleware:', err);
    // Ante cualquier error, lo más seguro es redirigir al login
    return redirectToLogin(req);
  }
}

// Función auxiliar para crear redirección al login
function redirectToLogin(req: NextRequest) {
  console.log('🔄 Redirigiendo a login');
  const redirectUrl = new URL('/my-club', req.url);
  redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

// Especificar las rutas que necesitan protección
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*'
  ],
};
