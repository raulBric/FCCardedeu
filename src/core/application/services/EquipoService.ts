import { Equipo, EquipoDTO } from '../../domain/models/Equipo';
import { EquipoRepository } from '../../domain/repositories/EquipoRepository';

export class EquipoService {
  constructor(private equipoRepository: EquipoRepository) {}

  // Obtener todos los equipos
  async getEquipos(): Promise<Equipo[]> {
    return this.equipoRepository.getAll();
  }

  // Obtener equipos por temporada
  async getEquiposByTemporada(temporada: string = '2024-2025'): Promise<Equipo[]> {
    return this.equipoRepository.getByTemporada(temporada);
  }

  // Obtener un equipo por su ID
  async getEquipoById(id: number): Promise<Equipo | null> {
    return this.equipoRepository.getById(id);
  }

  // Crear un nuevo equipo
  async createEquipo(data: EquipoDTO): Promise<Equipo> {
    // Asegurar que tiene una temporada asignada
    const equipo: EquipoDTO = {
      ...data,
      temporada: data.temporada || '2024-2025'
    };
    
    return this.equipoRepository.create(equipo);
  }

  // Actualizar un equipo existente
  async updateEquipo(id: number, data: EquipoDTO): Promise<Equipo> {
    return this.equipoRepository.update(id, data);
  }

  // Eliminar un equipo
  async deleteEquipo(id: number): Promise<void> {
    return this.equipoRepository.delete(id);
  }
}
