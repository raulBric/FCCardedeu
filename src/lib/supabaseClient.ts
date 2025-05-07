// src/lib/supabaseClient.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Cliente para componentes del cliente (páginas/componentes con "use client")
export const createClient$ = () => {
  return createClientComponentClient<Database>();
};

// Cliente para uso directo en componentes del cliente
export const supabase = createClientComponentClient<Database>();

// Cliente tradicional para uso en entornos sin soporte para cookies (APIs, funciones)
export const createStandaloneClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(supabaseUrl, supabaseKey);
};