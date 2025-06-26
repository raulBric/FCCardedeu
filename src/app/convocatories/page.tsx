"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Plane, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/services/supabaseService";

interface Convocatoria {
  id: number;
  team: string;
  opponent: string;
  date: string;
  matchTime: string;
  callTime: string;
  location: string;
  locationLink: string;
  title?: string;
  meetingPoint?: string;
  notes?: string;
  status?: string;
}

const teams: string[] = [
  "Primer Equip",
  "Juvenil A",
  "Juvenil B",
  "Cadet A",
  "Cadet B",
  "Infantil A",
  "Infantil B",
  "Aleví A",
  "Aleví B",
  "Benjamí A",
  "Benjamí B",
];

// Los datos ahora vendrán de Supabase

// Datos de patrocinadores con rutas relativas a las imágenes
const sponsorsData = [
  { 
    id: 1, 
    name: "Llorens GMR", 
    imagePath: "/images/patrocinadores/logo_llorens_verd.png", 
    url: "https://llorensgmr.com/es/",
    description: "Gestor de material reciclatge"
  },
  { 
    id: 2, 
    name: "Centre Informàtic Poble Sec", 
    imagePath: "/images/patrocinadores/CentreInformatic.png", 
    url: "https://cips.cat/",
    description: "Solucions informàtiques"
  },
  { 
    id: 3, 
    name: "Gabident", 
    imagePath: "/images/patrocinadores/Gabident_test.png", 
    url: "https://clinicagabidentcardedeu.com/",
    description: "Clínica dental "
  },
  { 
    id: 4, 
    name: "Clínica Dental Poble Sec", 
    imagePath: "/images/patrocinadores/ClinicaPobleSec.png", 
    url: "https://clinicadentalpoblesec.com/",
    description: "Clínica dental "
  },
  { 
    id: 5, 
    name: "Origo", 
    imagePath: "/images/patrocinadores/OrigoBlau.png", 
    url: "https://origo.cat/",
    description: "Comerç al detall d\'alimentació"
  },
];

