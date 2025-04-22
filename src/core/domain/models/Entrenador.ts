// Define la entidad Entrenador
export interface Entrenador {
  id?: number;
  nom: string;
  cognom: string;
  tipus: 'principal' | 'segon' | 'tercer' | 'delegat';
  telefon?: string;
  email?: string;
  titulacio?: string;
  observacions?: string;
  created_at?: string;
  updated_at?: string;
}

// DTO para crear o actualizar un entrenador
export interface EntrenadorDTO {
  nom: string;
  cognom: string;
  tipus: 'principal' | 'segon' | 'tercer' | 'delegat';
  telefon?: string;
  email?: string;
  titulacio?: string;
  observacions?: string;
}

// Relación entrenador-equipo
export interface EntrenadorEquip {
  id?: number;
  entrenador_id: number;
  equip_id: number;
  rol: 'principal' | 'segon' | 'tercer' | 'delegat';
  temporada: string;
  created_at?: string;
  // Campos para el join con equipo
  equip?: {
    id: number;
    nom: string;
    categoria: string;
    temporada: string;
  };
  // Campo auxiliar para facilitar el acceso al nombre del equipo
  equipo_nombre?: string;
}
