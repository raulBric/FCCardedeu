// Define la entidad Jugador
export interface Jugador {
  id?: number;
  nom: string;
  cognoms: string;
  data_naixement?: string;
  dni_nie?: string;
  catsalut?: string;
  telefon?: string;
  telefon_emergencia?: string;
  email?: string;
  direccio?: string;
  codi_postal?: string;
  poblacio?: string;
  categoria?: string;
  posicio?: string;
  observacions_mediques?: string;
  observacions?: string;
  imatge_url?: string;
  estat?: 'actiu' | 'inactiu' | 'baixa';
  created_at?: string;
  updated_at?: string;
}

// DTO para crear o actualizar un jugador
export interface JugadorDTO {
  nom: string;
  cognoms: string;
  data_naixement?: string;
  dni_nie?: string;
  catsalut?: string;
  telefon?: string;
  telefon_emergencia?: string;
  email?: string;
  direccio?: string;
  codi_postal?: string;
  poblacio?: string;
  categoria?: string;
  posicio?: string;
  observacions_mediques?: string;
  observacions?: string;
  imatge_url?: string;
  estat?: 'actiu' | 'inactiu' | 'baixa';
}

// Relación jugador-equipo
export interface JugadorEquip {
  id?: number;
  jugador_id: number;
  equip_id: number;
  dorsal?: string;
  posicio?: string;
  temporada: string;
  created_at?: string;
}
