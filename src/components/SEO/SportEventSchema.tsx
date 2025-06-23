import React from 'react';

interface SportEventSchemaProps {
  homeTeam: string;
  awayTeam: string;
  startDate: string | Date;
  endDate?: string | Date;
  location?: string;
}

export default function SportEventSchema({
  homeTeam,
  awayTeam,
  startDate,
  endDate,
  location = "Camp Municipal d'Esports de Cardedeu"
}: SportEventSchemaProps) {
  
  // Aseguramos formato ISO para las fechas
  const formattedStartDate = typeof startDate === 'string' 
    ? startDate 
    : startDate.toISOString();
  
  // Por defecto, un partido dura 90 minutos (o 1.5 horas)
  const formattedEndDate = endDate 
    ? (typeof endDate === 'string' ? endDate : endDate.toISOString())
    : new Date(new Date(startDate).getTime() + 90 * 60000).toISOString();
  
  // Aseguramos que homeTeam tenga el prefijo "FC Cardedeu" si no lo tiene
  const formattedHomeTeam = homeTeam.includes('FC Cardedeu') 
    ? homeTeam 
    : `FC Cardedeu ${homeTeam}`;
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${formattedHomeTeam} vs ${awayTeam}`,
    "startDate": formattedStartDate,
    "endDate": formattedEndDate,
    "location": {
      "@type": "Place",
      "name": location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cardedeu",
        "addressRegion": "Barcelona",
        "addressCountry": "ES"
      }
    },
    "competitor": [
      {
        "@type": "SportsTeam",
        "name": formattedHomeTeam
      },
      {
        "@type": "SportsTeam",
        "name": awayTeam
      }
    ],
    "homeTeam": {
      "@type": "SportsTeam",
      "name": formattedHomeTeam
    },
    "awayTeam": {
      "@type": "SportsTeam",
      "name": awayTeam
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
