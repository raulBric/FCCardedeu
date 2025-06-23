"use client";

import { useState } from "react";
// import { DebugAuth } from "../debug-auth";
import { useRouter } from "next/navigation"; // Para redirigir al dashboard
import Link from "next/link";
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // Importa el cliente de Supabase
import Escudo from "@/assets/Escudo.png";
import Loading from "../loading"; // Importar componente de loading

// Importar acciones del servidor para verificar autenticación
import { checkAuthStatus, cleanAuthCookies } from "../actions/auth-check"

// Limpieza total de cookies/localStorage al entrar en la página de login
if (typeof window !== 'undefined') {
  // Función de limpieza extrema
  const purgeAuthStorage = () => {
    console.log('[AUTH RESET] Purga completa de datos de autenticación');
    // 1. Limpiar localStorage
    try {
      // Borrar explícitamente claves conocidas
      ['supabase.auth.token', 'sb-access-token', 'sb-refresh-token'].forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Limpiar cualquier item relacionado con Supabase
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}
    
    // 2. Limpiar cookies
    try {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.includes('supabase') || name.includes('sb-') || name === '__session') {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        }
      });
    } catch (e) {}
  };
  
  // Ejecutar limpieza inmediatamente
  purgeAuthStorage();
  
  // Forzar refresco único si venimos de parámetro específico
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('forceReset') && sessionStorage.getItem('authReset') !== 'done') {
    sessionStorage.setItem('authReset', 'done');
    window.location.href = '/my-club'; // Recargar sin el parámetro
  }
}

