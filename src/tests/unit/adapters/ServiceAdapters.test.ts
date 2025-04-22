import { 
  obtenerEntrenador, 
  obtenerJugador, 
  obtenerEquip,
  obtenerNoticias,
  obtenerInscripciones,
  obtenerResultados
} from '@/adapters/ServiceAdapters';
import { ServiceFactory } from '@/core/infrastructure/factories/ServiceFactory';

// Mockear el ServiceFactory
jest.mock('@/core/infrastructure/factories/ServiceFactory', () => ({
  ServiceFactory: {
    getEntrenadorService: jest.fn(),
    getJugadorService: jest.fn(),
    getEquipoService: jest.fn(),
    getNoticiaService: jest.fn(),
    getInscripcionService: jest.fn(),
    getResultadoService: jest.fn()
  }
}));

describe('ServiceAdapters', () => {
  // Reiniciar todos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerEntrenador', () => {
    it('debería llamar al servicio correcto y devolver el entrenador', async () => {
      const mockEntrenador = { id: 1, nom: 'Pep', cognom: 'Guardiola', tipus: 'principal' };
      const mockService = {
        getEntrenadorById: jest.fn().mockResolvedValue(mockEntrenador)
      };
      
      (ServiceFactory.getEntrenadorService as jest.Mock).mockReturnValue(mockService);
      
      const result = await obtenerEntrenador(1);
      
      expect(ServiceFactory.getEntrenadorService).toHaveBeenCalled();
      expect(mockService.getEntrenadorById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEntrenador);
    });
  });

  describe('obtenerJugador', () => {
    it('debería llamar al servicio correcto y devolver el jugador', async () => {
      const mockJugador = { id: 1, nom: 'Leo', cognoms: 'Messi', data_naixement: '1987-06-24' };
      const mockService = {
        getJugadorById: jest.fn().mockResolvedValue(mockJugador)
      };
      
      (ServiceFactory.getJugadorService as jest.Mock).mockReturnValue(mockService);
      
      const result = await obtenerJugador(1);
      
      expect(ServiceFactory.getJugadorService).toHaveBeenCalled();
      expect(mockService.getJugadorById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockJugador);
    });
  });

  describe('obtenerEquip', () => {
    it('debería llamar al servicio correcto y devolver el equipo', async () => {
      const mockEquipo = { id: 1, nom: 'Infantil A', categoria: 'Infantil', temporada: '2024-2025' };
      const mockService = {
        getEquipoById: jest.fn().mockResolvedValue(mockEquipo)
      };
      
      (ServiceFactory.getEquipoService as jest.Mock).mockReturnValue(mockService);
      
      const result = await obtenerEquip(1);
      
      expect(ServiceFactory.getEquipoService).toHaveBeenCalled();
      expect(mockService.getEquipoById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEquipo);
    });
  });

  describe('obtenerNoticias', () => {
    it('debería llamar al servicio correcto y devolver las noticias', async () => {
      const mockNoticias = [
        { id: 1, titulo: 'Noticia 1', contenido: 'Contenido 1', fecha: '2024-04-10' },
        { id: 2, titulo: 'Noticia 2', contenido: 'Contenido 2', fecha: '2024-04-12' }
      ];
      const mockService = {
        getNoticias: jest.fn().mockResolvedValue(mockNoticias)
      };
      
      (ServiceFactory.getNoticiaService as jest.Mock).mockReturnValue(mockService);
      
      const result = await obtenerNoticias();
      
      expect(ServiceFactory.getNoticiaService).toHaveBeenCalled();
      expect(mockService.getNoticias).toHaveBeenCalled();
      expect(result).toEqual(mockNoticias);
    });
  });

  describe('obtenerInscripciones', () => {
    it('debería llamar al servicio correcto y devolver las inscripciones', async () => {
      const mockInscripciones = [
        { 
          id: 1, 
          player_name: 'Alumno 1', 
          birth_date: '2012-01-01',
          player_dni: '12345678A',
          team: 'Infantil',
          accept_terms: true 
        }
      ];
      const mockService = {
        getInscripciones: jest.fn().mockResolvedValue(mockInscripciones)
      };
      
      (ServiceFactory.getInscripcionService as jest.Mock).mockReturnValue(mockService);
      
      const result = await obtenerInscripciones();
      
      expect(ServiceFactory.getInscripcionService).toHaveBeenCalled();
      expect(mockService.getInscripciones).toHaveBeenCalled();
      expect(result).toEqual(expect.any(Array));
    });
  });

  describe('obtenerResultados', () => {
    it('debería llamar al servicio correcto y devolver los resultados', async () => {
      const mockResultados = [
        { 
          id: 1, 
          equipo_local: 'FCCardedeu Infantil A', 
          equipo_visitante: 'Granollers',
          goles_local: 3,
          goles_visitante: 1,
          completado: true 
        }
      ];
      const mockService = {
        getResultados: jest.fn().mockResolvedValue(mockResultados)
      };
      
      (ServiceFactory.getResultadoService as jest.Mock).mockReturnValue(mockService);
      
      const result = await obtenerResultados();
      
      expect(ServiceFactory.getResultadoService).toHaveBeenCalled();
      expect(mockService.getResultados).toHaveBeenCalled();
      expect(result).toEqual(expect.any(Array));
    });
  });
});
