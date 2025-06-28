import { createClient } from '@supabase/supabase-js';

// Valores de Supabase para asegurar disponibilidad en el cliente
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aiuizlmgicsqsrqdasgv.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWl6bG1naWNzcXNycWRhc2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjI4ODQsImV4cCI6MjA2MDk5ODg4NH0.vtwbwq7iahAIHCd3Y8afZIGBsZZxXz2fHsS6wJDAgwo';

// Función principal para configurar la tabla
export async function configurarTablaInscripcions() {
  try {
    // Crear un cliente de Supabase con opciones mejoradas
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    });

    // Verificar si la tabla 'inscripcions' ya existe mediante una consulta simple
    const { data, error: checkError } = await supabase
      .from('inscripcions')
      .select('count(*)', { count: 'exact', head: true })
      .limit(1);

    // Si hay un error al verificar la existencia de la tabla
    if (checkError && checkError.code === '42P01') { // codigo para "tabla no existe"
      console.log('La tabla inscripcions no existe. Intentando crear...', checkError);
      
      // Llamar a la función RPC que crea la tabla con políticas RLS adecuadas
      const { error } = await supabase.rpc('create_inscripcions_table');
      
      if (error) {
        console.error('Error al crear la tabla inscripcions:', error);
        throw new Error(`Error al crear la tabla: ${error.message}`);
      }
      
      console.log('Tabla inscripcions creada correctamente');
      
      // Configurar políticas para asegurar acceso desde el dashboard
      await configurarPoliticasAcceso(supabase);
    } else {
      console.log('La tabla inscripcions ya existe');
      
      // Verificar y actualizar políticas aunque la tabla exista
      await configurarPoliticasAcceso(supabase);
    }

    return true;
  } catch (error) {
    console.error('Error al verificar la tabla inscripcions:', error);
    return false;
  }
}

// Función para configurar políticas de acceso adecuadas
// Usamos any para evitar problemas de compatibilidad entre versiones de Supabase
async function configurarPoliticasAcceso(supabase: any) {
  try {
    // Esta función RPC debe crear una política que permita ver las inscripciones desde el dashboard
    // aún cuando la sesión del usuario caduque
    const { error } = await supabase.rpc('ensure_inscripciones_access');

    if (error) {
      console.error('Error al configurar políticas de acceso:', error);
    } else {
      console.log('Políticas de acceso configuradas correctamente');
    }
  } catch (error) {
    console.error('Error al configurar políticas de acceso:', error);
  }
}
