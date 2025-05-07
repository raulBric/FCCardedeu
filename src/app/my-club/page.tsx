"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir al dashboard
import Link from "next/link";
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; // Importa el cliente de Supabase
import Escudo from "@/assets/Escudo.png";
import { logLoginAttempt } from "@/app/actions/auth"; // Importar función de registro de login

export default function MyClubPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Inicializa useRouter para redirigir

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpia errores previos
    setLoading(true); // Indica que está procesando

    // Configurar un timeout para el inicio de sesión (15 segundos)
    const loginTimeout = setTimeout(() => {
      if (loading) {
        console.log("Tiempo de espera agotado para el inicio de sesión");
        setLoading(false);
        setError("La conexión está tardando demasiado. Comprueba tu conexión a internet e inténtalo de nuevo.");
      }
    }, 15000);

    try {
      console.log("Intentando autenticar con:", { email, passwordLength: password.length });
      
      // Llama a Supabase para autenticar al usuario
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Limpiar el timeout ya que obtuvimos respuesta
      clearTimeout(loginTimeout);

      if (error) {
        console.error("Error de autenticación:", error.message, error.code);
        
        // Mensaje más descriptivo según el error
        if (error.message.includes("Invalid login credentials")) {
          setError("Correo o contraseña incorrectos.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Email no confirmado. Por favor, verifica tu bandeja de entrada.");
        } else {
          setError(`Error: ${error.message}`);
        }
        
        // Registrar intento fallido de login
        await logLoginAttempt(email, false, `Error: ${error.message}`);
        
        setLoading(false);
        return;
      }

      console.log("Usuario autenticado correctamente:", data.user?.email);
      
      // Registrar intento exitoso de login
      await logLoginAttempt(data.user?.email || email, true);
      
      setLoading(false);
      setError(null);
      
      // Redirigir directamente al dashboard sin mostrar alerta
      router.push("/dashboard");
    } catch (err) {
      // Limpiar el timeout ya que obtuvimos un error
      clearTimeout(loginTimeout);
      
      console.error("Error inesperado durante login:", err);
      
      // Mensajes específicos según el tipo de error de conexión
      if (err instanceof Error && err.message.includes('ENOTFOUND')) {
        setError("No se puede conectar con el servidor. Comprueba tu conexión a internet.");
      } else {
        setError("Ha ocurrido un error de conexión. Inténtalo de nuevo más tarde.");
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row relative bg-club-dark">
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
        <Image
          src={Escudo}
          alt="FC Cardedeu"
          className="w-2/3 max-w-sm md:w-1/2 lg:w-1/3 xl:w-1/4"
          priority
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
