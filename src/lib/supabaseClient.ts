// src/lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Nota: No importamos 'cookies' de 'next/headers' para evitar errores en client components

// Marcador para indicar que este archivo es un módulo ES
export {}; // Esto fuerza a TypeScript a tratar el archivo como un módulo ES

/**
 * Cliente para componentes del cliente (páginas/componentes con "use client")
 * Uso: import { createBrowserSupabaseClient } from '@/lib/supabaseClient';
 *      const supabase = createBrowserSupabaseClient();
 */
export const createBrowserSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Configuración correcta para evitar errores de cookies asíncronas
      cookieOptions: {
        // Aseguramos que las cookies sean accesibles para JS en el cliente
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      }
    }
  );
};

/**
 * Cliente pre-configurado para uso directo en componentes del cliente
 * Uso: import { supabase } from '@/lib/supabaseClient';
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    // Configuración correcta para evitar errores de cookies asíncronas
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    }
  }
);

// NOTA: El cliente para Server Components se ha movido a un archivo separado
// para evitar errores de importación en componentes del cliente.
// Ver: src/lib/supabaseServerClient.ts

/**
 * Cliente tradicional para uso en entornos sin soporte para cookies (APIs, funciones)
 * Uso: import { createStandaloneClient } from '@/lib/supabaseClient';
 *      const supabase = createStandaloneClient();
 */
export const createStandaloneClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(supabaseUrl, supabaseKey);
};