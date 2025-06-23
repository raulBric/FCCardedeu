import React from 'react';

interface Player {
  name: string;
}

interface TeamSchemaProps {
  teamName: string;
  coach?: string;
  players?: Player[];
  baseUrl?: string;
}

export default function TeamSchema({ 
  teamName,
  coach = "Entrenador FC Cardedeu", 
  players = [],
  baseUrl = "https://www.fccardedeu.org"
}: TeamSchemaProps) {
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "name": teamName.startsWith('FC Cardedeu') ? teamName : `FC Cardedeu ${teamName}`,
    "sport": "Football",
    "memberOf": {
      "@type": "SportsOrganization",
      "name": "FC Cardedeu"
    },
    "coach": {
      "@type": "Person",
      "name": coach
    },
    "athlete": players.map(player => ({
      "@type": "Person",
      "name": player.name
    })),
    "homeLocation": {
      "@type": "Place",
      "name": "Camp Municipal d'Esports",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cardedeu",
        "addressRegion": "Barcelona",
        "postalCode": "08440",
        "addressCountry": "ES"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
