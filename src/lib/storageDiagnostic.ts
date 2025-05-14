import { supabase } from './supabaseClient';

/**
 * Funció de diagnòstic per verificar si podem realitzar operacions amb el bucket
 * @param bucketName Nom del bucket a verificar
 * @returns Resultat del diagnòstic
 */
export async function verificarBucket(bucketName: string): Promise<{
  success: boolean;
  details: {
    bucketExists: boolean;
    bucketsListed: string[];
    canList: boolean;
    authConfigured: boolean;
  };
  error?: any;
}> {
  try {
    console.log(`🔍 Iniciant diagnòstic per bucket "${bucketName}"...`);
    
    // 1. Verificar si les claus de Supabase estan configurades
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const authConfigured = !!supabaseUrl && !!supabaseKey;
    console.log(`✓ Configuració d'autenticació: ${authConfigured ? 'OK' : 'FALTA'}`);
    
    if (!authConfigured) {
      return { 
        success: false, 
        details: {
          bucketExists: false,
          bucketsListed: [],
          canList: false,
          authConfigured: false
        },
        error: 'Claus de Supabase no configurades'
      };
    }
    
    // 2. No podemos listar buckets (requiere admin), asumimos que existe
    console.log(`⚠️ No es poden llistar buckets (requereix permisos d'administrador)`);
    console.log(`✓ Assumint que el bucket "${bucketName}" existeix`);
    
    // 3. Intentamos verificar si existe el bucket intentando listar su contenido
    console.log(`📋 Verificant accés al bucket "${bucketName}"...`);
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 }); // Solo intentamos listar 1 archivo
    
    // Si no da error al listar, asumimos que el bucket existe
    const bucketExists = !listError;
    console.log(`✓ Bucket "${bucketName}": ${bucketExists ? 'Accessible' : 'No accessible'}`);
    
    if (listError) {
      console.error(`❌ Error al accedir al bucket "${bucketName}":`, listError);
    } else {
      console.log(`✓ Fitxers trobats: ${files?.length || 0}`);
    }
    
    return {
      success: bucketExists,
      details: {
        bucketExists,
        bucketsListed: bucketExists ? [bucketName] : [],
        canList: bucketExists, 
        authConfigured
      },
      error: listError
    };
  } catch (error) {
    console.error('❌ Error en diagnòstic d\'emmagatzematge:', error);
    return {
      success: false,
      details: {
        bucketExists: false,
        bucketsListed: [],
        canList: false,
        authConfigured: false
      },
      error
    };
  }
}

/**
 * Intenta pujar un fitxer de prova al bucket especificat
 * @param bucketName Nom del bucket
 * @returns Resultat de la prova
 */
export async function probarSubidaArchivo(bucketName: string): Promise<{
  success: boolean;
  filePath?: string;
  publicUrl?: string;
  error?: any;
}> {
  try {
    console.log(`💼 Iniciant prova de pujada a "${bucketName}"...`);
    
    // Crear un petit fitxer de text per a la prova
    const testContent = 'Fitxer de prova generat el ' + new Date().toISOString();
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test_upload.txt', { type: 'text/plain' });
    
    // Generar un path únic per al fitxer de prova
    const testPath = `test_${Date.now()}.txt`;
    
    console.log(`📝 Fitxer de prova: ${testPath}`);
    
    // Intentar pujar el fitxer
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testPath, testFile, {
        cacheControl: '3600',
        upsert: true // Permetre sobrescriure
      });
    
    if (uploadError) {
      console.error(`❌ Error al pujar fitxer de prova:`, uploadError);
      return { success: false, error: uploadError };
    }
    
    console.log(`✓ Fitxer pujat amb èxit:`, data);
    
    // Obtenir URL pública
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(data?.path || testPath);
    
    return {
      success: true,
      filePath: data?.path || testPath,
      publicUrl
    };
  } catch (error) {
    console.error('❌ Error en prova de pujada:', error);
    return { success: false, error };
  }
}

/**
 * Funció per verificar els permisos RLS del bucket
 * @param bucketName Nom del bucket
 * @returns Estat dels permisos
 */
export async function verificarPermisosRLS(bucketName: string): Promise<{
  success: boolean;
  details: {
    hasPublicPolicy: boolean;
    policies: any[];
  };
  error?: any;
}> {
  try {
    console.log(`🔐 Verificant permisos per "${bucketName}"...`);
    
    // No podem verificar les polítiques RLS directament sense permisos d'administrador
    // Fem una prova pràctica per comprovar els permisos
    
    // 1. Primer intentem obtenir la URL pública d'un fitxer hipotètic
    const testPath = `test_access_${Date.now()}.txt`;
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(testPath);
      
    console.log(`✓ URL pública disponible: ${urlData.publicUrl ? 'Sí' : 'No'}`);
    
    // 2. Intentar llistar un fitxer per verificar els permisos de lectura
    console.log(`📋 Comprovant permisos de lectura...`);
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });
      
    if (listError) {
      console.error(`❌ No es poden llistar fitxers a "${bucketName}":`, listError);
      return {
        success: false,
        details: {
          hasPublicPolicy: false,
          policies: []
        },
        error: listError
      };
    }
    
    console.log(`✓ Permisos de lectura OK. Fitxers trobats: ${files?.length || 0}`);
    
    return {
      success: true,
      details: {
        hasPublicPolicy: true,
        policies: [{
          type: 'read',
          status: 'allowed'
        }]
      }
    };
  } catch (error) {
    console.error('❌ Error al verificar permisos:', error);
    return {
      success: false,
      details: {
        hasPublicPolicy: false,
        policies: []
      },
      error
    };
  }
}
