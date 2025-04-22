/**
 * @deprecated Este archivo está obsoleto y será eliminado en futuras versiones.
 * Utiliza los adaptadores y servicios de la nueva arquitectura limpia en su lugar.
 * 
 * Este archivo ahora solo redirige a los adaptadores para mantener compatibilidad.
 */

// Importar obtenerJugadors para renombrarlo a obtenerJugadores (compatibilidad con componentes existentes)
import { obtenerJugadors } from '@/adapters/ServiceAdapters';

// Re-exportar obtenerJugadors con el nombre obtenerJugadores para componentes que usan el nombre en castellano
export const obtenerJugadores = obtenerJugadors;

// Re-exportar todos los demás tipos y funciones desde ServiceAdapters
export * from '@/adapters/ServiceAdapters';
