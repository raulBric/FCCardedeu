'use client';

import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-red-600 bg-opacity-30 backdrop-blur-sm z-50">
      <div className="text-center">
        {/* Escudo del FC Cardedeu con efecto de latido */}
        <div className="mx-auto relative">
          {/* Círculo de resplandor rojo */}
          <div className="absolute -inset-4 rounded-full bg-red-600 opacity-30 animate-ping"></div>
          
          {/* Efecto de latido para el escudo */}
          <div className="relative animate-pulse">
            <Image 
              src="/Escudo.webp" 
              alt="Escudo FC Cardedeu" 
              width={150} 
              height={150}
              className="drop-shadow-lg"
              priority
            />
          </div>
        </div>
        
        {/* Texto de carga */}
        <div className="mt-6 text-red-800 font-medium text-lg">
          Carregant...
        </div>
      </div>
    </div>
  );
}
