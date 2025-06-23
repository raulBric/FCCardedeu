"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CardedeuLogo from "@/assets/Escudo.png";

// INICIO CÓDIGO TEMPORAL - ELIMINAR CUANDO SE QUITE EL MODO MANTENIMIENTO
export default function MaintenancePage() {
  const [clickCount, setClickCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  // Manejar clics en el escudo
  const handleLogoClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setShowMessage(true);
        
        // Redirigir después de un breve mensaje
        setTimeout(() => {
          setRedirecting(true);
          // Guardar en localStorage que ya ha accedido
          localStorage.setItem('fcCardedeuAccess', 'granted');
          // Redirigir a la página principal
          window.location.href = '/home';
        }, 1500);
      }
      return newCount;
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl mx-auto text-center">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            duration: 0.8 
          }}
          className="mb-8 mx-auto relative"
          onClick={handleLogoClick}
        >
          <div className={`relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 mx-auto cursor-pointer ${clickCount > 0 ? 'transform transition-transform active:scale-95' : ''}`}>
            <Image
              src={CardedeuLogo}
              alt="FC Cardedeu"
              fill
              className="object-contain"
              priority
            />
            
            {/* Efecto de púlsación */}
            <motion.div 
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ 
                opacity: [0.5, 0.8, 0.5], 
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 2,
              }}
              className="absolute inset-0 rounded-full bg-red-500 -z-10 opacity-20"
            />
          </div>
        </motion.div>
        
        {/* Mensaje de "Web en Mantenimiento" */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-red-700 mb-4">
            Web en Manteniment
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Estem treballant per oferir-te una millor experiència.
            <br />Tornarem molt aviat.
          </p>
          <div className="mb-10 px-4 py-3 bg-gray-100 inline-block rounded-lg text-gray-500 text-sm">
            <p className="font-mono">&#9201; Estimem tornar: <span className="font-bold">1 de Juliol, 2025</span></p>
          </div>
        </motion.div>
        
        {/* Contador de clics oculto y mensaje de acceso */}
        <div className="h-8">
          {showMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 font-medium"
            >
              {redirecting ? "Accedint..." : "Accés concedit!"}
            </motion.div>
          )}
        </div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-sm text-gray-500"
        >
          <p>FC Cardedeu &copy; {new Date().getFullYear()}</p>
          <p className="mt-1 text-xs">Per a consultes urgents: info@fccardedeu.cat</p>
        </motion.div>
      </div>
    </div>
  );
}
// FIN CÓDIGO TEMPORAL - ELIMINAR CUANDO SE QUITE EL MODO MANTENIMIENTO
