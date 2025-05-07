// src/app/actions/auth.ts
import { supabase } from "@/lib/supabaseClient";

// Función para extraer información del navegador desde user-agent
function parseUserAgent(userAgent: string): string {
  try {
    // Extraer navegador
    let browser = "";
    if (userAgent.includes("Firefox")) {
      browser = "Firefox";
    } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      browser = "Chrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browser = "Safari";
    } else if (userAgent.includes("Edg")) {
      browser = "Edge";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
      browser = "Internet Explorer";
    } else {
      browser = "Navegador desconocido";
    }
    
    // Extraer sistema operativo
    let os = "";
    if (userAgent.includes("Windows")) {
      os = "Windows";
    } else if (userAgent.includes("Mac OS")) {
      os = "Mac OS";
    } else if (userAgent.includes("Linux")) {
      os = "Linux";
    } else if (userAgent.includes("Android")) {
      os = "Android";
    } else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
      os = "iOS";
    } else {
      os = "Sistema operativo desconocido";
    }
    
    // Detectar si es móvil
    const isMobile = userAgent.includes("Mobile") || 
                    userAgent.includes("Android") && userAgent.includes("Mozilla") ||
                    userAgent.includes("iPhone") ||
                    userAgent.includes("iPad");
    
    return `${browser} en ${os}${isMobile ? ' (Móvil)' : ' (Escritorio)'}`;
  } catch (e) {
    // Si hay algún error, devolver el user-agent original
    return userAgent;
  }
}

// Tipo para los logs de sesión
export interface SessionLog {
  id?: number;
  user_email: string;
  ip_address?: string;
  user_agent?: string;
  login_at: string;
  success: boolean;
  notes?: string;
}

/**
 * Registra un intento de inicio de sesión en la base de datos
 */
export async function logLoginAttempt(
  email: string, 
  success: boolean, 
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Obtener información del navegador/dispositivo
    const rawUserAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server';
    
    // Procesar el user-agent para obtener información más legible
    const parsedUserAgent = parseUserAgent(rawUserAgent);
    
    // Crear entrada de log
    const logEntry: SessionLog = {
      user_email: email,
      login_at: new Date().toISOString(),
      user_agent: parsedUserAgent,
      success,
      notes: notes || (success ? 'Login exitoso' : 'Login fallido')
    };
    
    // Insertar en la tabla auth_logs
    const { error } = await supabase
      .from('auth_logs')
      .insert(logEntry);
    
    if (error) {
      console.error('Error al registrar intento de login:', error);
      // Si la tabla no existe aún, intentamos crearla (solo en desarrollo)
      if (error.message.includes('relation "auth_logs" does not exist') && process.env.NODE_ENV === 'development') {
        console.log('Intentando crear tabla auth_logs...');
        await createAuthLogsTable();
        // Reintentar la inserción
        const retryResult = await supabase.from('auth_logs').insert(logEntry);
        if (retryResult.error) {
          console.error('Error al reintentar registro de login:', retryResult.error);
          return { success: false, error: retryResult.error.message };
        }
      } else {
        return { success: false, error: error.message };
      }
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error inesperado al registrar login:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Crea la tabla auth_logs en Supabase si no existe
 * Nota: Esto solo funcionará si el cliente tiene permisos para crear tablas
 */
async function createAuthLogsTable() {
  try {
    // Este SQL solo funcionaría si tienes permisos de administrador en la base de datos
    const sql = `
      CREATE TABLE IF NOT EXISTS auth_logs (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        ip_address VARCHAR(50),
        user_agent TEXT,
        login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        success BOOLEAN NOT NULL,
        notes TEXT
      );
    `;
    
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error al crear tabla auth_logs:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error inesperado al crear tabla:', err);
    return false;
  }
}

/**
 * Borra logs de sesión según los filtros proporcionados
 */
export async function deleteLogs(
  all: boolean = false,
  olderThan?: Date,
  filterSuccess?: boolean
): Promise<{ success: boolean; deleted?: number; error?: string }> {
  try {
    let deleteQuery = supabase.from('auth_logs').delete({ count: 'exact' });
    
    if (all) {
      // Para borrar todo, añadimos una condición que siempre es verdadera
      // ya que Supabase requiere un WHERE por seguridad
      deleteQuery = deleteQuery.gte('id', 0);
    } else {
      // Aplicamos los filtros proporcionados
      if (olderThan) {
        // Si se proporciona una fecha, filtrar logs más antiguos
        deleteQuery = deleteQuery.lt('login_at', olderThan.toISOString());
      } else if (filterSuccess !== undefined) {
        // Si se proporciona un filtro de éxito, aplicarlo
        deleteQuery = deleteQuery.eq('success', filterSuccess);
      } else {
        // Si no hay filtros pero tampoco queremos borrar todo,
        // añadimos una condición que siempre es verdadera
        deleteQuery = deleteQuery.gte('id', 0);
      }
    }
    
    // Ejecutar la consulta
    const { error, count } = await deleteQuery;
    
    if (error) {
      console.error('Error al borrar logs:', error);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true,
      deleted: count || 0
    };
  } catch (err) {
    console.error('Error inesperado al borrar logs:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Obtiene los logs de inicio de sesión
 */
export async function getSessionLogs(
  limit = 100, 
  offset = 0, 
  filterSuccess?: boolean
): Promise<{ logs: SessionLog[]; count: number; error?: string }> {
  try {
    let query = supabase
      .from('auth_logs')
      .select('*', { count: 'exact' });
    
    // Aplicar filtro si se proporciona
    if (filterSuccess !== undefined) {
      query = query.eq('success', filterSuccess);
    }
    
    // Ordenar por fecha descendente y aplicar paginación
    const { data, count, error } = await query
      .order('login_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error al obtener logs de sesión:', error);
      return { logs: [], count: 0, error: error.message };
    }
    
    return { 
      logs: data as SessionLog[], 
      count: count || 0 
    };
  } catch (err) {
    console.error('Error inesperado al obtener logs:', err);
    return { 
      logs: [], 
      count: 0, 
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}
