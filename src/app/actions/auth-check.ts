'use server'

// Importamos nuestro manejador personalizado de cookies
import { createServerActionClient } from '@/lib/supabaseCookieHandler'
import { redirect } from 'next/navigation'

/**
 * Acción del servidor para verificar el estado de autenticación
 * Esta función debe llamarse desde un form action en la página de login
 */
export async function checkAuthStatus() {
  // Usar nuestro cliente personalizado para Server Actions
  const supabase = await createServerActionClient()

  try {
    // Verificar si hay una sesión activa
    const { data, error } = await supabase.auth.getSession()
    
    // Si hay error, log y retorno
    if (error) {
      console.error('Error al verificar sesión:', error.message)
      return { 
        status: 'error',
        message: `Error: ${error.message}`,
      }
    }
    
    // Si hay sesión, redirigir al dashboard
    if (data?.session) {
      redirect('/dashboard')
    }
    
    // Si no hay sesión, devolver información
    return { 
      status: 'not_authenticated',
      message: 'No se ha encontrado una sesión activa'
    }
  } catch (err) {
    console.error('Error grave:', err)
    return { 
      status: 'error',
      message: 'Error interno al verificar autenticación'
    }
  }
}

/**
 * Redirección con limpieza de cookies
 * Esta función se usa en la página de login para reiniciar el estado de autenticación
 */
export async function cleanAuthCookies(): Promise<void> {
  // Usando un cliente de Supabase para limpiar la sesión
  try {
    // Usar nuestro cliente personalizado para Server Actions
    const supabase = await createServerActionClient()

    // Intentar cerrar la sesión con Supabase, que limpia automáticamente las cookies
    await supabase.auth.signOut()

    // Redireccionar a la página de login
    // La redirección provoca que el navegador recargue la página y reciba las cookies limpias
    redirect('/my-club?reset=true')
  } catch (err) {
    console.error('Error al limpiar sesión:', err)
    // En caso de error, redirigir igualmente
    redirect('/my-club?error=reset')
  }
}
