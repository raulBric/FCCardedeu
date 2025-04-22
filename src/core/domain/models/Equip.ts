/**
 * Modelo de dominio para Equip (alias para Equipo)
 * Este es un modelo auxiliar para mantener compatibilidad
 * con nombres en catalán mientras migramos a una arquitectura limpia
 */

import { Equipo } from './Equipo';

// Equip es simplemente un alias para Equipo
export type Equip = Equipo;

// Exportamos también los tipos DTO para mantener consistencia
export type { EquipoDTO as EquipDTO } from './Equipo';
