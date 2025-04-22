"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir al dashboard
import Link from "next/link";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; // Importa el cliente de Supabase
import Escudo from "@/assets/Escudo.png";

export default function MyClubPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Inicializa useRouter para redirigir

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpia errores previos

    try {
      // Llama a Supabase para autenticar al usuario
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Correo o contraseña incorrectos.");
        console.error("Error de autenticación:", error.message);
        return;
      }

      console.log("Usuario autenticado:", data);
      // Redirige al dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Ha ocurrido un error. Inténtalo de nuevo más tarde.");
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
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-primary"
            />
          </div>

          {/* Mensaje de error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Botón de Login */}
          <button
            type="submit"
            className="w-full bg-club-primary text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md"
          >
            Iniciar Sesión
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
