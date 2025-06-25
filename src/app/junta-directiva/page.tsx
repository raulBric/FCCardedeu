"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, Mail, Phone, Clock } from 'lucide-react';
import Header from '@/components/Header';

// Tipo para miembros de la junta directiva
interface MiembroJunta {
  id: number;
  nombre: string;
  cargo: string;
  foto: string;
  email?: string;
  telefono?: string;
  horarioAtencion?: string;
  bio?: string;
}

// Datos de los miembros de la junta directiva
const miembrosJunta: MiembroJunta[] = [
  {
    id: 1,
    nombre: "CARLOS NOU BLANCO",
    cargo: "President",
    foto: "/images/placeholder-person.png",
    email: "president@fccardedeu.org",
    bio: "President del FC Cardedeu"
  },
  {
    id: 2,
    nombre: "JOSE RAMON HURTADO CASTRO",
    cargo: "Vicepresident 1",
    foto: "/images/placeholder-person.png",
    bio: "Vicepresident del FC Cardedeu"
  },
  {
    id: 3,
    nombre: "PABLO LAGE CARRERIRAS",
    cargo: "Vicepresident 2",
    foto: "/images/placeholder-person.png",
    bio: "Vicepresident del FC Cardedeu"
  },
  {
    id: 4,
    nombre: "ANGEL PALACIOS ORTEGA",
    cargo: "Secretari",
    foto: "/images/placeholder-person.png",
    email: "secretaria@fccardedeu.org",
    bio: "Secretari del FC Cardedeu"
  },
  {
    id: 5,
    nombre: "JOSE MARIA EXTRMERA LACAL",
    cargo: "Tresorer",
    foto: "/images/placeholder-person.png",
    email: "tresoreria@fccardedeu.org",
    bio: "Tresorer del FC Cardedeu"
  },
  {
    id: 6,
    nombre: "RAFAEL HERREROS BRUY",
    cargo: "Vocal",
    foto: "/images/placeholder-person.png",
    bio: "Vocal de la junta directiva del FC Cardedeu"
  },
  {
    id: 7,
    nombre: "ORIOL LLORENS CLADELLAS",
    cargo: "Vocal",
    foto: "/images/placeholder-person.png",
    bio: "Vocal de la junta directiva del FC Cardedeu"
  },
  {
    id: 8,
    nombre: "XAVIER PIÑA IGLESIAS",
    cargo: "Vocal",
    foto: "/images/placeholder-person.png",
    bio: "Vocal de la junta directiva del FC Cardedeu"
  },
  {
    id: 9,
    nombre: "ALEIX PINOS FLORES",
    cargo: "Vocal",
    foto: "/images/placeholder-person.png",
    bio: "Vocal de la junta directiva del FC Cardedeu"
  },
  {
    id: 10,
    nombre: "VICENTE GALERA ESPADAS",
    cargo: "Vocal",
    foto: "/images/placeholder-person.png",
    email: "delegats@fccardedeu.org",
    bio: "Vocal de la junta directiva del FC Cardedeu"
  },
  {
    id: 11,
    nombre: "XAVIER NOGUER",
    cargo: "Vocal",
    foto: "/images/placeholder-person.png",
    email: "tic@fccardedeu.org",
    bio: "Vocal de la junta directiva del FC Cardedeu"
  }
];

export default function JuntaDirectivaPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Encabezado */}
        <div className="text-center mb-12">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Junta Directiva</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Coneix l&apos;equip que gestiona el FC Cardedeu. La nostra junta directiva treballa per oferir 
            el millor servei i promoure els valors del club.
          </p>
        </div>
        
        {/* Junta Directiva - Lista unificada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {miembrosJunta.map((miembro) => (
            <div 
              key={miembro.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
            >
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  src={miembro.foto}
                  alt={miembro.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-800">{miembro.nombre}</h3>
                <p className="text-red-600 font-medium mb-2">{miembro.cargo}</p>
                
                <p className="text-gray-600 mb-2 text-sm">{miembro.bio}</p>
                
                <div className="space-y-1 text-sm">
                  {miembro.email && (
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-4 h-4 mr-1 text-red-500" />
                      <a 
                        href={`mailto:${miembro.email}`}
                        className="hover:text-red-600 transition-colors text-sm truncate"
                      >
                        {miembro.email}
                      </a>
                    </div>
                  )}
                  
                  {miembro.telefono && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-4 h-4 mr-1 text-red-500" />
                      <a 
                        href={`tel:${miembro.telefono.replace(/\s+/g, '')}`}
                        className="hover:text-red-600 transition-colors"
                      >
                        {miembro.telefono}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Información de contacto general */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contacte amb la Junta Directiva</h2>
          
          <p className="text-gray-600 mb-6">
            Si necessites contactar amb la junta directiva del FC Cardedeu, pots fer-ho mitjançant les següents vies:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start">
              <Mail className="w-6 h-6 mr-3 text-red-600" />
              <div>
                <h3 className="font-medium text-gray-800">Correu electrònic</h3>
                <a 
                  href="mailto:juntadirectiva@fccardedeu.cat" 
                  className="text-red-600 hover:underline"
                >
                  juntadirectiva@fccardedeu.cat
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="w-6 h-6 mr-3 text-red-600" />
              <div>
                <h3 className="font-medium text-gray-800">Telèfon</h3>
                <a 
                  href="tel:938461013" 
                  className="text-red-600 hover:underline"
                >
                  93 846 10 13
                </a>
              </div>
            </div>
            
            <div className="flex items-start md:col-span-2">
              <Clock className="w-6 h-6 mr-3 text-red-600" />
              <div>
                <h3 className="font-medium text-gray-800">Horari d'atenció</h3>
                <p>Dilluns a divendres de 17:00 a 20:00 al Camp Municipal de Futbol</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
