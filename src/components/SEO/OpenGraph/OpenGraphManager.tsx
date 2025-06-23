import React from 'react';
import BaseOpenGraph from './BaseOpenGraph';
import ArticleOpenGraph from './ArticleOpenGraph';
import EventOpenGraph from './EventOpenGraph';
import ProfileOpenGraph from './ProfileOpenGraph';

export type OpenGraphType = 'website' | 'article' | 'event' | 'profile';

interface OpenGraphManagerProps {
  type: OpenGraphType;
  title: string;
  description?: string;
  url?: string;
  image?: string;
  baseUrl?: string;
  data?: any;
}

/**
 * Gestor central de OpenGraph para FC Cardedeu
 * Selecciona el componente adecuado según el tipo de contenido
 */
export default function OpenGraphManager({
  type = 'website',
  title,
  description,
  url,
  image = '/images/og-image-default.jpg',
  baseUrl = 'https://www.fccardedeu.org',
  data = {}
}: OpenGraphManagerProps) {
  // Asegurar que la URL es absoluta
  const fullUrl = url ? (
    url.includes('://') 
      ? url 
      : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`
  ) : baseUrl;
  
  // Seleccionar el componente adecuado según el tipo
  switch (type) {
    case 'article':
      return (
        <ArticleOpenGraph
          title={title}
          description={description}
          url={fullUrl}
          image={image}
          publishedTime={data.publishedTime || data.datePublished}
          modifiedTime={data.modifiedTime || data.dateModified}
          author={data.author}
          tags={data.tags}
          section={data.section}
        />
      );
      
    case 'event':
      return (
        <EventOpenGraph
          title={title}
          description={description}
          url={fullUrl}
          image={image}
          eventStartTime={data.startDate || data.eventStartTime}
          eventEndTime={data.endDate || data.eventEndTime}
          location={data.location}
          homeTeam={data.homeTeam}
          awayTeam={data.awayTeam}
        />
      );
      
    case 'profile':
      return (
        <ProfileOpenGraph
          title={title}
          description={description}
          url={fullUrl}
          image={image}
          firstName={data.firstName}
          lastName={data.lastName}
          username={data.username}
          role={data.role}
          teamName={data.teamName}
        />
      );
      
    case 'website':
    default:
      return (
        <BaseOpenGraph
          title={title}
          description={description}
          url={fullUrl}
          image={image}
          type="website"
          siteName="FC Cardedeu"
          locale="ca_ES"
        />
      );
  }
}
