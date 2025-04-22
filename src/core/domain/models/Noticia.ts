export interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string; // ISO
  imagen_url?: string;
  autor?: string;
  categoria?: string;
  destacada: boolean;
  created_at?: string;
  updated_at?: string;
}

// DTO para crear noticia
export interface CreateNoticiaDTO {
  titulo: string;
  contenido: string;
  fecha?: string; // opcional, se puede auto‑generar
  imagen_url?: string;
  autor?: string;
  categoria?: string;
  destacada?: boolean;
}

// DTO para actualizar
export type UpdateNoticiaDTO = Partial<Omit<Noticia, 'id'>>;
