/**
 * Modelo de dominio para Patrocinador
 */

export interface Patrocinador {
  id?: number;
  nombre: string;
  logo_url?: string;
  url?: string;
  descripcion?: string;
  nivel: 'oro' | 'plata' | 'bronce';
  temporada: string;
  tipo?: string; // Añadido para compatibilidad con componentes existentes
  activo?: boolean; // Añadido para compatibilidad con componentes existentes
  created_at?: string;
  updated_at?: string;
}

export interface CreatePatrocinadorDTO {
  nombre: string;
  logo_url?: string;
  url?: string;
  descripcion?: string;
  nivel: 'oro' | 'plata' | 'bronce';
  temporada: string;
}

export interface UpdatePatrocinadorDTO {
  nombre?: string;
  logo_url?: string;
  url?: string;
  descripcion?: string;
  nivel?: 'oro' | 'plata' | 'bronce';
  temporada?: string;
}
