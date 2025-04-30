// Simple store para almacenar la inscripción seleccionada entre páginas
// Solución para el problema de RLS en la vista de detalle

import { Inscripcion } from '@/app/dashboard/inscripciones/[id]/page';

let inscripcionSeleccionada: Inscripcion | null = null;

export const guardarInscripcion = (inscripcion: Inscripcion): void => {
  inscripcionSeleccionada = inscripcion;
  
  // Opcionalmente guardar en sessionStorage para persistir en recargas
  try {
    sessionStorage.setItem('inscripcionSeleccionada', JSON.stringify(inscripcion));
  } catch (error) {
    console.error('Error al guardar en sessionStorage:', error);
  }
};

export const obtenerInscripcion = (): Inscripcion | null => {
  // Si ya tenemos una inscripción en memoria, la devolvemos
  if (inscripcionSeleccionada) {
    return inscripcionSeleccionada;
  }
  
  // Intentar recuperar de sessionStorage
  try {
    const stored = sessionStorage.getItem('inscripcionSeleccionada');
    if (stored) {
      inscripcionSeleccionada = JSON.parse(stored);
      return inscripcionSeleccionada;
    }
  } catch (error) {
    console.error('Error al recuperar de sessionStorage:', error);
  }
  
  return null;
};

export const limpiarInscripcion = (): void => {
  inscripcionSeleccionada = null;
  try {
    sessionStorage.removeItem('inscripcionSeleccionada');
  } catch (error) {
    console.error('Error al limpiar sessionStorage:', error);
  }
};
