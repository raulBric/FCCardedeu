"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import CardedeuLogo from "@/assets/Escudo.png"
import PlaceholderLogo from "@/assets/blindaje.webp"
import Llorens from "@/assets/Patrocinadores/logo_llorens_verd.png"
import Informatica from "@/assets/Patrocinadores/CentreInformatic.png"
import Origo from "@/assets/Patrocinadores/OrigoBlau.png"
import Clinica from "@/assets/Patrocinadores/ClinicaPobleSec.png"

// Tipos para los partidos
interface Sponsor {
  name: string
  logo: any // StaticImageData | string
  url: string
}

interface Match {
  id: number
  date: string
  time?: string
  location?: string
  category?: string
  competition?: string
  status: 'finalizado' | 'próximo' | 'en_curso'
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  homeLogo: any
  awayLogo: any
  sponsor: Sponsor
}

// Datos de partidos
const matchResults: Match[] = [
  {
    id: 1,
    date: "10 Marzo 2025",
    time: "17:00",
    location: "Camp Municipal d'Esports",
    category: "Primera Catalana",
    competition: "Liga Regular",
    status: "finalizado",
    homeTeam: "FC Cardedeu",
    awayTeam: "CF Granollers",
    homeScore: 3,
    awayScore: 1,
    homeLogo: CardedeuLogo,
    awayLogo: PlaceholderLogo,
    sponsor: { name: "Llorens GMR", logo: Llorens, url: "https://llorensgmr.com/es/" },
  },
  {
    id: 2,
    date: "17 Marzo 2025",
    time: "18:30",
    location: "Camp Municipal d'Esports",
    category: "Primera Catalana",
    competition: "Liga Regular",
    status: "finalizado",
    homeTeam: "FC Cardedeu",
    awayTeam: "Unió Esportiva Vic",
    homeScore: 2,
    awayScore: 2,
    homeLogo: CardedeuLogo,
    awayLogo: PlaceholderLogo,
    sponsor: { name: "Centre Informàtic Poble Sec", logo: Informatica, url: "https://cips.cat/" },
  },
  {
    id: 3,
    date: "24 Marzo 2025",
    time: "12:00",
    location: "Camp Municipal d'Esports",
    category: "Primera Catalana",
    competition: "Liga Regular",
    status: "finalizado",
    homeTeam: "FC Cardedeu",
    awayTeam: "FC La Torreta",
    homeScore: 1,
    awayScore: 0,
    homeLogo: CardedeuLogo,
    awayLogo: PlaceholderLogo,
    sponsor: { name: "Origo", logo: Origo, url: "https://origo.cat/" },
  },
  {
    id: 4,
    date: "31 Marzo 2025",
    time: "16:00",
    location: "Camp Municipal d'Esports",
    category: "Primera Catalana",
    competition: "Copa Catalunya",
    status: "próximo",
    homeTeam: "FC Cardedeu",
    awayTeam: "UE Sant Celoni",
    homeLogo: CardedeuLogo,
    awayLogo: PlaceholderLogo,
    sponsor: { name: "Clínica Dental Poble Sec", logo: Clinica, url: "https://clinicadentalpoblesec.com/" },
  },
]

