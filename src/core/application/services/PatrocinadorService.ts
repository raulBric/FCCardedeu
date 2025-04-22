import { Patrocinador, CreatePatrocinadorDTO, UpdatePatrocinadorDTO } from '@/core/domain/models/Patrocinador';
import { IPatrocinadorRepository } from '@/core/domain/repositories/IPatrocinadorRepository';

/**
 * Servicio para gestionar patrocinadores
 */
export class PatrocinadorService {
  private repository: IPatrocinadorRepository;

  constructor(repository: IPatrocinadorRepository) {
    this.repository = repository;
  }

  /**
   * Obtiene todos los patrocinadores
   */
  async getPatrocinadores(limit?: number, page?: number): Promise<Patrocinador[]> {
    return this.repository.getAll(limit, page);
  }

  /**
   * Obtiene un patrocinador por su ID
   */
  async getPatrocinadorById(id: number): Promise<Patrocinador | null> {
    return this.repository.getById(id);
  }

  /**
   * Crea un nuevo patrocinador
   */
  async createPatrocinador(patrocinador: CreatePatrocinadorDTO): Promise<Patrocinador> {
    return this.repository.create(patrocinador);
  }

  /**
   * Actualiza un patrocinador existente
   */
  async updatePatrocinador(id: number, patrocinador: UpdatePatrocinadorDTO): Promise<Patrocinador> {
    return this.repository.update(id, patrocinador);
  }

  /**
   * Elimina un patrocinador
   */
  async deletePatrocinador(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
