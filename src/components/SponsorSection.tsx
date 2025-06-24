"use client"

import { useRef, useEffect, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import Roca from "@/assets/Patrocinadores/RovaVillage.webp"
import Adidas from "@/assets/Patrocinadores/Adidas.png"
import Damm from "@/assets/Patrocinadores/damm.png"
import McDonalds from "@/assets/Patrocinadores/McDonalds.jpeg"
import FutbolEmotion from "@/assets/Patrocinadores/FutbolEmotion.svg"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface Sponsor {
  id: number
  name: string
  logo: StaticImageData | string
  url: string
}

// Datos de patrocinadores
const sponsorsData: Sponsor[] = [
  { 
    id: 1, 
    name: "Ajuntament de Cardedeu", 
    logo: Roca, 
    url: "https://www.cardedeu.cat"
  },
  { 
    id: 2, 
    name: "Adidas", 
    logo: Adidas, 
    url: "https://www.adidas.es"
  },
  { 
    id: 3, 
    name: "Damm", 
    logo: Damm, 
    url: "https://www.damm.com"
  },
  { 
    id: 4, 
    name: "McDonald's", 
    logo: McDonalds, 
    url: "https://www.mcdonalds.es"
  },
  { 
    id: 5, 
    name: "Adidas Training", 
    logo: Adidas, 
    url: "https://www.adidas.com/training"
  },
  { 
    id: 6, 
    name: "Grup Damm", 
    logo: Damm, 
    url: "https://www.damm.com"
  },
  { 
    id: 7, 
    name: "Futbol Emotion", 
    logo: FutbolEmotion, 
    url: "https://www.futbolemotion.com"
  },
]

export default function SponsorsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Determinar cuántas tarjetas mostrar por slide según el tamaño de pantalla
  const [slidesPerView, setSlidesPerView] = useState(3); // Por defecto 3 en desktop
  
  // Ajustar slidesPerView basado en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1); // Móvil: 1 tarjeta
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2); // Tablet: 2 tarjetas
      } else {
        setSlidesPerView(3); // Desktop: 3 tarjetas
      }
    };
    
    // Inicializar al cargar
    handleResize();
    
    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Crear grupos de patrocinadores según slidesPerView
  const createSlideGroups = () => {
    const slides = [];
    for (let i = 0; i < sponsorsData.length; i += slidesPerView) {
      slides.push(sponsorsData.slice(i, Math.min(i + slidesPerView, sponsorsData.length)));
    }
    return slides;
  };

  const slideGroups = createSlideGroups();
  const totalSlides = slideGroups.length;
  
  // Auto rotación del carrusel
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000); // Cambia cada 5 segundos
    
    return () => clearInterval(interval);
  }, [currentIndex, totalSlides, isPaused]);

  // Función para manejar el deslizamiento manual
  const handleSlide = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    }
  };

  // Mover el carrusel cuando cambia el índice o el tamaño de la ventana
  useEffect(() => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth / slideGroups.length;
      carouselRef.current.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
  }, [currentIndex, slideGroups.length, slidesPerView]);


  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-red-700 relative overflow-hidden"
      id="sponsors"
      aria-label="Patrocinadores del FC Cardedeu"
    >
      {/* Patrones decorativos para mejorar contraste y estética */}
      <div className="absolute inset-0 opacity-10 bg-pattern-overlay pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado con colores accesibles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-1">
            Els Nostres Patrocinadors
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          <p className="mt-4 text-lg leading-relaxed text-white/90 max-w-2xl mx-auto">
            Gràcies a tots els nostres patrocinadors pel seu suport al FC Cardedeu
          </p>
        </motion.div>

        {/* Carrusel de tarjetas de patrocinadores */}
        <div className="relative mx-auto max-w-5xl">
          {/* Controles de navegación */}
          <div className="absolute -left-4 md:-left-8 top-1/2 transform -translate-y-1/2 z-20">
            <button 
              onClick={() => handleSlide('prev')} 
              className="bg-white rounded-full p-2 text-red-700 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Patrocinador anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute -right-4 md:-right-8 top-1/2 transform -translate-y-1/2 z-20">
            <button 
              onClick={() => handleSlide('next')} 
              className="bg-white rounded-full p-2 text-red-700 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Siguiente patrocinador"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Control de pausa/reproducción */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={isPaused ? "Reproducir carrusel" : "Pausar carrusel"}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>

          {/* Contenedor del carrusel con overflow oculto */}
          <div className="overflow-hidden rounded-lg">
            {/* Contenedor deslizable con todos los slides */}
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out w-full"
              style={{ width: `${slideGroups.length * 100}%` }}
            >
              {slideGroups.map((group, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className="flex flex-col sm:flex-row w-full"
                  style={{ width: `${100 / slideGroups.length}%` }}
                >
                  {group.map((sponsor) => (
                    <div 
                      key={sponsor.id} 
                      className={`w-full ${slidesPerView === 3 ? 'lg:w-1/3' : slidesPerView === 2 ? 'sm:w-1/2' : 'w-full'} p-3`}
                    >
                      <Link 
                        href={sponsor.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="flex-grow flex items-center justify-center py-4">
                            <div className="relative w-full h-32">
                              <Image
                                src={typeof sponsor.logo === 'string' ? sponsor.logo : sponsor.logo?.src || "/placeholder.svg"}
                                alt={sponsor.name}
                                fill
                                loading="lazy"
                                style={{ objectFit: 'contain' }}
                                className="transition-transform duration-300"
                              />
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                            <h3 className="text-base font-medium text-gray-900">{sponsor.name}</h3>
                          </div>
                        </motion.div>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de posición */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 ${currentIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                aria-label={`Ir al grupo de patrocinadores ${index + 1}`}
                aria-current={currentIndex === index ? "true" : "false"}
              />
            ))}
          </div>
        </div>

        {/* Botón CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mt-16"
        >
          <Link 
            href="/patrocini" 
            className="inline-block bg-white text-red-700 font-medium py-3 px-8 rounded-md transition-colors shadow-md hover:bg-gray-100"
          >
            Converteix-te en patrocinador
          </Link>
        </motion.div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"></div>
    </section>
  )
}
