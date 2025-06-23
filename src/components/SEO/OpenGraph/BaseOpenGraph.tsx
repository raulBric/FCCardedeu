import React from 'react';
import Head from 'next/head';

export interface BaseOpenGraphProps {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile' | 'book';
  siteName?: string;
  locale?: string;
}

/**
 * Componente base para meta tags OpenGraph
 * Sigue las especificaciones de OpenGraph para compartir contenido en redes sociales
 */
export default function BaseOpenGraph({
  title,
  description = 'FC Cardedeu - Club de fútbol de Cardedeu, Barcelona',
  url = 'https://www.fccardedeu.org',
  image = 'https://www.fccardedeu.org/images/og-image-default.jpg',
  type = 'website',
  siteName = 'FC Cardedeu',
  locale = 'es_ES'
}: BaseOpenGraphProps) {
  // Asegurar que la URL de la imagen es absoluta
  const imageUrl = image.startsWith('http') ? image : `https://www.fccardedeu.org${image.startsWith('/') ? image : `/${image}`}`;
  
  return (
    <Head>
      {/* OpenGraph básico */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Head>
  );
}
