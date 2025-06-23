import React from 'react';
import BaseOpenGraph from './BaseOpenGraph';

interface EventOpenGraphProps {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  eventStartTime?: string | Date;
  eventEndTime?: string | Date;
  location?: string;
  homeTeam?: string;
  awayTeam?: string;
}

/**
 * Componente OpenGraph específico para eventos deportivos
 * Optimizado para partidos de fútbol de FC Cardedeu
 */
export default function EventOpenGraph({
  title,
  description,
  url,
  image,
  eventStartTime,
  eventEndTime,
  location = "Camp Municipal d'Esports de Cardedeu",
  homeTeam,
  awayTeam
}: EventOpenGraphProps) {
  // Formato de fechas
  const startTime = eventStartTime ? (
    typeof eventStartTime === 'string' 
      ? eventStartTime 
      : eventStartTime.toISOString()
  ) : '';
  
  const endTime = eventEndTime ? (
    typeof eventEndTime === 'string' 
      ? eventEndTime 
      : eventEndTime.toISOString()
  ) : '';

  // URL completa
  const baseUrl = url?.includes('://') 
    ? url 
    : `https://www.fccardedeu.org${url?.startsWith('/') ? url : `/${url}`}`;
  
  // Si hay equipos, mejorar la descripción
  const finalDescription = description || (
    homeTeam && awayTeam 
      ? `Partido de fútbol: ${homeTeam} vs ${awayTeam}${location ? ` en ${location}` : ''}`
      : `Evento deportivo de FC Cardedeu${location ? ` en ${location}` : ''}`
  );

  return (
    <>
      <BaseOpenGraph
        title={title}
        description={finalDescription}
        url={baseUrl}
        image={image}
        type="website"
        siteName="FC Cardedeu"
        locale="ca_ES"
      />
      
      {/* Metadatos específicos de evento */}
      <meta property="og:event:start_time" content={startTime} />
      {endTime && <meta property="og:event:end_time" content={endTime} />}
      <meta property="og:event:location" content={location} />
      
      {/* Metadatos adicionales para equipos */}
      {homeTeam && <meta property="og:event:homeTeam" content={homeTeam} />}
      {awayTeam && <meta property="og:event:awayTeam" content={awayTeam} />}
    </>
  );
}
