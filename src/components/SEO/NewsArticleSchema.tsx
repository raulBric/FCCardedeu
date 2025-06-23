import React from 'react';

interface NewsArticleSchemaProps {
  headline: string;
  datePublished: string | Date;
  dateModified?: string | Date;
  description?: string;
  image?: string;
  author?: string;
  url?: string;
  baseUrl?: string;
}

export default function NewsArticleSchema({
  headline,
  datePublished,
  dateModified,
  description = "",
  image = "",
  author = "Equipo de Comunicación FC Cardedeu",
  url = "",
  baseUrl = "https://www.fccardedeu.org"
}: NewsArticleSchemaProps) {
  
  // Formato fecha ISO
  const formattedPublishDate = typeof datePublished === 'string'
    ? datePublished
    : datePublished.toISOString();
  
  const formattedModifiedDate = dateModified 
    ? (typeof dateModified === 'string' ? dateModified : dateModified.toISOString())
    : formattedPublishDate;
  
  // URL completa para la imagen
  const fullImageUrl = image 
    ? (image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`) 
    : `${baseUrl}/images/default-news.jpg`;
  
  // URL completa para la página
  const pageUrl = url
    ? (url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`)
    : `${baseUrl}/noticias/${encodeURIComponent(headline.toLowerCase().replace(/\s+/g, '-'))}`;
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": headline,
    "datePublished": formattedPublishDate,
    "dateModified": formattedModifiedDate,
    "description": description,
    "image": fullImageUrl,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "FC Cardedeu",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "about": {
      "@type": "SportsOrganization",
      "name": "FC Cardedeu"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
