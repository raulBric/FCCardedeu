// src/lib/supabaseClient.ts - COMPATIBILITY FACADE
// -----------------------------------------------------------------------------
// Este archivo se mantiene para evitar refactors masivos en toda la base de
// código. Internamente delega en la nueva implementación oficial situada en
// `src/utils/supabase`. De esta forma evitamos duplicar instancias de
// GoTrueClient y mantenemos un único punto de verdad.
// -----------------------------------------------------------------------------

import { createClient as createSupabaseBrowserClient } from '@/utils/supabase/client';

// Instancia singleton reaprovechada por los módulos legacy
let _supabase: ReturnType<typeof createSupabaseBrowserClient> | null = null;

export const supabase = (() => {
  if (!_supabase) {
    _supabase = createSupabaseBrowserClient();
  }
  return _supabase;
})();

// EXPOSICIONES DE COMPATIBILIDAD ------------------------------------------------
// Algunos módulos antiguos esperaban las funciones/constantes siguientes. Las
// re-exportamos apuntando a la nueva factoría.
export const createBrowserSupabaseClient = createSupabaseBrowserClient;
export const createStandaloneClient = createSupabaseBrowserClient;
export const cookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 7 días
};