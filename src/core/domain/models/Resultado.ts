export interface Resultado {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local: number;
  goles_visitante: number;
  fecha: string; // ISO
  temporada: string;
  categoria: string;
  completado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateResultadoDTO {
  equipo_local: string;
  equipo_visitante: string;
  goles_local: number;
  goles_visitante: number;
  fecha: string;
  temporada: string;
  categoria: string;
  completado?: boolean;
}

export type UpdateResultadoDTO = Partial<Omit<Resultado, 'id'>>;
