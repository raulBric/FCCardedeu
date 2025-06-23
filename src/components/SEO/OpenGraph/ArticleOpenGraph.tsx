import React from 'react';
import BaseOpenGraph from './BaseOpenGraph';

interface ArticleOpenGraphProps {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  section?: string;
}

/**
 * Componente OpenGraph específico para artículos y noticias
 * Incluye metadatos adicionales como autor, fecha de publicación y tags
 */
export default function ArticleOpenGraph({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author = "FC Cardedeu",
  tags = [],
  section = "Noticias"
}: ArticleOpenGraphProps) {
  // Formato ISO para fechas si es necesario
  const pubTime = publishedTime ? new Date(publishedTime).toISOString() : "";
  const modTime = modifiedTime ? new Date(modifiedTime).toISOString() : pubTime;
  
  const baseUrl = url?.includes('://') 
    ? url 
    : `https://www.fccardedeu.org${url?.startsWith('/') ? url : `/${url}`}`;
  
  // Se añaden los metadatos adicionales para artículos
  const tagsMetadata = tags.map(tag => (
    <meta key={`article:tag:${tag}`} property="article:tag" content={tag} />
  ));

  return (
    <>
      <BaseOpenGraph
        title={title}
        description={description}
        url={baseUrl}
        image={image}
        type="article"
        siteName="FC Cardedeu"
        locale="ca_ES"
      />
      
      {/* Metadatos específicos de artículo */}
      <meta property="article:published_time" content={pubTime} />
      {modTime && <meta property="article:modified_time" content={modTime} />}
      <meta property="article:author" content={author} />
      <meta property="article:section" content={section} />
      {tagsMetadata}
    </>
  );
}
