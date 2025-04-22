/**
 * @deprecated Este archivo está obsoleto y será eliminado en futuras versiones.
 * Utiliza los adaptadores y servicios de la nueva arquitectura limpia en su lugar.
 * 
 * Este archivo ahora solo redirige a los adaptadores para mantener compatibilidad.
 */

// Importar desde los adaptadores
import type { Entrenador } from '@/adapters/ServiceAdapters';
import {
  // Funciones de servicio
  obtenerEntrenadors, obtenerEntrenador, crearEntrenador, actualizarEntrenador, eliminarEntrenador,
  obtenerAsignacionesEntrenador, asignarEntrenadorAEquip
} from '@/adapters/ServiceAdapters';

// Re-exportar para mantener compatibilidad
export type { Entrenador };

export {
  // Funciones de servicio
  obtenerEntrenadors, obtenerEntrenador, crearEntrenador, actualizarEntrenador, eliminarEntrenador,
  obtenerAsignacionesEntrenador, asignarEntrenadorAEquip
};

/**
 * IMPORTANTE: Este es un archivo de transición y se debe marcar como @deprecated.
 * A medida que los componentes se migran a usar directamente ServiceFactory,
 * este archivo debe eliminarse.
 */
