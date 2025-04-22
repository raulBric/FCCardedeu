import { supabase } from '@/lib/supabaseClient';

// Función para asegurar que la tabla de inscripcions existe
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