export default function MyClubPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFullLoading, setShowFullLoading] = useState(false); // Estado para mostrar loading completo
  const [loginAttempts, setLoginAttempts] = useState(0); // Contador de intentos de login
  const router = useRouter(); // Inicializa useRouter para redirigir

  // Función para limpiar todas las cookies de autenticación
  // const clearAuthCookies = () => {
  //   // Lista completa de posibles cookies de autenticación de Supabase
  //   const cookiesToClear = [
  //     'sb-access-token', 
  //     'sb-refresh-token', 
  //     'supabase-auth-token',
  //     'sb-provider-token',
  //     'sb-refresh-token-lifespan',
  //     '__supabase_session'
  //   ];
    
  //   cookiesToClear.forEach(name => {
  //     // Limpiar la cookie con diferentes combinaciones de path y domain para asegurar su eliminación
  //     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  //     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  //     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  //     console.log(`Limpiando cookie: ${name}`);
  //   });
    
  //   // También limpiar localStorage por si acaso
  //   try {
  //     localStorage.removeItem('supabase.auth.token');
  //     localStorage.removeItem('supabase.auth.refreshToken');
  //     console.log("%c[AUTH CLEANUP] LocalStorage limpiado", "color: purple;");
  //   } catch (e) {
  //     console.error("%c[AUTH CLEANUP ERROR] Error al limpiar localStorage:", "color: red;", e);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpia errores previos
    setLoading(true); // Indica que está procesando
    
    // Limpiar cookies antiguas o corruptas antes de intentar iniciar sesión
    // clearAuthCookies();
    
    // Mostrar el loading completo después de 500ms, para evitar parpadeos en autenticaciones rápidas
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        setShowFullLoading(true);
      }
    }, 500);

    // SOLUCIÓN: Limpiar cualquier cookie antigua antes de iniciar sesión
    // Esto resuelve conflictos entre versiones antiguas y nuevas de Supabase
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token'
    ];
    
    cookiesToClear.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      console.log(`Limpiando cookie: ${name}`);
    });

    // Modificamos estrategia para evitar el cierre de sesión previo
    // Esto puede interferir con el establecimiento correcto de la nueva sesión
    try {
      // Verificar si hay una sesión activa antes de intentar cerrarla
      const { data: session } = await supabase.auth.getSession();
      if (session && session.session) {
        console.log('%c[AUTH] Sesión activa detectada', 'color: orange; font-weight:bold;');
      } else {
        console.log('%c[AUTH] No hay sesión activa previa', 'color: teal; font-weight:bold;');
      }
      
      // Esperar 100ms para asegurar operaciones asíncronas completas
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (sessionErr) {
      console.warn('%c[AUTH] Error al verificar sesión previa', 'color: gray;', sessionErr);
    }

    try {
      localStorage.removeItem('supabase.auth.token');
    } catch {/* ignore storage errors */}
    

    // Configurar un timeout para el inicio de sesión (15 segundos)
    const loginTimeout = setTimeout(() => {
      if (loading) {
        console.log("%c[AUTH] Tiempo de espera agotado para el inicio de sesión", "color: blue; font-weight: bold;");
        setLoading(false);
        setError("La conexión está tardando demasiado. Comprueba tu conexión a internet e inténtalo de nuevo.");
      }
    }, 15000);

    try {
      // Incrementar contador de intentos para mejor debugging
      setLoginAttempts(prev => prev + 1);
      
      // Log más visible para el inicio del proceso de autenticación
      console.log("%c[AUTH] Intentando autenticación con:", "color: blue; font-weight: bold;", { 
        email, 
        passwordLength: password.length,
        attempts: loginAttempts + 1,
        timestamp: new Date().toISOString() 
      });

      // Usar un timeout para asegurar que todas las operaciones asíncronas anteriores han terminado
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Llama a Supabase para autenticar al usuario CON OPCIONES ESTRICTAS
      // para evitar intentos de reintento automáticos y autenticación anónima
      // Usamos opciones más agresivas: desactivar redirección pero mantener sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // Limpiar los timeouts ya que obtuvimos respuesta
      clearTimeout(loginTimeout);
      clearTimeout(loadingTimeout);
      setShowFullLoading(false);

      if (error) {
        // Log más visible para errores de autenticación - Mejorar diagnóstico mostrando objeto completo
        console.error("%c[AUTH ERROR] Fallo en autenticación:", "color: red; font-weight: bold; font-size: 14px;", error, { 
          details: {
            errorType: error.name,
            statusCode: error.status || 'unknown',
            email,
            timestamp: new Date().toISOString()
          }
        });
        
        // Mensaje descriptivo según el error o error por defecto si está vacío
        if (!error.message || Object.keys(error).length === 0) {
          console.warn("%c[AUTH] Error vacío detectado, posible problema con cookies o API", "color: orange; font-weight: bold");
          setError("Error de autenticación. Puede deberse a problemas de red o sesión. Inténtalo de nuevo.");
          
          // Esto podría ser un problema de sesión - hacemos limpieza adicional
          try {
            // Limpiar todas las cookies y localStorage de Supabase
            document.cookie.split(';').forEach(cookie => {
              const name = cookie.split('=')[0].trim();
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            });
            localStorage.clear(); // Limpieza completa en caso extremo
            console.log("%c[AUTH] Limpieza radical realizada", "color: purple; font-weight: bold");
          } catch (cleanupErr) {
            console.error("%c[AUTH] Error en limpieza final", "color: red", cleanupErr);
          }
        } else if (error.message.includes("Invalid login credentials")) {
          setError("Correo o contraseña incorrectos.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Email no confirmado. Por favor, verifica tu bandeja de entrada.");
        } else {
          setError(`Error de autenticación: ${error.message || 'Desconocido'}`); 
        }
        
        setLoading(false);
        return;
      }

      console.log("%c[AUTH SUCCESS] Usuario autenticado correctamente:", "color: green; font-weight: bold;", data.user?.email);
      
      // Registrar intento exitoso de login
      // await logLoginAttempt(data.user?.email || email, true);
      
      setLoading(false);
      setError(null);
      
      // Usar Server Action para verificar autenticación desde el servidor
      console.log("%c[AUTH REDIRECT] Usando Server Action para verificar sesión", "color: green; font-weight: bold;");
      
      // En lugar de redirigir directamente, usamos la acción del servidor
      // Esto garantiza que las cookies se establezcan correctamente en el servidor
      await checkAuthStatus();
      
      // Si llegamos aquí, significa que checkAuthStatus() no redirigió, por lo que hubo un problema
      // Intentamos la redirección directa como fallback
      console.log("%c[AUTH REDIRECT] Server Action no redirigió, intentando redirección directa", "color: orange;");
      window.location.href = '/dashboard';
      
      // Guardar credenciales exitosas por si acaso
      try {
        sessionStorage.setItem('fc-cardedeu-lastEmail', email);
      } catch (e) {/* Ignorar errores de storage */}
    } catch (err) {
      // Limpiar los timeouts ya que obtuvimos un error
      clearTimeout(loginTimeout);
      clearTimeout(loadingTimeout);
      
      // Manejo de errores generales no esperados
      console.error("%c[AUTH ERROR CRÍTICO] Error inesperado:", "color: darkred; font-weight: bold; font-size: 16px; background-color: lightyellow;", {
        error: err, 
        email,
        timestamp: new Date().toISOString()
      });
      
      // Mensajes específicos según el tipo de error de conexión
      if (err instanceof Error && err.message.includes('ENOTFOUND')) {
        setError("No se puede conectar con el servidor. Comprueba tu conexión a internet.");
      } else {
        setError("Ha ocurrido un error de conexión. Inténtalo de nuevo más tarde.");
      }
      
      setLoading(false);
      setShowFullLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row relative bg-club-dark">
      {/* Mostrar el componente de loading cuando está procesando la autenticación */}
      {showFullLoading && <Loading />}
      {/* 🔹 Botón "Volver" */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center space-x-2 text-white hover:text-gray-300 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Volver</span>
        </Link>
      </div>

      {/* 🔹 Sección Imagen */}
      <div className="md:w-2/3 w-full flex items-center justify-center bg-club-primary">
        <img
          src={Escudo.src}
          alt="FC Cardedeu"
          width="300"
          height="300"
          className="w-2/3 max-w-sm md:w-1/2 lg:w-1/3 xl:w-1/4"
          fetchPriority="high"
        />
      </div>

      {/* 🔹 Sección Login */}
      <div className="w-full md:w-1/3 bg-white p-8 flex flex-col justify-center">
        {/* 🏆 Título */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-club-primary">
            Acceso a MyClub
          </h2>
          <p className="text-gray-600 text-sm">
            Gestiona tu cuenta del FC Cardedeu
          </p>
        </div>

        {/* 📝 Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Campo Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-primary"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-primary"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Mensaje de error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Botón de Login */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-club-primary text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
          
          {/* Mensaje informativo sobre problemas de autenticación */}
          <div className="text-xs text-gray-500 mt-4 text-center">
            Si experimentas problemas para iniciar sesión, inténtalo en una ventana de navegación privada 
            o borra las cookies de este sitio.  
          </div>
        </form>

        {/* 🔗 Link "Olvidaste tu contraseña?" */}
        <div className="text-center mt-4">
          <Link
            href="/recuperar-clave"
            className="text-club-accent text-sm hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
