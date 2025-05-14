import { supabase } from './supabaseClient';
import { subirArchivo, subirImagenNoticia, obtenerUrlPublicaImagen } from '@/adapters/ServiceAdapters';

/**
 * Sube un archivo a Supabase Storage y devuelve la URL pública
 * @param bucket Nombre del bucket en Supabase Storage
 * @param filePath Ruta donde se almacenará el archivo (incluyendo nombre)
 * @param file Archivo a subir
 * @returns URL pública del archivo subido
 */
export async function uploadFile(bucket: string, filePath: string, file: File): Promise<string> {
  try {
    // Validar archivo
    if (!file) {
      throw new Error('No s\'ha proporcionat cap fitxer');
    }
    
    // Usar el adaptador existente para subir el archivo
    const path = await subirArchivo(bucket, filePath, file);
    
    // Obtener URL pública
    const publicUrl = obtenerUrlPublicaImagen(path);
    if (!publicUrl) {
      throw new Error('No s\'ha pogut obtenir la URL pública del fitxer');
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Error en pujar el fitxer:', error);
    throw error;
  }
}

/**
 * Elimina un archivo de Supabase Storage
 * @param bucket Nombre del bucket en Supabase Storage
 * @param filePath Ruta del archivo a eliminar
 */
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
      
    if (error) {
      console.error('Error al eliminar el archivo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error en la eliminación del archivo:', error);
    throw error;
  }
}

/**
 * Genera un nombre único para un archivo basado en su nombre original
 * @param originalFileName Nombre original del archivo
 * @returns Nombre único para el archivo
 */
export function generateUniqueFileName(originalFileName: string): string {
  const fileExt = originalFileName.split('.').pop();
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return `${uniqueId}.${fileExt}`;
}
