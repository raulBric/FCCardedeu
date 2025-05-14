// src/lib/supabaseCookieHandler.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Logging para depuración
const verboseLog = true;

// Configuración actualizada de cookies según las prácticas recomendadas
export const cookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: true, // Importante para la seguridad
  secure: process.env.NODE_ENV === 'production'
};

// Función actualizada para usar en middleware (actualización de tokens)
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Siempre establecemos las cookies en la respuesta y la solicitud
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
          if (verboseLog) console.log(`[Auth] Cookie establecida: ${name}`);
        },
        remove(name: string, options: any) {
          request.cookies.delete({
            name,
            ...options,
          });
          response.cookies.delete({
            name,
            ...options,
          });
          if (verboseLog) console.log(`[Auth] Cookie eliminada: ${name}`);
        },
      },
    }
  );

  // Esto actualiza automáticamente el token si es necesario
  const { data } = await supabase.auth.getUser();
  
  if (verboseLog) {
    if (data?.user) {
      console.log(`[Auth] Usuario autenticado en middleware: ${data.user.email}`);
    } else {
      console.log('[Auth] Usuario no autenticado en middleware');
    }
  }

  return response;
}

// Cliente para middleware con manejo personalizado de cookies
export function createMiddlewareSupabaseClient(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            if (verboseLog) {
              console.log(`[MIDDLEWARE] Estableciendo cookie ${name}`);
            }
            res.cookies.set(name, value, options);
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
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            if (verboseLog) {
              console.log(`[SERVER_ACTION] Estableciendo cookie ${name}`);
            }
            cookieStore.set(name, value, options);
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

// IMPORTANTE: En lugar de crear otra instancia aquí, importar la instancia singleton
// Evitamos múltiples instancias de GoTrueClient
import { supabase as supabaseInstance } from './supabaseClient';
export const supabase = supabaseInstance;
