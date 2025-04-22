// Define la entidad Equipo
export interface Equipo {
  id?: number;
  nom: string;
  categoria: string;
  temporada: string;
  entrenador?: string;
  delegat?: string;
  imatge_url?: string;
  descripcio?: string;
  created_at?: string;
  updated_at?: string;
}

// DTO para crear o actualizar un equipo
export interface EquipoDTO {
  nom: string;
  categoria: string;
  temporada?: string;
  entrenador?: string;
  delegat?: string;
  imatge_url?: string;
  descripcio?: string;
}
