import { Patrocinador, CreatePatrocinadorDTO, UpdatePatrocinadorDTO } from '@/core/domain/models/Patrocinador';

/**
 * Interfaz para el repositorio de patrocinadores
 */
export interface IPatrocinadorRepository {
  /**
   * Obtiene todos los patrocinadores
   */
  getAll(limit?: number, page?: number): Promise<Patrocinador[]>;

  /**
   * Obtiene un patrocinador por su ID
   */
  getById(id: number): Promise<Patrocinador | null>;

  /**
   * Crea un nuevo patrocinador
   */
  create(patrocinador: CreatePatrocinadorDTO): Promise<Patrocinador>;

  /**
   * Actualiza un patrocinador existente
   */
  update(id: number, patrocinador: UpdatePatrocinadorDTO): Promise<Patrocinador>;

  /**
   * Elimina un patrocinador
   */
  delete(id: number): Promise<void>;
}
