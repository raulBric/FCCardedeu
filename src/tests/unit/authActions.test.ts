// Usamos require en lugar de import para evitar problemas con módulos
const { logLoginAttempt, getSessionLogs, deleteLogs } = require("@/app/actions/auth");
const { resetAuthCookies } = require("@/app/actions/reset-auth");
const { supabase } = require("@/lib/supabaseClient");

/**
 * Conjunto de tests para las funciones de autenticación.
 * Versión simplificada para priorizar compatibilidad.
 */

// Mock básico para document y localStorage (solo las propiedades que usamos)
Object.defineProperty(global, 'document', {
  value: {
    cookie: ""
  },
  writable: true
});

Object.defineProperty(global, 'localStorage', {
  value: {
    removeItem: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
  writable: true
});

// Mock para window.location (usado en resetAuthCookies)
Object.defineProperty(global, 'window', {
  value: {
    location: {
      hostname: "test.localhost"
    }
  },
  writable: true
});

describe("Funciones de autenticación", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe("logLoginAttempt", () => {
    it("debería insertar un registro de login exitosamente", async () => {
      // Configurar mocks para Supabase
      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      (supabase.from).mockReturnValue({ insert: mockInsert });
      
      // Datos de prueba
      const email = "user@example.com";
      const result = await logLoginAttempt(email, true);
      
      // Verificaciones
      expect(supabase.from).toHaveBeenCalledWith("auth_logs");
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_email: email,
          success: true
        })
      );
      expect(result).toEqual({ success: true });
    });

    it("debería manejar errores de la base de datos", async () => {
      // Configurar mock para simular error
      const mockInsert = jest.fn().mockResolvedValue({ 
        error: { message: "db error" } 
      });
      (supabase.from).mockReturnValue({ insert: mockInsert });
      
      // Ejecutar la función
      const result = await logLoginAttempt("user@example.com", false);
      
      // Verificar resultado
      expect(result.success).toBe(false);
      expect(result.error).toBe("db error");
    });
  });
  
  describe("getSessionLogs", () => {
    it("debería obtener logs exitosamente", async () => {
      // Datos de prueba
      const mockLogs = [
        { id: 1, user_email: "user1@example.com", login_at: "2025-05-01", success: true },
        { id: 2, user_email: "user2@example.com", login_at: "2025-05-02", success: false }
      ];
      
      // Configurar cadena de mocks para Supabase
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockRange = jest.fn().mockResolvedValue({
        data: mockLogs,
        count: 2,
        error: null
      });
      
      // Montar la cadena completa de llamadas
      (supabase.from).mockReturnValue({ 
        select: mockSelect,
        order: mockOrder,
        range: mockRange,
        eq: jest.fn().mockReturnThis()
      });
      
      // Ejecutar función
      const result = await getSessionLogs(10, 0);
      
      // Verificaciones
      expect(supabase.from).toHaveBeenCalledWith("auth_logs");
      expect(mockSelect).toHaveBeenCalledWith("*", { count: "exact" });
      expect(mockOrder).toHaveBeenCalledWith("login_at", { ascending: false });
      expect(mockRange).toHaveBeenCalledWith(0, 9); // Rango basado en offset y límite
      
      // Verificar respuesta
      expect(result).toEqual({
        logs: mockLogs,
        count: 2
      });
    });
    
    it("debería manejar errores en la consulta", async () => {
      // Mock para un error de base de datos
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockRange = jest.fn().mockResolvedValue({
        data: null,
        count: null,
        error: { message: "Error de permisos" }
      });
      
      (supabase.from).mockReturnValue({ 
        select: mockSelect,
        order: mockOrder,
        range: mockRange,
        eq: jest.fn().mockReturnThis()
      });
      
      // Ejecutar función
      const result = await getSessionLogs();
      
      // Verificar manejo de error correcto
      expect(result.logs).toEqual([]);
      expect(result.count).toBe(0);
      expect(result.error).toBe("Error de permisos");
    });
  });
  
  describe("deleteLogs", () => {
    it("debería eliminar todos los logs cuando all=true", async () => {
      // Configurar mocks para simular eliminación exitosa
      const mockDelete = jest.fn().mockReturnThis();
      const mockGte = jest.fn().mockResolvedValue({
        count: 5,
        error: null
      });
      
      // Cadena completa
      (supabase.from).mockReturnValue({ 
        delete: mockDelete,
        gte: mockGte
      });
      
      // Ejecutar función eliminando todos los logs
      const result = await deleteLogs(true);
      
      // Verificaciones
      expect(supabase.from).toHaveBeenCalledWith("auth_logs");
      expect(mockDelete).toHaveBeenCalledWith({ count: "exact" });
      expect(mockGte).toHaveBeenCalledWith("id", 0); // Condición que selecciona todos
      
      // Verificar resultado
      expect(result).toEqual({
        success: true,
        deleted: 5
      });
    });
    
    it("debería filtrar por fecha en olderThan", async () => {
      // Mock para filtrado por fecha
      const mockDelete = jest.fn().mockReturnThis();
      const mockLt = jest.fn().mockResolvedValue({
        count: 3,
        error: null
      });
      
      (supabase.from).mockReturnValue({ 
        delete: mockDelete,
        lt: mockLt
      });
      
      // Fecha de prueba
      const testDate = new Date("2025-01-01");
      const result = await deleteLogs(false, testDate);
      
      // Verificar filtro por fecha
      expect(mockLt).toHaveBeenCalledWith("login_at", testDate.toISOString());
      expect(result.success).toBe(true);
      expect(result.deleted).toBe(3);
    });
  });
});

describe("resetAuthCookies", () => {
  beforeEach(() => {
    // Configurar cookies para las pruebas
    global.document.cookie = "sb-access-token=token123;";
    global.document.cookie += " supabase-auth-token=refresh456;";
    
    // Limpiar mocks
    jest.clearAllMocks();
  });
  
  it("debería eliminar cookies de autenticación", () => {
    // Ejecutar función
    const result = resetAuthCookies();
    
    // Verificar resultado
    expect(result.success).toBe(true);
    
    // Verificar que se llamaron los métodos esperados
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("supabase.auth.token");
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("supabase.auth.refreshToken");
  });
});

// Esto indica a TypeScript que este archivo es un módulo ES
export {};
