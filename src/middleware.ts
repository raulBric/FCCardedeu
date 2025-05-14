// middleware.ts (Implementación oficial Supabase SSR)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(req: NextRequest) {
  // Crear cliente Supabase para el middleware
  const { supabase, response } = createClient(req);
  
  // Verificar si el usuario está autenticado
  const { data: { session } } = await supabase.auth.getSession();
  
  // Registrar información para depuración
  console.log(`[MIDDLEWARE] Ruta: ${req.nextUrl.pathname}`, { 
    autenticado: !!session,
    usuario: session?.user?.email || 'no autenticado'
  });
  
  // Si la ruta está en el dashboard y el usuario no está autenticado, redirigir al login
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    console.log('[MIDDLEWARE] ❌ Usuario no autenticado, redirigiendo...');
    return NextResponse.redirect(new URL('/my-club', req.url));
  }
  
  // En cualquier otro caso, continuar con la solicitud
  console.log('[MIDDLEWARE] ✅ Acceso permitido');
  return response;
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
  ],
};
