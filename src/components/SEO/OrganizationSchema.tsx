import React from 'react';

interface OrganizationSchemaProps {
  url?: string;
  logo?: string;
}

export default function OrganizationSchema({ url = 'https://www.fccardedeu.org', logo = '/Escudo.webp' }: OrganizationSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "FC Cardedeu",
    "url": url,
    "logo": `${url}${logo.startsWith('/') ? logo : `/${logo}`}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Camp Municipal d'Esports de Cardedeu",
      "addressLocality": "Cardedeu",
      "addressRegion": "Barcelona",
      "postalCode": "08440",
      "addressCountry": "ES"
    },
    "telephone": "+34 938 71 31 31",
    "email": "info@fccardedeu.org",
    "sameAs": [
      "https://www.facebook.com/fccardedeu",
      "https://www.instagram.com/fccardedeu",
      "https://twitter.com/fccardedeu"
    ],
    "sport": "Football",
    "member": {
      "@type": "SportsOrganization",
      "name": "Federació Catalana de Futbol"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
