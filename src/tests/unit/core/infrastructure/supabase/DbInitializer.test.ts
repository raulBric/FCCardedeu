/* eslint-disable @typescript-eslint/ban-ts-comment */
// This test file uses @ts-ignore to handle typing issues in test mocks
import '@testing-library/jest-dom';
import { DbInitializer } from '@/core/infrastructure/supabase/DbInitializer';
import { supabase } from '@/lib/supabaseClient';

// Mock completo de supabase
// @ts-ignore
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    rpc: jest.fn(),
    storage: {
      listBuckets: jest.fn(),
      createBucket: jest.fn(),
      updateBucket: jest.fn()
    }
  }
}));

// Acceso al mock
// @ts-ignore
const mockSupabase = supabase;

describe('DbInitializer', () => {
  // Limpiar todos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeInscripcionesTable', () => {
    it('debería detectar que la tabla ya existe y no crearla', async () => {
      // Mock para simular que la tabla existe (no hay error)
      // @ts-ignore
      mockSupabase.from().select().limit.mockReturnValue({
        error: null,
        data: [{ count: 5 }]
      });

      const result = await DbInitializer.initializeInscripcionesTable();

      expect(mockSupabase.from).toHaveBeenCalledWith('inscripcions');
      expect(mockSupabase.rpc).not.toHaveBeenCalled(); // No debería intentar crear la tabla
      expect(result).toBe(true);
    });

    it('debería intentar crear la tabla si no existe', async () => {
      // Mock para simular que la tabla no existe
      const error = { code: '42P01' }; // Código de PostgreSQL para "tabla no existe"
      // @ts-ignore
      mockSupabase.from().select().limit.mockReturnValue({
        error,
        data: null
      });

      // Mock para simular éxito en la creación de la tabla
      // @ts-ignore
      mockSupabase.rpc.mockResolvedValue({ error: null, data: true });

      const result = await DbInitializer.initializeInscripcionesTable();

      expect(mockSupabase.from).toHaveBeenCalledWith('inscripcions');
      expect(mockSupabase.rpc).toHaveBeenCalledWith('create_inscripcions_table');
      expect(result).toBe(true);
    });

    it('debería manejar errores al crear la tabla', async () => {
      // Mock para simular que la tabla no existe
      const error = { code: '42P01' };
      // @ts-ignore
      mockSupabase.from().select().limit.mockReturnValue({
        error,
        data: null
      });

      // Mock para simular error en la creación de la tabla
      // @ts-ignore
      mockSupabase.rpc.mockResolvedValue({ error: { message: 'Error al crear tabla' }, data: null });

      const result = await DbInitializer.initializeInscripcionesTable();

      expect(mockSupabase.from).toHaveBeenCalledWith('inscripcions');
      expect(mockSupabase.rpc).toHaveBeenCalledWith('create_inscripcions_table');
      expect(result).toBe(false);
    });
  });

  describe('initializeStorageBuckets', () => {
    it('debería detectar buckets existentes y actualizarlos', async () => {
      // Mock para simular que los buckets existen
      // @ts-ignore
      mockSupabase.storage.listBuckets.mockResolvedValue({
        error: null,
        data: [
          { name: 'noticies' },
          { name: 'jugadores' },
          { name: 'entrenadores' },
          { name: 'equipos' }
        ]
      });

      // Mock para simular éxito al actualizar buckets
      // @ts-ignore
      mockSupabase.storage.updateBucket.mockResolvedValue({
        error: null,
        data: { publicAccessLevel: 'read' }
      });

      const result = await DbInitializer.initializeStorageBuckets();

      expect(mockSupabase.storage.listBuckets).toHaveBeenCalled();
      expect(mockSupabase.storage.updateBucket).toHaveBeenCalledTimes(4);
      expect(mockSupabase.storage.createBucket).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('debería crear buckets que no existen', async () => {
      // Mock para simular que solo existe un bucket
      // @ts-ignore
      mockSupabase.storage.listBuckets.mockResolvedValue({
        error: null,
        data: [{ name: 'noticies' }]
      });

      // Mock para simular éxito al crear buckets
      // @ts-ignore
      mockSupabase.storage.createBucket.mockResolvedValue({
        error: null,
        data: { name: 'new-bucket' }
      });

      // Mock para simular éxito al actualizar buckets
      // @ts-ignore
      mockSupabase.storage.updateBucket.mockResolvedValue({
        error: null,
        data: { publicAccessLevel: 'read' }
      });

      const result = await DbInitializer.initializeStorageBuckets();

      expect(mockSupabase.storage.listBuckets).toHaveBeenCalled();
      expect(mockSupabase.storage.createBucket).toHaveBeenCalledTimes(3); // Debería crear 3 buckets faltantes
      expect(mockSupabase.storage.updateBucket).toHaveBeenCalledTimes(1); // Debería actualizar 1 bucket existente
      expect(result).toBe(true);
    });

    it('debería manejar errores al listar buckets', async () => {
      // Mock para simular error al listar buckets
      // @ts-ignore
      mockSupabase.storage.listBuckets.mockResolvedValue({
        error: { message: 'Error al listar buckets' },
        data: null
      });

      const result = await DbInitializer.initializeStorageBuckets();

      expect(mockSupabase.storage.listBuckets).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('initializeAll', () => {
    it('debería inicializar todas las tablas y buckets correctamente', async () => {
      // Reemplazar los métodos originales con mocks
      const spyInscripciones = jest
        .spyOn(DbInitializer, 'initializeInscripcionesTable')
        .mockResolvedValue(true);
      
      const spyNoticias = jest
        .spyOn(DbInitializer, 'initializeNoticiasTable')
        .mockResolvedValue(true);
      
      const spyBuckets = jest
        .spyOn(DbInitializer, 'initializeStorageBuckets')
        .mockResolvedValue(true);

      const result = await DbInitializer.initializeAll();

      expect(spyInscripciones).toHaveBeenCalled();
      expect(spyNoticias).toHaveBeenCalled();
      expect(spyBuckets).toHaveBeenCalled();
      expect(result).toBe(true);

      // Restaurar los métodos originales
      spyInscripciones.mockRestore();
      spyNoticias.mockRestore();
      spyBuckets.mockRestore();
    });

    it('debería manejar errores si alguna inicialización falla', async () => {
      // Reemplazar los métodos originales con mocks
      const spyInscripciones = jest
        .spyOn(DbInitializer, 'initializeInscripcionesTable')
        .mockResolvedValue(true);
      
      const spyNoticias = jest
        .spyOn(DbInitializer, 'initializeNoticiasTable')
        .mockResolvedValue(false); // Simulamos que falla
      
      const spyBuckets = jest
        .spyOn(DbInitializer, 'initializeStorageBuckets')
        .mockResolvedValue(true);

      const result = await DbInitializer.initializeAll();

      expect(spyInscripciones).toHaveBeenCalled();
      expect(spyNoticias).toHaveBeenCalled();
      expect(spyBuckets).toHaveBeenCalled();
      expect(result).toBe(false); // Debería fallar porque uno de los procesos falló

      // Restaurar los métodos originales
      spyInscripciones.mockRestore();
      spyNoticias.mockRestore();
      spyBuckets.mockRestore();
    });
  });
});
