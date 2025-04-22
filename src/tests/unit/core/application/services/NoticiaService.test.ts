import { NoticiaService } from '@/core/application/services/NoticiaService';
import { Noticia, CreateNoticiaDTO, UpdateNoticiaDTO } from '@/core/domain/models/Noticia';

describe('NoticiaService', () => {
  // Crear un mock del repositorio
  const mockRepository = {
    getAll: jest.fn(),
    getDestacadas: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  // Crear una instancia del servicio con el repositorio mock
  const service = new NoticiaService(mockRepository);

  // Reiniciar todos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNoticias', () => {
    it('debería llamar al método getAll del repositorio', async () => {
      const mockNoticias = [
        { id: 1, titulo: 'Noticia 1', contenido: 'Contenido 1', fecha: '2024-04-10', destacada: false },
        { id: 2, titulo: 'Noticia 2', contenido: 'Contenido 2', fecha: '2024-04-12', destacada: true }
      ];
      mockRepository.getAll.mockResolvedValue(mockNoticias);

      const result = await service.getNoticias();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockNoticias);
    });

    it('debería pasar los parámetros limit y page al repositorio', async () => {
      await service.getNoticias(10, 2);
      expect(mockRepository.getAll).toHaveBeenCalledWith(10, 2);
    });
  });

  describe('getDestacadas', () => {
    it('debería llamar al método getDestacadas del repositorio', async () => {
      const mockNoticias = [
        { id: 1, titulo: 'Noticia Destacada', contenido: 'Contenido', fecha: '2024-04-10', destacada: true }
      ];
      mockRepository.getDestacadas.mockResolvedValue(mockNoticias);

      const result = await service.getDestacadas();

      expect(mockRepository.getDestacadas).toHaveBeenCalled();
      expect(result).toEqual(mockNoticias);
    });

    it('debería pasar el parámetro limit al repositorio', async () => {
      await service.getDestacadas(3);
      expect(mockRepository.getDestacadas).toHaveBeenCalledWith(3);
    });
  });

  describe('getNoticia', () => {
    it('debería llamar al método getById del repositorio', async () => {
      const mockNoticia = { 
        id: 1, 
        titulo: 'Noticia Test', 
        contenido: 'Contenido test', 
        fecha: '2024-04-10', 
        destacada: false 
      };
      mockRepository.getById.mockResolvedValue(mockNoticia);

      const result = await service.getNoticia(1);

      expect(mockRepository.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNoticia);
    });

    it('debería manejar correctamente cuando no se encuentra la noticia', async () => {
      mockRepository.getById.mockResolvedValue(null);

      const result = await service.getNoticia(999);

      expect(mockRepository.getById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('crearNoticia', () => {
    it('debería llamar al método create del repositorio', async () => {
      const dto: CreateNoticiaDTO = {
        titulo: 'Nueva Noticia',
        contenido: 'Contenido de prueba',
        fecha: '2024-04-20'
      };
      
      const nuevaNoticia: Noticia = {
        id: 1,
        titulo: dto.titulo,
        contenido: dto.contenido,
        fecha: dto.fecha!,
        destacada: false
      };
      
      mockRepository.create.mockResolvedValue(nuevaNoticia);

      const result = await service.crearNoticia(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(nuevaNoticia);
    });
  });

  describe('actualizarNoticia', () => {
    it('debería llamar al método update del repositorio', async () => {
      const dto: UpdateNoticiaDTO = {
        titulo: 'Noticia Actualizada',
        destacada: true
      };
      
      const noticiaActualizada: Noticia = {
        id: 1,
        titulo: dto.titulo!,
        contenido: 'Contenido original',
        fecha: '2024-04-10',
        destacada: dto.destacada!
      };
      
      mockRepository.update.mockResolvedValue(noticiaActualizada);

      const result = await service.actualizarNoticia(1, dto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(noticiaActualizada);
    });
  });

  describe('eliminarNoticia', () => {
    it('debería llamar al método delete del repositorio', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await service.eliminarNoticia(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
