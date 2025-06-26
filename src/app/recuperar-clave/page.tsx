"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Escudo from "@/assets/Escudo.webp";

export default function RecuperarClavePage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Configurar un timeout para la solicitud (10 segundos)
    const recoveryTimeout = setTimeout(() => {
      if (loading) {
        console.log("Tiempo de espera agotado para recuperar contraseña");
        setLoading(false);
        setError("La conexión está tardando demasiado. Comprueba tu conexión a internet e inténtalo de nuevo.");
      }
    }, 10000);

    try {
      console.log("Enviando solicitud de recuperación para:", email);
      
      // Solicitar restablecimiento de contraseña a través de Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`, // Futura página para restablecer contraseña
      });
      
      // Limpiar el timeout ya que obtuvimos respuesta
      clearTimeout(recoveryTimeout);

      if (error) {
        console.error("Error al enviar email de recuperación:", error.message);
        setError(`No se pudo enviar el email de recuperación: ${error.message}`);
        setLoading(false);
        return;
      }

      // Éxito - mostrar mensaje y reiniciar formulario
      console.log("Email de recuperación enviado correctamente");
      setLoading(false);
      setSent(true);
      setEmail("");
    } catch (err) {
      // Limpiar el timeout ya que obtuvimos un error
      clearTimeout(recoveryTimeout);
      
      console.error("Error inesperado durante recuperación:", err);
      setError("Ha ocurrido un error. Inténtalo de nuevo más tarde.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row relative bg-club-dark">
      {/* 🔹 Botón "Volver" */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/my-club"
          className="flex items-center space-x-2 text-white hover:text-gray-300 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Volver al login</span>
        </Link>
      </div>

      {/* 🔹 Sección Imagen */}
      <div className="md:w-2/3 w-full flex items-center justify-center bg-club-primary">
        <img
          src={Escudo.src}
          alt="FC Cardedeu"
          className="w-2/3 max-w-sm md:w-1/2 lg:w-1/3 xl:w-1/4"
          fetchPriority="high"
          width="300"
          height="300"
        />
      </div>

      {/* 🔹 Sección Recuperación */}
      <div className="w-full md:w-1/3 bg-white p-8 flex flex-col justify-center">
        {sent ? (
          /* Mensaje de éxito */
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold text-club-primary">
              Email enviado
            </h2>
            <p className="text-gray-600">
              Se ha enviado un enlace de recuperación a tu correo electrónico.
              Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <button
              onClick={() => router.push("/my-club")}
              className="w-full bg-club-primary text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md mt-4"
            >
              Volver al login
            </button>
          </div>
        ) : (
          /* Formulario de recuperación */
          <>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-club-primary">
                Recuperar contraseña
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Introduce tu email y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            <form onSubmit={handleRecovery} className="space-y-5">
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

              {/* Mensaje de error */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={loading || !email}
                className={`w-full bg-club-primary text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md ${
                  (loading || !email) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
