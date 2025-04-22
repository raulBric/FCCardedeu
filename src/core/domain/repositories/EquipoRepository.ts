import { Equipo, EquipoDTO } from '../models/Equipo';

// Interfaz que define las operaciones permitidas sobre los equipos
export interface EquipoRepository {
  getAll(): Promise<Equipo[]>;
  getById(id: number): Promise<Equipo | null>;
  getByTemporada(temporada: string): Promise<Equipo[]>;
  create(equipo: EquipoDTO): Promise<Equipo>;
  update(id: number, equipo: EquipoDTO): Promise<Equipo>;
  delete(id: number): Promise<void>;
}
