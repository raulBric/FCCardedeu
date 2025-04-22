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
  const [currentMatchIndex, setCurrentMatchIndex] = useState(1)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  const [isDragging, setIsDragging] = useState(false)

  // Solo para móvil: navegación entre partidos
  const handleNextMatch = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % matchResults.length)
  }

  const handlePrevMatch = () => {
    setCurrentMatchIndex((prev) => (prev - 1 + matchResults.length) % matchResults.length)
  }

  // Control de deslizamiento en mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    const difference = touchStartX.current - touchEndX.current

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        handleNextMatch() // Deslizar a la izquierda (siguiente)
      } else {
        handlePrevMatch() // Deslizar a la derecha (anterior)
      }
    }
  }

  // Efecto para desplazar el carrusel al cambiar el índice (solo móvil)
  useEffect(() => {
    if (carouselRef.current) {
      const scrollPosition = currentMatchIndex * carouselRef.current.offsetWidth
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }, [currentMatchIndex])

  // Controles de navegación (solo para móvil)
  const renderMobileNavControls = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="flex justify-center items-center gap-4 mt-6"
    >
      <button
        onClick={handlePrevMatch}
        className="bg-white p-2 rounded-full shadow-md text-red-700 hover:bg-red-50 transition-colors"
        aria-label="Partido anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="flex space-x-2">
        {matchResults.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentMatchIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentMatchIndex ? "bg-red-700" : "bg-gray-300"
            }`}
            aria-label={`Ver partido ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={handleNextMatch}
        className="bg-white p-2 rounded-full shadow-md text-red-700 hover:bg-red-50 transition-colors"
        aria-label="Siguiente partido"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </motion.div>
  )

  return (
    <section ref={sectionRef} className="py-10 lg:py-24 bg-gray-50 relative text-center">
      <div className="container mx-auto px-4">
        {/* Versión móvil con carrusel deslizable */}
        <div className="sm:hidden">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.4,
              type: "spring",
              stiffness: 50,
            }}
            ref={carouselRef}
            className="flex overflow-hidden w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ scrollSnapType: "x mandatory" }}
          >
            {matchResults.map((match) => (
              <div
                key={match.id}
                className="min-w-full flex-shrink-0 flex justify-center px-4"
                style={{ scrollSnapAlign: "center" }}
              >
                <div className="w-full">
                  <MatchCard match={match} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Controles de navegación para móvil */}
          {renderMobileNavControls()}
        </div>

        {/* Versión desktop: mostrar todas las tarjetas con la del medio destacada */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            type: "spring",
            stiffness: 50,
          }}
          className="hidden sm:flex justify-center items-center gap-6"
        >
          {matchResults.map((match, index) => (
            <div
              key={match.id}
              className={`transition-transform duration-300 ${
                index === 1 ? "transform scale-110 z-10 shadow-xl" : "scale-95 opacity-90"
              }`}
              style={{
                width: index === 1 ? "33%" : "30%",
                maxWidth: index === 1 ? "400px" : "350px",
              }}
            >
              <MatchCard match={match} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Componente de tarjeta único para ambas vistas
function MatchCard({ match }: { match: (typeof matchResults)[0] }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 border border-gray-200 h-full">
      {/* Fecha del partido */}
      <p className="text-gray-700 text-lg font-semibold mb-4">{match.date}</p>

      {/* Equipos y resultado */}
      <div className="flex items-center justify-between w-full">
        {/* Equipo local */}
        <div className="flex flex-col items-center w-1/3">
          <Image
            src={match.homeLogo || "/placeholder.svg"}
            alt={match.homeTeam}
            width={80}
            height={80}
            className="object-contain"
          />
          <span className="text-gray-800 text-sm sm:text-base font-semibold text-center min-h-[40px]">
            {match.homeTeam}
          </span>
        </div>

        {/* Marcador */}
        <div className="text-red-700 text-4xl sm:text-5xl font-extrabold w-1/3 text-center">
          {match.homeScore} - {match.awayScore}
        </div>

        {/* Equipo visitante */}
        <div className="flex flex-col items-center w-1/3">
          <Image
            src={match.awayLogo || "/placeholder.svg"}
            alt={match.awayTeam}
            width={80}
            height={80}
            className="object-contain"
          />
          <span className="text-gray-800 text-sm sm:text-base font-semibold text-center min-h-[40px]">
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* Sponsor del partido */}
      <div className="mt-6 flex flex-col items-center">
        <p className="text-sm text-gray-600 mb-2">Patrocinado por:</p>
        <Link href={match.sponsor.url} target="_blank" className="block w-32 h-16 relative">
          <Image
            src={match.sponsor.logo || "/placeholder.svg"}
            alt={match.sponsor.name}
            fill
            className="object-contain"
          />
        </Link>
      </div>
    </div>
  )
}

