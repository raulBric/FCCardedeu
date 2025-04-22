import { Jugador, JugadorDTO, JugadorEquip } from '../models/Jugador';

// Interfaz que define las operaciones permitidas sobre los jugadores
export interface JugadorRepository {
  getAll(): Promise<Jugador[]>;
  getById(id: number): Promise<Jugador | null>;
  getByEquipo(equipoId: number, temporada?: string): Promise<Jugador[]>;
  create(jugador: JugadorDTO): Promise<Jugador>;
  update(id: number, jugador: JugadorDTO): Promise<Jugador>;
  delete(id: number): Promise<void>;
  
  // Relaciones con equipos
  asignarEquipo(jugadorId: number, equipoId: number, temporada: string, dorsal?: string, posicio?: string): Promise<JugadorEquip>;
  removerDeEquipo(jugadorId: number, equipoId: number, temporada: string): Promise<void>;
  getEquipos(jugadorId: number): Promise<JugadorEquip[]>;
}
