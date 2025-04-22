import { Noticia, CreateNoticiaDTO, UpdateNoticiaDTO } from '../models/Noticia';

export interface NoticiaRepository {
  getAll(limit?: number, page?: number): Promise<Noticia[]>;
  getDestacadas(limit?: number): Promise<Noticia[]>;
  getById(id: number): Promise<Noticia | null>;
  create(data: CreateNoticiaDTO): Promise<Noticia>;
  update(id: number, data: UpdateNoticiaDTO): Promise<Noticia>;
  delete(id: number): Promise<void>;
}
