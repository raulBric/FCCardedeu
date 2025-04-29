import { ResultadoRepository } from '../../domain/repositories/ResultadoRepository';
import { CreateResultadoDTO, UpdateResultadoDTO } from '../../domain/models/Resultado';

export class ResultadoService {
  constructor(private resultadoRepository: ResultadoRepository) {}

  getResultados(limit = 50, page = 0) {
    return this.resultadoRepository.getAll(limit, page);
  }

  getResultado(id: number) {
    return this.resultadoRepository.getById(id);
  }

  crearResultado(dto: CreateResultadoDTO) {
    return this.resultadoRepository.create(dto);
  }

  actualizarResultado(id: number, dto: UpdateResultadoDTO) {
    return this.resultadoRepository.update(id, dto);
  }

  eliminarResultado(id: number) {
    return this.resultadoRepository.delete(id);
  }
}
