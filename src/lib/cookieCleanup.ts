// lib/cookieCleanup.ts
/**
 * Función de limpieza para sanear cookies y localStorage
 * de autenticación de Supabase que puedan estar dañadas
 */
export function cleanupAuthStorage() {
  if (typeof window === 'undefined') return;

  // 1. Limpiar localStorage
  try {
    // Saneo específico para el error de parsing
    const authItems = [
      'supabase.auth.token',
      'sb-refresh-token',
      'sb-access-token',
      'supabase-auth-token'
    ];
    
    // Enfoque agresivo: remover todas las keys para prevenir errores
    for (const key of authItems) {
      try {
        localStorage.removeItem(key);
        console.log(`[CLEANUP] Eliminando token ${key} (limpieza preventiva)`);
      } catch (e) {
        // Ignorar errores
      }
    }
    
    // También eliminar otras claves conocidas que puedan causar conflictos
    const otherKeys = Object.keys(localStorage);
    for (const key of otherKeys) {
      if (key.includes('supabase') || key.includes('sb-')) {
        try {
          localStorage.removeItem(key);
          console.log(`[CLEANUP] Eliminando clave relacionada: ${key}`);
        } catch (e) {
          // Ignorar errores
        }
      }
    }
  } catch (e) {
    console.warn("[CLEANUP] Error al sanear localStorage:", e);
  }

  // 2. Limpiar cookies (método agresivo con múltiples combinaciones)
  try {
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      '__session',
      'sb-provider-token',
      'sb', // prefijo genérico para capturar otras cookies
      'supabase',
    ];
    
    // Obtener todas las cookies existentes
    const allCookies = document.cookie.split(';');
    
    // Limpiar cookies específicas
    cookiesToClear.forEach(name => {
      // Limpiar con diferentes path/domain para mayor seguridad
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      console.log(`[CLEANUP] Limpiando cookie: ${name}`);
    });
    
    // También buscar cualquier cookie que contenga "supabase" o "sb-"
    allCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      if (cookieName.includes('supabase') || cookieName.includes('sb-') || cookieName === 'sb') {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        console.log(`[CLEANUP] Limpiando cookie relacionada: ${cookieName}`);
      }
    });
  } catch (e) {
    console.warn("[CLEANUP] Error al sanear cookies:", e);
  }
}

/**
 * Función para determinar si hay una cookie de autenticación inválida
 * Devuelve true si se detecta una cookie corrupta
 */
export function hasInvalidAuthCookie(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const authItems = [
      'supabase.auth.token',
      'sb-refresh-token', 
      'sb-access-token',
      'supabase-auth-token'
    ];
    
    // Verificar localStorage
    for (const key of authItems) {
      const rawValue = localStorage.getItem(key);
      if (!rawValue) continue;
      
      if (rawValue.startsWith('base64-') || rawValue.startsWith('{')) {
        try {
          JSON.parse(rawValue);
        } catch (e) {
          return true; // Encontramos un item inválido
        }
      }
    }
    
    return false;
  } catch (e) {
    // Si hay un error, mejor marcar como inválido
    return true;
  }
}
