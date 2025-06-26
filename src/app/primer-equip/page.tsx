"use client";

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';

// Tipos de datos
interface Jugador {
  id: number;
  nombre: string;
  posicion: string;
  numero?: number;
  foto: string;
  edad?: number;
  altura?: string;
  temporadas?: number;
}

interface CuerpoTecnico {
  id: number;
  nombre: string;
  cargo: string;
  foto: string;
}

// Datos del cuerpo técnico
const cuerpoTecnico: CuerpoTecnico[] = [
  {
    id: 1,
    nombre: "PARRA TOLEDANO, DAVID",
    cargo: "Entrenador principal",
    foto: "/images/placeholder-person.png"
  },
  {
    id: 2,
    nombre: "LOPEZ NUÑEZ, SANDRO",
    cargo: "Segon entrenador",
    foto: "/images/placeholder-person.png"
  },
  {
    id: 3,
    nombre: "CARCEDO RONCERO, ALBERT",
    cargo: "Preparador físic",
    foto: "/images/placeholder-person.png"
  },
  {
    id: 4,
    nombre: "LUCERO RAMON, ORIOL",
    cargo: "Delegat",
    foto: "/images/placeholder-person.png"
  }
];

// Datos de los jugadores
const jugadores: Jugador[] = [
  // Porteros y defensas
  {
    id: 1,
    nombre: "M'BALLO DIAO, TIDIANE",
    posicion: "Porter",
    numero: 1,
    foto: "/images/placeholder-person.png",
    edad: 24,
    altura: "1,85m",
    temporadas: 1
  },
  {
    id: 2,
    nombre: "SANCHEZ ANCOS, DANIEL",
    posicion: "Porter",
    numero: 13,
    foto: "/images/placeholder-person.png",
    edad: 23,
    altura: "1,82m",
    temporadas: 1
  },
  {
    id: 3,
    nombre: "BALDE SOW, ALHAJI",
    posicion: "Defensa central",
    numero: 4,
    foto: "/images/placeholder-person.png",
    edad: 25,
    altura: "1,86m",
    temporadas: 1
  },
  {
    id: 4,
    nombre: "LOPEZ RAMIREZ, CARLOS",
    posicion: "Defensa central",
    numero: 2,
    foto: "/images/placeholder-person.png",
    edad: 26,
    altura: "1,83m",
    temporadas: 2
  },
  {
    id: 5,
    nombre: "ULLDEMOLINS ABAD, JOSEP",
    posicion: "Lateral dret",
    numero: 3,
    foto: "/images/placeholder-person.png",
    edad: 24,
    altura: "1,78m",
    temporadas: 1
  },
  {
    id: 6,
    nombre: "EHLILUCH EL LAITI, MUHAMED ACHRAF",
    posicion: "Lateral esquerre",
    numero: 5,
    foto: "/images/placeholder-person.png",
    edad: 23,
    altura: "1,80m",
    temporadas: 1
  },
  // Mediocampistas
  {
    id: 7,
    nombre: "DIALLO, MOUNTAGA",
    posicion: "Migcampista central",
    numero: 6,
    foto: "/images/placeholder-person.png",
    edad: 26,
    altura: "1,82m",
    temporadas: 1
  },
  {
    id: 8,
    nombre: "CASTELLVELL TAPIA, ROGER",
    posicion: "Migcampista central",
    numero: 8,
    foto: "/images/placeholder-person.png",
    edad: 25,
    altura: "1,79m",
    temporadas: 2
  },
  {
    id: 9,
    nombre: "NAVAJAS PÉREZ, ELOI",
    posicion: "Migcampista ofensiu",
    numero: 10,
    foto: "/images/placeholder-person.png",
    edad: 26,
    altura: "1,76m",
    temporadas: 2
  },
  {
    id: 10,
    nombre: "BOIX ROCA, MARC",
    posicion: "Migcampista central",
    numero: 16,
    foto: "/images/placeholder-person.png",
    edad: 22,
    altura: "1,77m",
    temporadas: 1
  },
  // Más mediocampistas
  {
    id: 11,
    nombre: "BELTRAN HURTADO, GERARD",
    posicion: "Migcampista defensiu",
    numero: 15,
    foto: "/images/placeholder-person.png",
    edad: 24,
    altura: "1,80m",
    temporadas: 1
  },
  {
    id: 12,
    nombre: "DANJO JALLOW, BURAMA",
    posicion: "Migcampista central",
    numero: 17,
    foto: "/images/placeholder-person.png",
    edad: 25,
    altura: "1,83m",
    temporadas: 2
  },
  {
    id: 13,
    nombre: "TOURE CISSE, ALSENY",
    posicion: "Migcampista ofensiu",
    numero: 18,
    foto: "/images/placeholder-person.png",
    edad: 24,
    altura: "1,81m",
    temporadas: 1
  },
  // Delanteros
  {
    id: 14,
    nombre: "MANZANERA BENET, RAMON",
    posicion: "Davanter centre",
    numero: 9,
    foto: "/images/placeholder-person.png",
    edad: 27,
    altura: "1,84m",
    temporadas: 3
  },
  {
    id: 15,
    nombre: "TAREK SK",
    posicion: "Davanter centre",
    numero: 19,
    foto: "/images/placeholder-person.png",
    edad: 22,
    altura: "1,79m",
    temporadas: 1
  },
  {
    id: 16,
    nombre: "GASSAMA SAVANE, OUSSOUMANE",
    posicion: "Extrem dret",
    numero: 7,
    foto: "/images/placeholder-person.png",
    edad: 21,
    altura: "1,75m",
    temporadas: 1
  },
  {
    id: 17,
    nombre: "CARRILLO ANGRILL, LARS",
    posicion: "Extrem esquerre",
    numero: 11,
    foto: "/images/placeholder-person.png",
    edad: 23,
    altura: "1,76m",
    temporadas: 2
  },
  {
    id: 18,
    nombre: "HEREDIA RUIZ, ANDRES RODOLFO",
    posicion: "Extrem dret",
    numero: 14,
    foto: "/images/placeholder-person.png",
    edad: 22,
    altura: "1,74m",
    temporadas: 1
  },
  {
    id: 19,
    nombre: "UROZ IZQUIERDO, OSCAR",
    posicion: "Extrem esquerre",
    numero: 20,
    foto: "/images/placeholder-person.png",
    edad: 24,
    altura: "1,78m",
    temporadas: 2
  },
  {
    id: 20,
    nombre: "CIRERA PUIG, ALEIX",
    posicion: "Davanter centre",
    numero: 21,
    foto: "/images/placeholder-person.png",
    edad: 25,
    altura: "1,82m",
    temporadas: 1
  },
  {
    id: 21,
    nombre: "CANTOÑI OLAVE, JOHAN ANDRES",
    posicion: "Davanter centre",
    numero: 22,
    foto: "/images/placeholder-person.png",
    edad: 26,
    altura: "1,85m",
    temporadas: 2
  },
];

