import { Inscripcion, CreateInscripcionDTO, UpdateInscripcionEstadoDTO } from '../../domain/models/Inscripcion';
import { InscripcionRepository } from '../../domain/repositories/InscripcionRepository';

export class InscripcionService {
  constructor(private inscripcionRepository: InscripcionRepository) {}

  // Obtener todas las inscripciones
  async getInscripciones(): Promise<Inscripcion[]> {
    return this.inscripcionRepository.getAll();
  }

  // Obtener inscripciones pendientes
  async getInscripcionesPendientes(): Promise<Inscripcion[]> {
    return this.inscripcionRepository.getPendientes();
  }

  // Obtener una inscripción por su ID
  async getInscripcionById(id: number): Promise<Inscripcion | null> {
    return this.inscripcionRepository.getById(id);
  }

  // Crear una nueva inscripción
  async createInscripcion(data: CreateInscripcionDTO): Promise<Inscripcion> {
    // Transformar el DTO al formato de la entidad
    const inscripcion: Omit<Inscripcion, 'id'> = {
      player_name: data.playerName,
      birth_date: data.birthDate,
      player_dni: data.playerDNI,
      health_card: data.healthCard,
      team: data.team,
      parent_name: data.parentName,
      contact_phone1: data.contactPhone1,
      contact_phone2: data.contactPhone2,
      alt_contact: data.altContact,
      email1: data.email1,
      email2: data.email2,
      address: data.address,
      city: data.city,
      postal_code: data.postalCode,
      school: data.school,
      shirt_size: data.shirtSize,
      siblings_in_club: data.siblingsInClub,
      seasons_in_club: data.seasonsInClub,
      bank_account: data.bankAccount,
      comments: data.comments,
      accept_terms: data.acceptTerms,
      estado: 'pendiente',
      temporada: '2024-2025'
    };
    
    return this.inscripcionRepository.create(inscripcion);
  }

  // Actualizar el estado de una inscripción
  async actualizarEstadoInscripcion(data: UpdateInscripcionEstadoDTO): Promise<Inscripcion> {
    return this.inscripcionRepository.updateEstado(data);
  }

  // Eliminar una inscripción
  async deleteInscripcion(id: number): Promise<void> {
    return this.inscripcionRepository.delete(id);
  }
}