// Componente para la tarjeta de partido
function MatchCard({ match }: { match: Match }) {
  const { date, time, competition, status, homeTeam, awayTeam, homeScore, awayScore, homeLogo, awayLogo, sponsor, location } = match
  const isFinished = status === 'finalizado'

  return (
    <div className="flex flex-col bg-white rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full">
      {/* Header con liga y jornada */}
      <div className="bg-gray-100 px-4 py-3 text-xs text-center text-gray-700 font-medium border-b border-gray-200">
        {competition && competition.toUpperCase()}
        {competition && " · "}
        {location && location}
      </div>
      
      {/* Fecha/Entrenador */}
      <div className="text-center text-xs py-2 text-gray-500">
        {date}
      </div>
      
      {/* Equipos y resultado */}
      <div className="flex items-center justify-between px-4 py-5 flex-1">
        {/* Equipo local */}
        <div className="flex flex-col items-center w-2/5">
          <div className="h-16 w-16 relative mb-2">
            <Image 
              src={homeLogo} 
              alt={homeTeam}
              fill
              className="object-contain"
            />
          </div>
          <div className="text-sm text-center font-medium">{homeTeam}</div>
        </div>
        
        {/* Resultado */}
        <div className="flex items-center justify-center w-1/5">
          {isFinished ? (
            <div className="flex gap-1 items-center">
              <span className="font-bold text-2xl">{homeScore}</span>
              <span className="text-gray-400 mx-1">-</span>
              <span className="font-bold text-2xl">{awayScore}</span>
            </div>
          ) : (
            <div className="text-sm font-semibold text-gray-500">{time}h</div>
          )}
        </div>
        
        {/* Equipo visitante */}
        <div className="flex flex-col items-center w-2/5">
          <div className="h-16 w-16 relative mb-2">
            <Image 
              src={awayLogo} 
              alt={awayTeam}
              fill
              className="object-contain"
            />
          </div>
          <div className="text-sm text-center font-medium">{awayTeam}</div>
        </div>
      </div>
      
      {/* Patrocinador */}
      <div className="bg-gray-100 px-2 py-2 flex items-center justify-center border-t border-gray-200">
        <span className="text-[10px] text-gray-600 mr-1 font-medium">Patrocinado por</span>
        <div className="h-5 w-16 relative">
          <Image 
            src={sponsor.logo} 
            alt={sponsor.name}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

// Componente principal
export default function MatchResultsSection() {
  const [activeTab, setActiveTab] = useState<'finalizado' | 'próximo'>('finalizado')
  const [startIndex, setStartIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true })
  
  // Filtrar partidos por estado
  const filteredMatches = matchResults.filter(match => match.status === activeTab)
  
  // Control de slides
  const maxSlidesVisible = 3
  const totalSlides = filteredMatches.length
  
  // Navegar entre grupos de 3 tarjetas
  const nextSlide = () => {
    setStartIndex(prev => Math.min(prev + maxSlidesVisible, totalSlides - maxSlidesVisible))
  }
  
  const prevSlide = () => {
    setStartIndex(prev => Math.max(prev - maxSlidesVisible, 0))
  }
  
  // Reset al cambiar de tab
  useEffect(() => {
    setStartIndex(0)
  }, [activeTab])
  
  // Visibles actualmente
  const visibleMatches = filteredMatches.slice(
    startIndex,
    Math.min(startIndex + maxSlidesVisible, totalSlides)
  )

  return (
    <section 
      ref={sectionRef} 
      className="py-10 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        {/* Título y tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-2xl font-bold mb-4 md:mb-0"
          >
            Resultados y partidos
          </motion.h2>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('finalizado')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'finalizado' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Últimos resultados
            </button>
            <button 
              onClick={() => setActiveTab('próximo')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'próximo' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Próximos partidos
            </button>
          </div>
        </div>
        
        {/* Carrusel */}
        <div className="relative">
          {/* Botones de navegación */}
          {totalSlides > maxSlidesVisible && (
            <>
              <button 
                onClick={prevSlide} 
                disabled={startIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white shadow-md ${
                  startIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Ver partidos anteriores"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                onClick={nextSlide} 
                disabled={startIndex + maxSlidesVisible >= totalSlides}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white shadow-md ${
                  startIndex + maxSlidesVisible >= totalSlides ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Ver más partidos"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        
          {/* Tarjetas de partidos */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {visibleMatches.length > 0 ? (
              visibleMatches.map(match => (
                <motion.div 
                  key={match.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <MatchCard match={match} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 md:col-span-3 p-8 bg-white rounded-md text-center text-gray-500">
                No hay partidos {activeTab === 'finalizado' ? 'finalizados' : 'programados'} disponibles
              </div>
            )}
          </div>
          
          {/* Carrusel para móvil - solo visible en pantallas pequeñas */}
          <div className="block sm:hidden relative overflow-hidden px-2">
            {filteredMatches.length > 0 ? (
              <div>
                <motion.div
                  key={`mobile-${activeTab}-${startIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full"
                >
                  <MatchCard match={filteredMatches[startIndex]} />
                </motion.div>
                
                {/* Controles para móvil */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setStartIndex(prev => Math.max(prev - 1, 0))}
                    disabled={startIndex === 0}
                    className={`p-2 rounded-full ${startIndex === 0 ? 'text-gray-300 bg-gray-100' : 'text-gray-700 bg-white shadow-md'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                      <button
                        key={`dot-${idx}`}
                        onClick={() => setStartIndex(idx)}
                        className={`h-2 rounded-full transition-all ${startIndex === idx ? 'w-6 bg-red-600' : 'w-2 bg-gray-300'}`}
                        aria-label={`Ver partido ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setStartIndex(prev => Math.min(prev + 1, totalSlides - 1))}
                    disabled={startIndex === totalSlides - 1}
                    className={`p-2 rounded-full ${startIndex === totalSlides - 1 ? 'text-gray-300 bg-gray-100' : 'text-gray-700 bg-white shadow-md'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white rounded-md text-center text-gray-500">
                No hay partidos {activeTab === 'finalizado' ? 'finalizados' : 'programados'} disponibles
              </div>
            )}
          </div>
          
          {/* Indicadores de posición si hay más de un grupo de tarjetas (versión desktop) */}
          {totalSlides > maxSlidesVisible && (
            <div className="hidden sm:flex justify-center mt-6 gap-2">
              {Array.from({ length: Math.ceil(totalSlides / maxSlidesVisible) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStartIndex(idx * maxSlidesVisible)}
                  className={`h-2 rounded-full transition-all ${
                    idx === Math.floor(startIndex / maxSlidesVisible) 
                      ? 'w-6 bg-red-600' 
                      : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Ver grupo de partidos ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Ver todos */}
        <div className="text-center mt-8">
          <Link 
            href="/partidos" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Ver todos los partidos
          </Link>
        </div>
      </div>
    </section>
  )
}
