import { createClient } from '@supabase/supabase-js';

// Valores de conexión para Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aiuizlmgicsqsrqdasgv.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWl6bG1naWNzcXNycWRhc2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjI4ODQsImV4cCI6MjA2MDk5ODg4NH0.vtwbwq7iahAIHCd3Y8afZIGBsZZxXz2fHsS6wJDAgwo';

// Creamos el cliente directamente para evitar problemas con la importación
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Función para asegurar que la tabla de inscripcions existe
 * 
 * Esta función utiliza un cliente Supabase con credenciales definidas directamente
 * para evitar problemas de inicialización en diferentes entornos.
 */
export async function configurarTablaInscripcions() {
  try {
    console.log('Verificando tabla de inscripcions...');
    
    // Verificar si la tabla existe intentando hacer una consulta simple
    const { error: tableCheckError } = await supabase
      .from('inscripcions')
      .select('count()', { count: 'exact' })
      .limit(1);
    
    // Si la tabla no existe, crearla
    if (tableCheckError && tableCheckError.code === '42P01') { // código para "tabla no existe"
      console.log('La tabla inscripcions no existe, creándola...');
      
      // Ejecutar RPC para crear la tabla
      const { error: createTableError } = await supabase.rpc('create_inscripcions_table');
      
      if (createTableError) {
        console.error('Error al crear tabla inscripcions mediante RPC:', createTableError);
        return false;
      } else {
        console.log('Tabla inscripcions creada correctamente');
        return true;
      }
    } else {
      console.log('Tabla inscripcions ya existe');
      return true;
    }
  } catch (error) {
    console.error('Error al configurar tabla inscripcions:', error);
    return false;
  }
}
