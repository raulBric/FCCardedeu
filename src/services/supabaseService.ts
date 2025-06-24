import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

// Configuración directa del cliente
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aiuizlmgicsqsrqdasgv.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWl6bG1naWNzcXNycWRhc2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjI4ODQsImV4cCI6MjA2MDk5ODg4NH0.vtwbwq7iahAIHCd3Y8afZIGBsZZxXz2fHsS6wJDAgwo'
);

// Funciones para noticias
export const getLatestNews = async (limit = 4) => {
  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// Funciones para resultados de partidos
export const getLatestResults = async (limit = 5) => {
  const { data, error } = await supabase
    .from('resultados')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// Funciones para convocatorias
export const getConvocatories = async () => {
  console.log('Llamando a getConvocatories');
  try {
    // Verificar explícitamente que el cliente supabase esté disponible
    if (!supabase) {
      console.error('Cliente Supabase no inicializado');
      throw new Error('Cliente Supabase no inicializado');
    }
    
    // Consulta con más información de depuración
    console.log('Ejecutando consulta a Supabase tabla:convocatorias');
    const { data, error } = await supabase
      .from('convocatorias')
      .select('*')
      .order('fecha', { ascending: true });
    
    if (error) {
      console.error('Error en consulta Supabase:', error);
      throw error;
    }
    
    console.log('Datos recuperados de convocatorias:', data?.length || 0, 'registros');
    
    // Si no hay datos, devolver array vacío explícitamente
    return data || [];
  } catch (error) {
    console.error('Error en getConvocatories:', error);
    throw error;
  }
};

// Funciones para pagos
export const getUserPayments = async (userId: string) => {
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
};

// Funciones para autenticación
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
