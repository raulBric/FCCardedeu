"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Equipo from "@/assets/Equipo3.webp";
import Equipo1 from "@/assets/Equipo1.webp";
import Equipo2 from "@/assets/Equipo2.webp";
import Equipo3 from "@/assets/Equipo4.webp";

// Imágenes del carrusel
const imatges = [
  {
    src: Equipo,
    alt: "Primera plantilla del FC Cardedeu",
    titol: "Viu la Passió amb FC Cardedeu!",
  },
  {
    src: Equipo1,
    alt: "Aficionats del FC Cardedeu",
    titol: "Units per un sentiment!",
  },
  {
    src: Equipo2,
    alt: "Entrenament del FC Cardedeu",
    titol: "Formant campions des de 1916",
  },
  {
    src: Equipo3,
    alt: "Estadi del FC Cardedeu",
    titol: "El nostre camp, la nostra fortalesa",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true);

    // Limpiar al desmontar
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay(); // Limpiar cualquier intervalo existente

    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imatges.length);
    }, 5000);
  }, [stopAutoplay, setCurrentIndex]);
  
  // Configurar autoplay solo en el cliente
  useEffect(() => {
    if (isClient) {
      startAutoplay();

      // Pausar cuando la página no está visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          startAutoplay();
        } else {
          stopAutoplay();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        stopAutoplay();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [isClient, startAutoplay, stopAutoplay]);

  // Navegación
  const handlePrev = () => {
    stopAutoplay();
    setCurrentIndex((prev) => (prev - 1 + imatges.length) % imatges.length);
    // Reiniciar autoplay después de un tiempo
    setTimeout(() => startAutoplay(), 10000);
  };

  const handleNext = () => {
    stopAutoplay();
    setCurrentIndex((prev) => (prev + 1) % imatges.length);
    // Reiniciar autoplay después de un tiempo
    setTimeout(() => startAutoplay(), 10000);
  };

  const handleDotClick = (index: number) => {
    stopAutoplay();
    setCurrentIndex(index);
    // Reiniciar autoplay después de un tiempo
    setTimeout(() => startAutoplay(), 10000);
  };

  // Función para manejar gestos táctiles
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const difference = touchStartX.current - touchEndX.current;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      suppressHydrationWarning
    >
      {/* Contenedor de imágenes */}
      <div className="relative h-full w-full">
        {imatges.map((imatge, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={typeof imatge.src === 'string' ? imatge.src : imatge.src?.src || "/placeholder.svg"}
              alt={imatge.alt}
              fetchPriority={index === 0 ? "high" : "low"}
              loading={index === 0 ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            {/* Degradado solo en la parte inferior */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>

            {/* Título en la parte inferior */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-24 px-4">
              <h1 className="text-4xl md:text-7xl font-bold text-white text-center drop-shadow-lg">
                {imatge.titol}
              </h1>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      <div className="absolute z-20 inset-0 flex items-center justify-between px-4 pointer-events-none">
        <Button
          onClick={handlePrev}
          size="icon"
          variant="ghost"
          className="rounded-full bg-black/30 hover:bg-black/50 text-white pointer-events-auto"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          onClick={handleNext}
          size="icon"
          variant="ghost"
          className="rounded-full bg-black/30 hover:bg-black/50 text-white pointer-events-auto"
          aria-label="Siguiente imagen"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {imatges.map((_, index) => (
          <Button
            key={index}
            onClick={() => handleDotClick(index)}
            size="icon"
            variant="ghost"
            className={`w-3 h-3 p-0 min-w-0 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white hover:bg-white/90 scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
