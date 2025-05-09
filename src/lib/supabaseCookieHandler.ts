// src/lib/supabaseCookieHandler.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Configuración común de cookies para asegurar consistencia entre clientes
export const cookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: false, // Necesario para que funcione en el cliente
  secure: process.env.NODE_ENV === 'production'
};

// Cliente para middleware con manejo personalizado de cookies
export function createMiddlewareSupabaseClient(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          // Simplemente obtenemos el valor crudo de la cookie sin parsear
          return req.cookies.get(name)?.value || '';
        },
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...cookieOptions,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...cookieOptions,
            ...options,
            maxAge: 0
          });
        },
      },
    }
  );
}

// Cliente para server action y route handlers con manejo asíncrono correcto
export async function createServerActionClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name) => {
          const cookie = cookieStore.get(name);
          return cookie?.value || '';
        },
        set: (name, value, options) => {
          cookieStore.set(name, value, {
            ...cookieOptions,
            ...options,
          });
        },
        remove: (name, options) => {
          cookieStore.set(name, '', {
            ...cookieOptions,
            ...options,
            maxAge: 0
          });
        },
      },
    }
  );
}

// Cliente para componentes del cliente (navegador)
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: cookieOptions
    }
  );
}

// Cliente preconfigurado para uso en el lado del cliente
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookieOptions: cookieOptions
  }
);
