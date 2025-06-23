import React from 'react';

interface SportFacilitySchemaProps {
  name?: string;
  description?: string;
  imageUrl?: string;
  latitude?: string;
  longitude?: string;
  baseUrl?: string;
}

export default function SportFacilitySchema({
  name = "Camp Municipal d'Esports de Cardedeu",
  description = "Instalaciones del FC Cardedeu con campo de fútbol 11, campo de fútbol 7 y gimnasio para los entrenamientos.",
  imageUrl = "/images/instalaciones/campo-principal.jpg",
  latitude = "41.634226",
  longitude = "2.360297",
  baseUrl = "https://www.fccardedeu.org"
}: SportFacilitySchemaProps) {
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": name,
    "description": description,
    "url": `${baseUrl}/instalaciones`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avinguda Pins Roses, s/n",
      "addressLocality": "Cardedeu",
      "addressRegion": "Barcelona",
      "postalCode": "08440",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    },
    "telephone": "+34 93 846 42 26",
    "openingHours": "Mo-Fr 16:00-22:00, Sa-Su 09:00-20:00",
    "photo": imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`,
    "containedInPlace": {
      "@type": "Place",
      "name": "Cardedeu",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cardedeu",
        "addressRegion": "Barcelona",
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