// Agrupar jugadores por posición
type PosicionesJugadores = {
  Porter: Jugador[];
  Defensa: Jugador[];
  Migcampista: Jugador[];
  Davanter: Jugador[];
};

const groupJugadoresByPosicion = (jugadores: Jugador[]): PosicionesJugadores => {
  const positions: PosicionesJugadores = {
    "Porter": [],
    "Defensa": [],
    "Migcampista": [],
    "Davanter": []
  };

  jugadores.forEach(jugador => {
    if (jugador.posicion.includes("Porter")) {
      positions["Porter"].push(jugador);
    } else if (jugador.posicion.includes("Defensa") || jugador.posicion.includes("Lateral")) {
      positions["Defensa"].push(jugador);
    } else if (jugador.posicion.includes("Migcampista") || jugador.posicion.includes("Mig")) {
      positions["Migcampista"].push(jugador);
    } else if (jugador.posicion.includes("Davanter") || jugador.posicion.includes("Extrem")) {
      positions["Davanter"].push(jugador);
    }
  });

  return positions;
};

const jugadoresPorPosicion = groupJugadoresByPosicion(jugadores);

export default function PrimerEquipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Primer Equip</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            El primer equip del FC Cardedeu competeix a la categoria de Primera Catalana i està format per jugadors amb talent i compromís.
          </p>
        </div>
        
        {/* Información básica */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center">
              <Trophy className="h-12 w-12 text-red-600 mr-4" />
              <div>
                <h3 className="font-medium text-lg">Categoria</h3>
                <p className="text-gray-700">Segona Catalana</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-12 w-12 text-red-600 mr-4" />
              <div>
                <h3 className="font-medium text-lg">Camp</h3>
                <p className="text-gray-700">Municipal FC Cardedeu</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-12 w-12 text-red-600 mr-4" />
              <div>
                <h3 className="font-medium text-lg">Temporada</h3>
                <p className="text-gray-700">2025-2026</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="h-12 w-12 text-red-600 mr-4" />
              <div>
                <h3 className="font-medium text-lg">Plantilla</h3>
                <p className="text-gray-700">{jugadores.length} jugadors</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cuerpo técnico */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Cos Tècnic</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {cuerpoTecnico.map((miembro) => (
              <div 
                key={miembro.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
              >
                <div className="relative h-56 w-full bg-gray-100">
                  <Image
                    src={miembro.foto}
                    alt={miembro.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{miembro.nombre}</h3>
                  <p className="text-red-600">{miembro.cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Jugadores por posición */}
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Plantilla</h2>
          
          {/* Porteros */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-red-700 mb-4 border-b pb-2">Porters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {jugadoresPorPosicion["Porter"].map((jugador) => (
                <div 
                  key={jugador.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-lg font-bold w-10 h-10 flex items-center justify-center z-10">
                      {jugador.numero}
                    </div>
                    <div className="relative h-56 w-full bg-gray-100">
                      <Image
                        src={jugador.foto}
                        alt={jugador.nombre}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{jugador.nombre}</h3>
                    <p className="text-red-600 text-sm">{jugador.posicion}</p>
                    <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                      <div>Edat: {jugador.edad}</div>
                      <div>Alçada: {jugador.altura}</div>
                      <div className="col-span-2">Temporades: {jugador.temporadas}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Defensas */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-red-700 mb-4 border-b pb-2">Defenses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {jugadoresPorPosicion["Defensa"].map((jugador) => (
                <div 
                  key={jugador.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-lg font-bold w-10 h-10 flex items-center justify-center z-10">
                      {jugador.numero}
                    </div>
                    <div className="relative h-56 w-full bg-gray-100">
                      <Image
                        src={jugador.foto}
                        alt={jugador.nombre}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{jugador.nombre}</h3>
                    <p className="text-red-600 text-sm">{jugador.posicion}</p>
                    <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                      <div>Edat: {jugador.edad}</div>
                      <div>Alçada: {jugador.altura}</div>
                      <div className="col-span-2">Temporades: {jugador.temporadas}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mediocampistas */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-red-700 mb-4 border-b pb-2">Migcampistes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {jugadoresPorPosicion["Migcampista"].map((jugador) => (
                <div 
                  key={jugador.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-lg font-bold w-10 h-10 flex items-center justify-center z-10">
                      {jugador.numero}
                    </div>
                    <div className="relative h-56 w-full bg-gray-100">
                      <Image
                        src={jugador.foto}
                        alt={jugador.nombre}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{jugador.nombre}</h3>
                    <p className="text-red-600 text-sm">{jugador.posicion}</p>
                    <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                      <div>Edat: {jugador.edad}</div>
                      <div>Alçada: {jugador.altura}</div>
                      <div className="col-span-2">Temporades: {jugador.temporadas}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Delanteros */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-red-700 mb-4 border-b pb-2">Davanters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {jugadoresPorPosicion["Davanter"].map((jugador) => (
                <div 
                  key={jugador.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-lg font-bold w-10 h-10 flex items-center justify-center z-10">
                      {jugador.numero}
                    </div>
                    <div className="relative h-56 w-full bg-gray-100">
                      <Image
                        src={jugador.foto}
                        alt={jugador.nombre}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{jugador.nombre}</h3>
                    <p className="text-red-600 text-sm">{jugador.posicion}</p>
                    <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                      <div>Edat: {jugador.edad}</div>
                      <div>Alçada: {jugador.altura}</div>
                      <div className="col-span-2">Temporades: {jugador.temporadas}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Información de los partidos */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Horaris de partits</h2>
          
          <div className="flex justify-center">
            <div className="max-w-2xl w-full">
              <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                <Clock className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h3 className="font-medium">Partits com a local</h3>
                  <p className="text-gray-700">Dissabtes, 16:00h</p>
                </div>
              </div>
              
              <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                <Calendar className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h3 className="font-medium">Entrenaments</h3>
                  <p className="text-gray-700">Dimarts i dijous de 20:00h a 21:30h</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h3 className="font-medium">Localització</h3>
                  <p className="text-gray-700">Camp Municipal de Futbol FC Cardedeu</p>
                  <p className="text-gray-500 text-sm">Av. Pau Casals s/n, 08440 Cardedeu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
