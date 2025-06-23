import React from 'react';

interface ContactPageSchemaProps {
  telephone?: string;
  email?: string;
  baseUrl?: string;
}

export default function ContactPageSchema({
  telephone = "+34 93 846 42 26",
  email = "info@fccardedeu.org",
  baseUrl = "https://www.fccardedeu.org"
}: ContactPageSchemaProps) {
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contacto FC Cardedeu",
    "url": `${baseUrl}/contacto`,
    "mainEntity": {
      "@type": "Organization",
      "name": "FC Cardedeu",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": telephone,
        "contactType": "Secretaría",
        "email": email,
        "availableLanguage": ["Català", "Español"],
        "hoursAvailable": "Mo-Fr 17:00-20:00"
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
