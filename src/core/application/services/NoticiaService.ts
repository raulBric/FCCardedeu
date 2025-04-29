import { NoticiaRepository } from '../../domain/repositories/NoticiaRepository';
import { CreateNoticiaDTO, UpdateNoticiaDTO } from '../../domain/models/Noticia';

export class NoticiaService {
  constructor(private noticiaRepository: NoticiaRepository) {}

  getNoticias(limit = 50, page = 0) {
    return this.noticiaRepository.getAll(limit, page);
  }

  getDestacadas(limit = 4) {
    return this.noticiaRepository.getDestacadas(limit);
  }

  getNoticia(id: number) {
    return this.noticiaRepository.getById(id);
  }

  crearNoticia(dto: CreateNoticiaDTO) {
    return this.noticiaRepository.create(dto);
  }

  actualizarNoticia(id: number, dto: UpdateNoticiaDTO) {
    return this.noticiaRepository.update(id, dto);
  }

  eliminarNoticia(id: number) {
    return this.noticiaRepository.delete(id);
  }
}
