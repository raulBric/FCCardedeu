/**
 * Cliente de Supabase para Server Components de Next.js App Router
 * 
 * IMPORTANTE: Este archivo SOLO debe importarse desde Server Components
 * o Route Handlers del directorio app/.
 */

import { createServerClient } from '@supabase/ssr';

/**
 * Crea un cliente de Supabase para componentes del servidor
 */
export function createServerSupabaseClient() {
  // En Next.js 15, es mejor crear primero un cliente sin cookies
  // y luego aplicar las cookies manualmente para evitar problemas de tipado
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Implementación simple sin cookies, para mantener compatibilidad
      // con cualquier entorno de App Router (server components o server actions)
      cookies: {
        // El getter de cookies no hace nada, ya que no tenemos acceso a cookies
        // Sin embargo, Supabase también lee authToken de localStorage en cliente
        get: () => undefined,
        // Los setters/removers no hacen nada en server components
        set: () => {},
        remove: () => {}
      }
    }
  );
}
