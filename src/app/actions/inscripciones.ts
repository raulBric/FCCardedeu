'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabaseServerClient';
import { generateFormToken, verifyFormToken, setSecureCookie, getSecureCookie } from '@/lib/crypto';

// Interfaces para tipar los datos de inscripción
interface InscripcionPaso1 {
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  dni: string;
  email1: string;
  telefono1: string;
}

interface InscripcionPaso2 {
  direccion: string;
  codigo_postal: string;
  poblacion: string;
  categoria: string;
  foto_jugador?: File;
}

interface InscripcionCompleta extends InscripcionPaso1, InscripcionPaso2 {
  fecha_inscripcion: string;
  estado: 'pendiente' | 'procesando' | 'completada' | 'rechazada';
}

/**
 * Guarda el primer paso del formulario de inscripción y genera un token seguro
 */
export async function guardarPaso1(formData: FormData) {
  try {
    // Extraer y validar datos
    const datosPaso1: InscripcionPaso1 = {
      nombre: formData.get('nombre') as string,
      apellidos: formData.get('apellidos') as string,
      fecha_nacimiento: formData.get('fecha_nacimiento') as string,
      dni: formData.get('dni') as string,
      email1: formData.get('email1') as string,
      telefono1: formData.get('telefono1') as string,
    };

    // Validación básica
    if (!datosPaso1.nombre || !datosPaso1.apellidos || !datosPaso1.email1) {
      return { success: false, error: 'Faltan campos obligatorios' };
    }

    // Crear token JWT con los datos (válido por 2 horas)
    const token = generateFormToken(datosPaso1, '2h');
    
    // Guardar en cookie segura
    setSecureCookie(cookies(), 'inscripcion_token', token, 7200); // 2 horas
    
    return { success: true, paso: 1 };
  } catch (error) {
    console.error('Error al guardar paso 1:', error);
    return { success: false, error: 'Error al procesar el formulario' };
  }
}

/**
 * Guarda el segundo paso y completa la inscripción
 */
export async function guardarPaso2(formData: FormData) {
  try {
    // Recuperar datos del paso 1
    const token = getSecureCookie(cookies(), 'inscripcion_token');
    if (!token) {
      return { success: false, error: 'Sesión expirada. Por favor, vuelve a comenzar el proceso.' };
    }
    
    // Verificar y extraer datos del token
    const datosPaso1 = verifyFormToken(token) as InscripcionPaso1;
    if (!datosPaso1) {
      return { success: false, error: 'Datos inválidos. Por favor, vuelve a comenzar el proceso.' };
    }
    
    // Extraer datos del paso 2
    const datosPaso2: InscripcionPaso2 = {
      direccion: formData.get('direccion') as string,
      codigo_postal: formData.get('codigo_postal') as string,
      poblacion: formData.get('poblacion') as string,
      categoria: formData.get('categoria') as string,
      // La foto se manejará aparte
    };
    
    // Combinar datos
    const inscripcionCompleta: InscripcionCompleta = {
      ...datosPaso1,
      ...datosPaso2,
      fecha_inscripcion: new Date().toISOString(),
      estado: 'pendiente'
    };
    
    // Guardar en Supabase
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('inscripcions')
      .insert(inscripcionCompleta)
      .select()
      .single();
    
    if (error) {
      console.error('Error al guardar inscripción:', error);
      return { success: false, error: 'Error al guardar los datos en el servidor' };
    }

    // Si hay foto, procesarla
    const foto = formData.get('foto_jugador') as File;
    if (foto && data.id) {
      // Generar nombre único para la foto
      const extension = foto.name.split('.').pop();
      const fotoPath = `inscripciones/${data.id}/${data.id}_foto.${extension}`;
      
      // Convertir File a ArrayBuffer
      const buffer = await foto.arrayBuffer();
      
      // Subir a Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('jugadores')
        .upload(fotoPath, buffer, {
          contentType: foto.type,
          upsert: true
        });
      
      if (uploadError) {
        console.error('Error al subir foto:', uploadError);
        // No fallamos todo el proceso, solo loggeamos el error
      } else {
        // Actualizar registro con la URL de la foto
        await supabase
          .from('inscripcions')
          .update({ foto_url: fotoPath })
          .eq('id', data.id);
      }
    }
    
    // Limpiar la cookie
    // cookies().delete('inscripcion_token');
    
    return { success: true, inscripcionId: data.id };
  } catch (error) {
    console.error('Error al completar inscripción:', error);
    return { success: false, error: 'Error al procesar el formulario' };
  }
}

/**
 * Recupera los datos guardados en el paso 1 (para continuar en paso 2)
 */
export async function recuperarDatosPaso1() {
  try {
    const token = getSecureCookie(cookies(), 'inscripcion_token');
    if (!token) return null;
    
    return verifyFormToken(token);
  } catch (error) {
    console.error('Error al recuperar datos:', error);
    return null;
  }
}

/**
 * Actualiza el estado de una inscripción
 */
export async function actualizarEstadoInscripcion(id: string, estado: 'pendiente' | 'procesando' | 'completada' | 'rechazada') {
  const supabase = createServerSupabaseClient();
  
  try {
    const { error } = await supabase
      .from('inscripcions')
      .update({ estado })
      .eq('id', id);
    
    if (error) {
      console.error('Error al actualizar estado:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error inesperado:', error);
    return { success: false, error: 'Error al procesar la solicitud' };
  }
}
