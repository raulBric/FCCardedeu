"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MaintenancePage from "@/components/MaintenancePage";

// INICIO CÓDIGO TEMPORAL - ELIMINAR CUANDO SE QUITE EL MODO MANTENIMIENTO
export default function Home() {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window !== "undefined") {
      const accessGranted = localStorage.getItem('fcCardedeuAccess') === 'granted';
      setHasAccess(accessGranted);
      
      if (accessGranted) {
        router.replace('/home');
      }
      
      setIsLoading(false);
    }
  }, [router]);

  // Mostrar un estado de carga mientras verificamos el acceso
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-red-700 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si el usuario ya ha completado el "ritual" de los 3 clics, lo redirigimos
  // La redirección ocurre en el useEffect
  return <MaintenancePage />;
}
// FIN CÓDIGO TEMPORAL - ELIMINAR CUANDO SE QUITE EL MODO MANTENIMIENTO
