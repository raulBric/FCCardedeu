import { Jugador, JugadorDTO, JugadorEquip } from '../../domain/models/Jugador';
import { JugadorRepository } from '../../domain/repositories/JugadorRepository';

export class JugadorService {
  constructor(private jugadorRepository: JugadorRepository) {}

  // Obtener todos los jugadores
  async getJugadores(): Promise<Jugador[]> {
    return this.jugadorRepository.getAll();
  }

  // Obtener jugadores por equipo y temporada
  async getJugadoresByEquipo(equipoId: number, temporada: string = '2024-2025'): Promise<Jugador[]> {
    return this.jugadorRepository.getByEquipo(equipoId, temporada);
  }

  // Obtener un jugador por su ID
  async getJugadorById(id: number): Promise<Jugador | null> {
    return this.jugadorRepository.getById(id);
  }

  // Crear un nuevo jugador
  async createJugador(data: JugadorDTO): Promise<Jugador> {
    return this.jugadorRepository.create(data);
  }

  // Actualizar un jugador existente
  async updateJugador(id: number, data: JugadorDTO): Promise<Jugador> {
    return this.jugadorRepository.update(id, data);
  }

  // Eliminar un jugador
  async deleteJugador(id: number): Promise<void> {
    return this.jugadorRepository.delete(id);
  }

  // Asignar un jugador a un equipo
  async asignarEquipo(
    jugadorId: number, 
    equipoId: number, 
    temporada: string = '2024-2025',
    dorsal?: string,
    posicio?: string
  ): Promise<JugadorEquip> {
    return this.jugadorRepository.asignarEquipo(jugadorId, equipoId, temporada, dorsal, posicio);
  }

  // Remover un jugador de un equipo
  async removerDeEquipo(
    jugadorId: number, 
    equipoId: number, 
    temporada: string = '2024-2025'
  ): Promise<void> {
    return this.jugadorRepository.removerDeEquipo(jugadorId, equipoId, temporada);
  }

  // Obtener los equipos de un jugador
  async getEquiposDeJugador(jugadorId: number): Promise<JugadorEquip[]> {
    return this.jugadorRepository.getEquipos(jugadorId);
  }
}
