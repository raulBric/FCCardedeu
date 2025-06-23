"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import CardedeuLogo from "@/assets/Escudo.png"
import PlaceholderLogo from "@/assets/blindaje.webp"
import Adidas from "@/assets/Patrocinadores/Adidas.png"
import FutbolEmotion from "@/assets/Patrocinadores/FutbolEmotion.svg"
import Damm from "@/assets/Patrocinadores/damm.png"

const matchResults = [
  {
    id: 1,
    date: "10 Marzo 2025",
    homeTeam: "FC Cardedeu",
    awayTeam: "CF Granollers",
    homeScore: 3,
    awayScore: 1,
    homeLogo: CardedeuLogo,
    awayLogo: PlaceholderLogo,
    sponsor: { name: "McDonald's", logo: Adidas, url: "https://www.mcdonalds.es" },
  },
  {
    id: 2,
    date: "17 Marzo 2025",
    homeTeam: "FC Cardedeu",
    awayTeam: "Unió Esportiva Vic",
    homeScore: 2,
    awayScore: 2,
    homeLogo: CardedeuLogo,
    awayLogo: PlaceholderLogo,
    sponsor: { name: "Adidas", logo: FutbolEmotion, url: "https://www.adidas.com" },
  },
  {
    id: 3,
    date: "24 Marzo 2025",
    homeTeam: "FC Cardedeu",
    awayTeam: "FC La Torreta",
    homeScore: 1,
    awayScore: 0,
    homeLogo: CardedeuLogo,
    awayLogo: PlaceholderLogo,
    sponsor: { name: "Coca-Cola", logo: Damm, url: "https://www.cocacola.es" },
  },
]

