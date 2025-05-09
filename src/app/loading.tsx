'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-50">
      <div className="text-center">
        {/* Escudo animado del FC Cardedeu */}
        <div className="mx-auto w-24 h-24 relative mb-4">
          {/* Círculo exterior pulsante */}
          <div className="absolute inset-0 rounded-full bg-red-600 animate-pulse"></div>
          
          {/* Círculo interior */}
          <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
            {/* Iniciales del club */}
            <div className="text-red-600 font-bold text-xl">FC</div>
          </div>
          
          {/* Balón giratorio */}
          <div className="absolute -bottom-2 -right-2 w-10 h-10">
            <div className="w-full h-full bg-white rounded-full border-2 border-gray-800 relative animate-spin-slow">
              {/* Pentágonos del balón */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-sm absolute top-1"></div>
                <div className="w-2 h-2 bg-black rounded-sm absolute bottom-1 left-2"></div>
                <div className="w-2 h-2 bg-black rounded-sm absolute bottom-1 right-2"></div>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-red-600 mb-2">FC Cardedeu</h2>
        
        {/* Barra de progreso */}
        <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-red-600 rounded-full animate-progress"></div>
        </div>
        
        <p className="text-gray-600 mt-3 text-sm animate-pulse">Cargando...</p>
      </div>
      
      {/* Las animaciones ahora están en un archivo CSS global */}
    </div>
  );
}