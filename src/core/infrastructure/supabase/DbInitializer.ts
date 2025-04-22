import { supabase } from '@/lib/supabaseClient';

/**
 * Clase para inicializar y configurar recursos de Supabase
 * Sigue el patrón de clean architecture al situar esta lógica en la capa de infraestructura
 */
export class DbInitializer {
  /**
   * Inicializa todas las tablas y recursos necesarios
   * @returns Promise<boolean> - true si todas las inicializaciones fueron exitosas
   */
  public static async initializeAll(): Promise<boolean> {
    try {
      // Inicializar tablas principales
      const inscripcionesOk = await this.initializeInscripcionesTable();
      const noticiasOk = await this.initializeNoticiasTable();
      
      // Inicializar buckets
      const bucketOk = await this.initializeStorageBuckets();
      
      return inscripcionesOk && noticiasOk && bucketOk;
    } catch (error) {
      console.error('Error al inicializar recursos:', error);
      return false;
    }
  }

  /**
   * Inicializa la tabla de inscripciones
   */
  public static async initializeInscripcionesTable(): Promise<boolean> {
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

  /**
   * Inicializa la tabla de noticias
   */
  public static async initializeNoticiasTable(): Promise<boolean> {
    try {
      console.log('Verificando tabla de noticias...');
      
      // Verificar si la tabla existe intentando hacer una consulta simple
      const { error: tableCheckError } = await supabase
        .from('noticias')
        .select('count()', { count: 'exact' })
        .limit(1);
      
      // Si la tabla no existe, crearla
      if (tableCheckError && tableCheckError.code === '42P01') { // código para "tabla no existe"
        console.log('La tabla noticias no existe, creándola...');
        
        // Ejecutar RPC para crear la tabla
        const { error: createTableError } = await supabase.rpc('create_noticias_table');
        
        if (createTableError) {
          console.error('Error al crear tabla noticias mediante RPC:', createTableError);
          
          // Intento alternativo: crear la tabla directamente con SQL
          const sqlCreate = `
            CREATE TABLE IF NOT EXISTS public.noticias (
              id SERIAL PRIMARY KEY,
              titulo TEXT NOT NULL,
              contenido TEXT NOT NULL,
              fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
              imagen_url TEXT,
              autor TEXT,
              categoria TEXT,
              destacada BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `;
          
          // Esta llamada podría fallar si no hay permisos para ejecutar SQL directo
          try {
            await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
              },
              body: JSON.stringify({ query: sqlCreate })
            });
            console.log('Intento alternativo de crear tabla noticias');
            return true;
          } catch (sqlError) {
            console.error('Error en intento alternativo:', sqlError);
            return false;
          }
        } else {
          console.log('Tabla noticias creada correctamente');
          return true;
        }
      } else {
        console.log('Tabla noticias ya existe');
        return true;
      }
    } catch (error) {
      console.error('Error al configurar tabla noticias:', error);
      return false;
    }
  }

  /**
   * Inicializa los buckets de almacenamiento
   */
  public static async initializeStorageBuckets(): Promise<boolean> {
    try {
      console.log('Iniciando configuración de buckets de almacenamiento...');
      const bucketsToCreate = ['noticies', 'jugadores', 'entrenadores', 'equipos'];
      let allSuccessful = true;
      
      // Obtener lista de buckets existentes
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error al listar buckets:', listError);
        return false;
      }
      
      // Crear o actualizar cada bucket
      for (const bucketName of bucketsToCreate) {
        const bucketExists = buckets?.find(b => b.name === bucketName);
        
        if (!bucketExists) {
          // Crear bucket
          const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });
          
          if (createError) {
            console.error(`Error al crear bucket ${bucketName}:`, createError);
            allSuccessful = false;
          } else {
            console.log(`Bucket ${bucketName} creado correctamente`);
          }
        } else {
          // Actualizar a público
          const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
            public: true,
          });
          
          if (updateError) {
            console.error(`Error al actualizar bucket ${bucketName}:`, updateError);
            allSuccessful = false;
          } else {
            console.log(`Bucket ${bucketName} actualizado correctamente`);
          }
        }
      }
      
      return allSuccessful;
    } catch (error) {
      console.error('Error al configurar buckets:', error);
      return false;
    }
  }
}
