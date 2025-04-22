import { Resultado, CreateResultadoDTO, UpdateResultadoDTO } from '../models/Resultado';

export interface ResultadoRepository {
  getAll(limit?: number, page?: number): Promise<Resultado[]>;
  getById(id: number): Promise<Resultado | null>;
  create(data: CreateResultadoDTO): Promise<Resultado>;
  update(id: number, data: UpdateResultadoDTO): Promise<Resultado>;
  delete(id: number): Promise<void>;
}
