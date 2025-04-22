import { PatrocinadorService } from '@/core/application/services/PatrocinadorService';
import { Patrocinador, CreatePatrocinadorDTO, UpdatePatrocinadorDTO } from '@/core/domain/models/Patrocinador';

describe('PatrocinadorService', () => {
  // Crear un mock del repositorio
  const mockRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  // Crear una instancia del servicio con el repositorio mock
  const service = new PatrocinadorService(mockRepository);

  // Reiniciar todos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPatrocinadores', () => {
    it('debería llamar al método getAll del repositorio', async () => {
      const mockPatrocinadores = [
        { 
          id: 1, 
          nombre: 'Patrocinador 1', 
          logo_url: 'logo1.png', 
          nivel: 'oro' as const,
          temporada: '2024-2025' 
        },
        { 
          id: 2, 
          nombre: 'Patrocinador 2', 
          logo_url: 'logo2.png', 
          nivel: 'plata' as const,
          temporada: '2024-2025' 
        }
      ];
      mockRepository.getAll.mockResolvedValue(mockPatrocinadores);

      const result = await service.getPatrocinadores();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockPatrocinadores);
    });

    it('debería pasar los parámetros limit y page al repositorio', async () => {
      await service.getPatrocinadores(10, 2);
      expect(mockRepository.getAll).toHaveBeenCalledWith(10, 2);
    });
  });

  describe('getPatrocinadorById', () => {
    it('debería llamar al método getById del repositorio', async () => {
      const mockPatrocinador = { 
        id: 1, 
        nombre: 'Patrocinador Test', 
        logo_url: 'logo.png',
        nivel: 'oro' as const,
        temporada: '2024-2025' 
      };
      mockRepository.getById.mockResolvedValue(mockPatrocinador);

      const result = await service.getPatrocinadorById(1);

      expect(mockRepository.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPatrocinador);
    });

    it('debería manejar correctamente cuando no se encuentra el patrocinador', async () => {
      mockRepository.getById.mockResolvedValue(null);

      const result = await service.getPatrocinadorById(999);

      expect(mockRepository.getById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('createPatrocinador', () => {
    it('debería llamar al método create del repositorio', async () => {
      const dto: CreatePatrocinadorDTO = {
        nombre: 'Nuevo Patrocinador',
        logo_url: 'nuevo-logo.png',
        nivel: 'bronce',
        temporada: '2024-2025'
      };
      
      const nuevoPatrocinador: Patrocinador = {
        id: 1,
        nombre: dto.nombre,
        logo_url: dto.logo_url,
        nivel: dto.nivel,
        temporada: dto.temporada,
        tipo: 'colaborador',
        activo: true
      };
      
      mockRepository.create.mockResolvedValue(nuevoPatrocinador);

      const result = await service.createPatrocinador(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(nuevoPatrocinador);
    });
  });

  describe('updatePatrocinador', () => {
    it('debería llamar al método update del repositorio', async () => {
      const dto: UpdatePatrocinadorDTO = {
        nombre: 'Patrocinador Actualizado',
        nivel: 'oro'
      };
      
      const patrocinadorActualizado: Patrocinador = {
        id: 1,
        nombre: dto.nombre!,
        logo_url: 'logo-original.png',
        nivel: dto.nivel!,
        temporada: '2024-2025',
        tipo: 'colaborador',
        activo: true
      };
      
      mockRepository.update.mockResolvedValue(patrocinadorActualizado);

      const result = await service.updatePatrocinador(1, dto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(patrocinadorActualizado);
    });
  });

  describe('deletePatrocinador', () => {
    it('debería llamar al método delete del repositorio', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await service.deletePatrocinador(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