export default function MatchResultsSection() {
  const [activeTab, setActiveTab] = useState<'recientes' | 'próximos'>('recientes')
  const [currentIndex, setCurrentIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  // Control para el slider de partidos
  const handleNextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, matchResults.length - 1))
  }

  const handlePrevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  // Efectos de animación y visibilidad de slides para móvil
  useEffect(() => {
    if (sliderRef.current && window.innerWidth < 768) { // Solo para móvil
      const slideWidth = sliderRef.current.querySelector('.mobile-slide')?.clientWidth || 0;
      const gap = 24; // 6 rem
      const scrollAmount = currentIndex * (slideWidth + gap);
      
      sliderRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex])

  // Indicador de posición actual
  const renderIndicators = () => (
    <div className="flex items-center justify-center mt-6 gap-2">
      {matchResults.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentIndex(idx)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            idx === currentIndex ? 'bg-red-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Ir al partido ${idx + 1}`}
        />
      ))}
    </div>
  )

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-20 relative bg-gradient-to-b from-white to-gray-50"
    >
      {/* Adorno de fondo */}
      <div className="absolute top-0 inset-x-0 h-24 bg-red-700 opacity-5 rounded-b-[100%] transform -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header con título y selector de tabs */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12">
            <motion.h2
              initial={{ x: -40, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -40, opacity: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
              className="text-3xl md:text-4xl font-extrabold text-gray-800 relative inline-block mb-4 md:mb-0"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-600">
                Resultados y Partidos
              </span>
              <div className="absolute -bottom-1 left-0 w-12 h-1 bg-red-600 rounded-full"></div>
            </motion.h2>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gray-100 p-1 rounded-full flex shadow-sm">
              <button
                onClick={() => setActiveTab('recientes')}
                className={`text-sm md:text-base font-medium py-1.5 md:py-2 px-4 md:px-6 rounded-full transition-all ${activeTab === 'recientes' 
                  ? 'bg-white text-red-700 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Últimos partidos
              </button>
              <button
                onClick={() => setActiveTab('próximos')}
                className={`text-sm md:text-base font-medium py-1.5 md:py-2 px-4 md:px-6 rounded-full transition-all ${activeTab === 'próximos' 
                  ? 'bg-white text-red-700 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Próximos partidos
              </button>
            </motion.div>
          </div>
          
          {/* Vista móvil con carrusel */}
          <div className="md:hidden">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
              className="relative"
            >
              <div className="overflow-hidden">
                <div 
                  ref={sliderRef}
                  className="flex gap-6 transition-all pb-2 overflow-x-auto scrollbar-hide"
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {matchResults.map((match) => (
                    <div 
                      key={match.id}
                      className="mobile-slide w-[85%] flex-shrink-0"
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      <MatchCard match={match} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          
            {/* Controles de navegación e indicadores para móvil */}
            <div className="mt-6">
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentIndex === 0}
                  className={`bg-white p-2 rounded-full shadow-md flex items-center justify-center transition-all ${currentIndex === 0 ? 'opacity-50 text-gray-400' : 'text-red-700 hover:bg-red-50'}`}
                  aria-label="Partido anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {renderIndicators()}

                <button
                  onClick={handleNextSlide}
                  disabled={currentIndex >= matchResults.length - 1}
                  className={`bg-white p-2 rounded-full shadow-md flex items-center justify-center transition-all ${currentIndex >= matchResults.length - 1 ? 'opacity-50 text-gray-400' : 'text-red-700 hover:bg-red-50'}`}
                  aria-label="Siguiente partido"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Vista desktop con grid estático */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
            className="hidden md:block"
          >
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {matchResults.map((match) => (
                <div key={match.id} className="transform transition-all duration-300 hover:-translate-y-1">
                  <MatchCard match={match} />
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-10 text-center"
          >
            <Link href="/partidos" className="inline-flex items-center gap-1 py-2.5 px-5 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium transition-all transform hover:-translate-y-0.5 hover:shadow-md">
              Ver todos los partidos
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Componente de tarjeta único para ambas vistas
function MatchCard({ match }: { match: (typeof matchResults)[0] }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden shadow-lg border border-red-100 h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Header con la fecha */}
      <div className="bg-gradient-to-r from-red-700 to-red-800 text-white py-2 px-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">{match.date}</p>
          <span className="text-xs px-2 py-1 bg-white/20 rounded-full">Finalizado</span>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="p-4">
        <div className="grid grid-cols-11 items-center gap-2">
          {/* Equipo local */}
          <div className="col-span-4 flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white p-2 shadow-inner flex items-center justify-center mb-2">
              <img
                src={typeof match.homeLogo === 'string' ? match.homeLogo : match.homeLogo?.src || "/placeholder.svg"}
                alt={match.homeTeam}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="text-gray-800 text-sm md:text-base font-bold text-center leading-tight">
              {match.homeTeam}
            </h3>
          </div>

          {/* Marcador */}
          <div className="col-span-3 py-3">
            <div className="flex items-center justify-center bg-white rounded-lg shadow-md px-2 py-3">
              <span className={`text-2xl md:text-3xl font-black ${match.homeScore > match.awayScore ? 'text-red-600' : 'text-gray-700'}`}>
                {match.homeScore}
              </span>
              <span className="text-gray-400 mx-2 text-xl font-light">-</span>
              <span className={`text-2xl md:text-3xl font-black ${match.awayScore > match.homeScore ? 'text-red-600' : 'text-gray-700'}`}>
                {match.awayScore}
              </span>
            </div>
          </div>

          {/* Equipo visitante */}
          <div className="col-span-4 flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white p-2 shadow-inner flex items-center justify-center mb-2">
              <img
                src={typeof match.awayLogo === 'string' ? match.awayLogo : match.awayLogo?.src || "/placeholder.svg"}
                alt={match.awayTeam}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="text-gray-800 text-sm md:text-base font-bold text-center leading-tight">
              {match.awayTeam}
            </h3>
          </div>
        </div>
      </div>

      {/* Footer con patrocinador */}
      <div className="mt-auto border-t border-gray-100 bg-gray-50 p-3">
        <div className="flex items-center justify-center">
          <span className="text-xs text-gray-500 mr-2">Patrocinado por:</span>
          <Link 
            href={match.sponsor.url} 
            target="_blank" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={typeof match.sponsor.logo === 'string' ? match.sponsor.logo : match.sponsor.logo?.src || "/placeholder.svg"}
              alt={match.sponsor.name}
              className="h-10 w-auto object-contain"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