// Componente de publicidad con patrocinador aleatorio - Diseño elegante y moderno
function RandomSponsorCard() {
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Iniciar con un patrocinador aleatorio y rotar cada 6 segundos
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sponsorsData.length);
    setCurrentSponsorIndex(randomIndex);
    
    // Solo rotar cuando no está el mouse encima
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentSponsorIndex((prevIndex) => 
          prevIndex === sponsorsData.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isHovered]);
  
  const currentSponsor = sponsorsData[currentSponsorIndex];
  
  // Funciones para navegar manualmente entre patrocinadores
  const goToNext = () => {
    setCurrentSponsorIndex((prev) => 
      prev === sponsorsData.length - 1 ? 0 : prev + 1
    );
  };
  
  const goToPrevious = () => {
    setCurrentSponsorIndex((prev) => 
      prev === 0 ? sponsorsData.length - 1 : prev - 1
    );
  };
  
  return (
    <div 
      className="w-full mb-6 overflow-hidden group relative" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Panel principal con fondo blanco */}
      <div className="w-full bg-white border border-gray-100 rounded-xl shadow-xl p-4 overflow-hidden">
        <div className="absolute inset-0 bg-white z-0"></div>
        
        {/* Burbujas decorativas */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-50 rounded-full opacity-20"></div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-red-50 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-red-100 rounded-full opacity-20"></div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Logo con efecto de resalte - Solo aumentamos el tamaño de la imagen */}
            <div className="bg-white rounded-lg p-3 shadow-lg border-2 border-gray-100 flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <Image
                  src={currentSponsor.imagePath}
                  alt={`Logo ${currentSponsor.name}`}
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
            </div>
            
            {/* Información del patrocinador */}
            <div>
              <p className="text-xs uppercase tracking-wider font-medium text-red-600 mb-1">Col·laborador oficial</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {currentSponsor.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">{currentSponsor.description}</p>
            </div>
          </div>
          
          {/* Botón de visita */}
          <Link
            href={currentSponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2 text-sm font-medium group-hover:shadow-md w-full sm:w-auto justify-center mt-2 sm:mt-0"
          >
            <span>Descobreix més</span>
            <ExternalLink size={16} />
          </Link>
        </div>
        
        {/* Controladores e indicadores */}
        <div className="flex justify-center items-center mt-4 gap-2">
          {/* Botón anterior */}
          <button 
            onClick={(e) => { e.preventDefault(); goToPrevious(); }}
            className="w-7 h-7 rounded-full bg-white hover:bg-red-50 flex items-center justify-center border border-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Patrocinador anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          {/* Indicadores de posición */}
          <div className="flex gap-1.5">
            {sponsorsData.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.preventDefault(); setCurrentSponsorIndex(index); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSponsorIndex ? 'bg-red-600 w-4' : 'bg-gray-300 hover:bg-red-300'}`}
                aria-label={`Ir al patrocinador ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Botón siguiente */}
          <button 
            onClick={(e) => { e.preventDefault(); goToNext(); }}
            className="w-7 h-7 rounded-full bg-white hover:bg-red-50 flex items-center justify-center border border-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Siguiente patrocinador"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export default function ConvocatoriasPage() {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        setIsLoading(true);
        
        // Ahora podemos acceder directamente a la tabla convocatorias
        // gracias a la política RLS modificada
        const { data, error } = await supabase
          .from('convocatorias')
          .select('*')
          .order('fecha', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          procesarDatos(data);
        } else {
          setConvocatorias([]);
        }
      
        
      } catch (err: any) {
        console.error("Error al cargar convocatorias:", err);
        setError(`No se pudieron cargar las convocatorias: ${err.message || 'Error desconocido'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Función para procesar los datos una vez obtenidos
    const procesarDatos = (data: any[]) => {
      // Mapear los datos de la BD al formato de nuestra interfaz
      const formattedData: Convocatoria[] = data.map((item: any) => {
        console.log('Procesando item:', item);
        return {
          id: item.id,
          team: item.equipo || '',
          opponent: item.rival || '',
          date: item.fecha || '',
          matchTime: item.hora || '',
          callTime: item.horaencuentro || '',
          location: item.lugar || '',
          locationLink: 'https://maps.app.goo.gl/DtqpXQyKRvjzPj4E8',  // Usamos URL por defecto ya que no hay campo para mapear
          title: item.titulo || '',
          meetingPoint: item.puntoencuentro || '',
          notes: item.notas || '',
          status: item.estado || ''
        };
      });
      
      console.log('Datos formateados:', formattedData);
      setConvocatorias(formattedData);
    };

    fetchConvocatorias();
  }, []); 

  const filteredConvocatorias = selectedTeam
    ? convocatorias.filter((convocatoria) => convocatoria.team === selectedTeam)
    : convocatorias;

  return (
    <>
    <Header />
    <main className="max-w-4xl mx-auto p-6 bg-white  mt-20 relative">
      {/* Componente de Publicidad con patrocinador aleatorio rotativo */}
      <RandomSponsorCard />
      
      <h1 className="text-3xl font-bold text-red-600 text-center mb-6">Convocatòries de Partits</h1>

      <div className="mb-6">
        <label className="block font-medium text-gray-700">Filtrar per equip:</label>
        <select
          className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          value={selectedTeam}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedTeam(e.target.value)}
        >
          <option value="">Tots els equips</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>


      {isLoading ? (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Cargando convocatorias...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredConvocatorias.length > 0 ? (
        <ul className="space-y-4">
          {filteredConvocatorias.map((convocatoria) => (
            <li key={convocatoria.id} className="p-4 border rounded-lg shadow-md bg-gray-50 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-red-600">{convocatoria.team} vs {convocatoria.opponent}</h2>
                {convocatoria.location.includes("Cardedeu") ? (
                  <Home className="text-green-600 w-6 h-6"  />
                ) : (
                  <Plane className="text-blue-600 w-6 h-6"  />
                )}
              </div>
              <p className="text-gray-700">📅 {formatDate(convocatoria.date)}</p>
              <p className="text-gray-700">📍 <Link href={convocatoria.locationLink} target="_blank" className="text-blue-600 hover:underline">{convocatoria.location}</Link></p>
              <p className="text-gray-700">🕒 Hora de convocatòria: {convocatoria.callTime}</p>
              <p className="text-gray-700">⏳ Hora de partit: {convocatoria.matchTime}</p>
              {convocatoria.meetingPoint && (
                <p className="text-gray-700">📍 Punt de trobada: {convocatoria.meetingPoint}</p>
              )}
              {convocatoria.notes && (
                <div className="mt-2 p-2 bg-gray-100 rounded-md">
                  <p className="text-gray-700 text-sm font-medium">Notes:</p>
                  <p className="text-gray-600 text-sm">{convocatoria.notes}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No hi ha convocatòries per a aquest equip.</p>
      )}
    </main>
    </>
  );
}