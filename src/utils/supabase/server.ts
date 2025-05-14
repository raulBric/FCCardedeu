import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Versión de servidor con implementación oficial de Supabase
// `cookieStore` acepta cualquier objeto con los métodos `getAll` y `setAll`
export const createClient = (cookieStore: {
  getAll: () => any[];
  setAll: (cookies: { name: string; value: string; options?: CookieOptions }[]) => void;
}) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll?.() ?? [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.setAll?.([{
                name,
                value,
                options,
              }])
            );
          } catch {
            // The `setAll` method may be called from a Server Component,
            // where mutating cookies is not allowed. This can be ignored
            // if you have middleware refreshing user sessions.
          }
        },
      },
    },
  );
};

// Wrappers de compatibilidad para código legacy con importación dinámica
export const createServerSupabaseClient = () => {
  // Importación diferida para evitar que el bundler incluya `next/headers` en cliente
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { cookies } = require("next/headers");
  return createClient(cookies());
};

export const createServerActionClient = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { cookies } = require("next/headers");
  return createClient(cookies());
};
