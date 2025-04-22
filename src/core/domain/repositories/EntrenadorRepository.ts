import { Entrenador, EntrenadorDTO, EntrenadorEquip } from '../models/Entrenador';

// Interfaz que define las operaciones permitidas sobre los entrenadores
export interface EntrenadorRepository {
  getAll(): Promise<Entrenador[]>;
  getById(id: number): Promise<Entrenador | null>;
  getByEquipo(equipoId: number, temporada?: string): Promise<Entrenador[]>;
  create(entrenador: EntrenadorDTO): Promise<Entrenador>;
  update(id: number, entrenador: EntrenadorDTO): Promise<Entrenador>;
  delete(id: number): Promise<void>;
  
  // Relaciones con equipos
  asignarEquipo(entrenadorId: number, equipoId: number, rol: 'principal' | 'segon' | 'tercer' | 'delegat', temporada: string): Promise<EntrenadorEquip>;
  removerDeEquipo(entrenadorId: number, equipoId: number, temporada: string): Promise<void>;
  getEquipos(entrenadorId: number): Promise<EntrenadorEquip[]>;
}
