import { Inscripcion, UpdateInscripcionEstadoDTO } from '../models/Inscripcion';

// Interfaz que define las operaciones permitidas sobre las inscripciones
export interface InscripcionRepository {
  getAll(): Promise<Inscripcion[]>;
  getById(id: number): Promise<Inscripcion | null>;
  create(inscripcion: Omit<Inscripcion, 'id'>): Promise<Inscripcion>;
  updateEstado(data: UpdateInscripcionEstadoDTO): Promise<Inscripcion>;
  delete(id: number): Promise<void>;
  getPendientes(): Promise<Inscripcion[]>;
}
