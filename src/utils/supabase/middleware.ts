import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Valores de conexión para Supabase con fallbacks idénticos a los demás clientes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aiuizlmgicsqsrqdasgv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWl6bG1naWNzcXNycWRhc2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjI4ODQsImV4cCI6MjA2MDk5ODg4NH0.vtwbwq7iahAIHCd3Y8afZIGBsZZxXz2fHsS6wJDAgwo';

// Versión simplificada de middleware usando exactamente la implementación oficial
export const createClient = (request: NextRequest) => {
  // Crear una respuesta sin modificar
  let response = NextResponse.next();

  // Crear cliente de Supabase con manejo de cookies
  console.log(`[MIDDLEWARE] Creando cliente con URL: ${supabaseUrl.substring(0, 15)}...`);
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Asegurarnos de reflejar los cambios tanto en la request como en la response
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  return { supabase, response };
};
