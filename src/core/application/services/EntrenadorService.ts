import { Entrenador, EntrenadorDTO, EntrenadorEquip } from '../../domain/models/Entrenador';
import { EntrenadorRepository } from '../../domain/repositories/EntrenadorRepository';

export class EntrenadorService {
  constructor(private entrenadorRepository: EntrenadorRepository) {}

  // Obtener todos los entrenadores
  async getEntrenadores(): Promise<Entrenador[]> {
    return this.entrenadorRepository.getAll();
  }

  // Obtener entrenadores por equipo
  async getEntrenadoresByEquipo(equipoId: number, temporada: string = '2024-2025'): Promise<Entrenador[]> {
    return this.entrenadorRepository.getByEquipo(equipoId, temporada);
  }

  // Obtener un entrenador por su ID
  async getEntrenadorById(id: number): Promise<Entrenador | null> {
    return this.entrenadorRepository.getById(id);
  }

  // Crear un nuevo entrenador
  async createEntrenador(data: EntrenadorDTO): Promise<Entrenador> {
    return this.entrenadorRepository.create(data);
  }

  // Actualizar un entrenador existente
  async updateEntrenador(id: number, data: EntrenadorDTO): Promise<Entrenador> {
    return this.entrenadorRepository.update(id, data);
  }

  // Eliminar un entrenador
  async deleteEntrenador(id: number): Promise<void> {
    return this.entrenadorRepository.delete(id);
  }

  // Asignar un entrenador a un equipo
  async asignarEquipo(
    entrenadorId: number, 
    equipoId: number, 
    rol: 'principal' | 'segon' | 'tercer' | 'delegat',
    temporada: string = '2024-2025'
  ): Promise<EntrenadorEquip> {
    return this.entrenadorRepository.asignarEquipo(entrenadorId, equipoId, rol, temporada);
  }

  // Remover un entrenador de un equipo
  async removerDeEquipo(
    entrenadorId: number, 
    equipoId: number, 
    temporada: string = '2024-2025'
  ): Promise<void> {
    return this.entrenadorRepository.removerDeEquipo(entrenadorId, equipoId, temporada);
  }

  // Obtener los equipos de un entrenador
  async getEquiposDeEntrenador(entrenadorId: number): Promise<EntrenadorEquip[]> {
    return this.entrenadorRepository.getEquipos(entrenadorId);
  }
}
