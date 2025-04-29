import { InscripcionService } from '@/core/application/services/InscripcionService';
import { Inscripcion, UpdateInscripcionEstadoDTO, PaymentInfo } from '@/core/domain/models/Inscripcion';

describe('InscripcionService', () => {
  // Crear un mock del repositorio con todos los métodos necesarios
  const mockRepository = {
    getAll: jest.fn(),
    getPendientes: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    updateEstado: jest.fn(),
    delete: jest.fn()
  };

  // Crear una instancia del servicio con el repositorio mock
  const service = new InscripcionService(mockRepository);

  // Reiniciar todos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInscripciones', () => {
    it('debería llamar al método getAll del repositorio', async () => {
      const mockInscripciones = [
        { 
          id: 1, 
          player_name: 'Jugador Test', 
          birth_date: '2010-01-01',
          player_dni: '12345678A',
          team: 'Infantil A',
          parent_name: 'Padre Test',
          contact_phone1: '666111222',
          email1: 'test@example.com',
          address: 'Calle Test',
          city: 'Cardedeu',
          postal_code: '08440',
          accept_terms: true,
          estado: 'pendiente' as const,
          temporada: '2024-2025'
        }
      ];
      mockRepository.getAll.mockResolvedValue(mockInscripciones);

      const result = await service.getInscripciones();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockInscripciones);
    });
  });

  describe('getInscripcionesPendientes', () => {
    it('debería llamar al método getPendientes del repositorio', async () => {
      const mockInscripciones = [
        { 
          id: 1, 
          player_name: 'Jugador Test', 
          birth_date: '2010-01-01',
          player_dni: '12345678A',
          team: 'Infantil A',
          parent_name: 'Padre Test',
          contact_phone1: '666111222',
          email1: 'test@example.com', // Fíjate que usamos email1 en lugar de contact_email1 (corregido)
          address: 'Calle Test',
          city: 'Cardedeu',
          postal_code: '08440',
          accept_terms: true,
          estado: 'pendiente' as const,
          temporada: '2024-2025'
        }
      ];
      mockRepository.getPendientes.mockResolvedValue(mockInscripciones);

      const result = await service.getInscripcionesPendientes();

      expect(mockRepository.getPendientes).toHaveBeenCalled();
      expect(result).toEqual(mockInscripciones);
    });
  });

  describe('getInscripcionById', () => {
    it('debería llamar al método getById del repositorio', async () => {
      const mockInscripcion = { 
        id: 1, 
        player_name: 'Jugador Test', 
        birth_date: '2010-01-01',
        player_dni: '12345678A',
        team: 'Infantil A',
        parent_name: 'Padre Test',
        contact_phone1: '666111222',
        email1: 'test@example.com',
        address: 'Calle Test',
        city: 'Cardedeu',
        postal_code: '08440',
        accept_terms: true,
        estado: 'pendiente' as const,
        temporada: '2024-2025'
      };
      mockRepository.getById.mockResolvedValue(mockInscripcion);

      const result = await service.getInscripcionById(1);

      expect(mockRepository.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockInscripcion);
    });

    it('debería manejar correctamente cuando no se encuentra la inscripción', async () => {
      mockRepository.getById.mockResolvedValue(null);

      const result = await service.getInscripcionById(999);

      expect(mockRepository.getById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('actualizarEstadoInscripcion', () => {
    it('debería llamar al método updateEstado del repositorio con los datos correctos', async () => {
      const dto: UpdateInscripcionEstadoDTO = {
        id: 1,
        estado: 'completada',
        processed: true,
        paymentInfo: {
          method: 'transfer',
          status: 'completed',
          amount: 150,
          date: '2024-04-20'
        }
      };
      
      const inscripcionActualizada: Inscripcion = {
        id: 1,
        player_name: 'Jugador Test',
        birth_date: '2010-01-01',
        player_dni: '12345678A',
        team: 'Infantil A',
        parent_name: 'Padre Test',
        contact_phone1: '666111222',
        email1: 'test@example.com',
        address: 'Calle Test',
        city: 'Cardedeu',
        postal_code: '08440',
        accept_terms: true,
        estado: 'completada',
        temporada: '2024-2025',
        processed: true,
        payment_info: dto.paymentInfo as PaymentInfo
      };
      
      mockRepository.updateEstado.mockResolvedValue(inscripcionActualizada);

      const result = await service.actualizarEstadoInscripcion(dto);

      expect(mockRepository.updateEstado).toHaveBeenCalledWith(dto);
      expect(result).toEqual(inscripcionActualizada);
    });

    // Probar el manejo de errores cuando falla la actualización de estado
    it('debería manejar errores RLS y políticas de seguridad', async () => {
      const dto: UpdateInscripcionEstadoDTO = {
        id: 1,
        estado: 'completada'
      };
      
      // Definir un tipo específico para errores de PostgreSQL
      type PostgrestErrorCode = '42501' | '23505' | '23503' | string;
      
      // Interfaz para representar un error de PostgreSQL con código
      interface PostgrestError extends Error {
        code: PostgrestErrorCode;
      }
      
      // Crear el error directamente con el tipo correcto
      const rlsError = new Error('RLS policy violation') as PostgrestError;
      rlsError.name = 'PostgrestError';
      rlsError.code = '42501'; // Código de error de política de seguridad
      
      mockRepository.updateEstado.mockRejectedValue(rlsError);
      
      // Debería capturar la excepción y devolver una inscripción simulada para mantener la UI actualizada
      await expect(service.actualizarEstadoInscripcion(dto))
        .rejects
        .toThrow('RLS policy violation');
    });
  });

  describe('deleteInscripcion', () => {
    it('debería llamar al método delete del repositorio', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await service.deleteInscripcion(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
