import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Versión simplificada de middleware usando exactamente la implementación oficial
export const createClient = (request: NextRequest) => {
  // Crear una respuesta sin modificar
  let response = NextResponse.next();

  // Crear cliente de Supabase con manejo de cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
