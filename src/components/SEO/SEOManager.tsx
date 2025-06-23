import React from 'react';
import OrganizationSchema from './OrganizationSchema';
import TeamSchema from './TeamSchema';
import SportEventSchema from './SportEventSchema';
import NewsArticleSchema from './NewsArticleSchema';
import BreadcrumbSchema from './BreadcrumbSchema';
import SportFacilitySchema from './SportFacilitySchema';
import ContactPageSchema from './ContactPageSchema';

export type SEOType = 'organization' | 'team' | 'event' | 'news' | 'breadcrumb' | 'facility' | 'contact';

interface SEOManagerProps {
  type: SEOType | SEOType[];
  baseUrl?: string;
  data?: any;
}

/**
 * Componente central para gestionar SEO con datos estructurados
 * Permite incluir uno o varios esquemas de datos estructurados en una página
 */
export default function SEOManager({ type, baseUrl = 'https://www.fccardedeu.org', data = {} }: SEOManagerProps) {
  const types = Array.isArray(type) ? type : [type];
  
  return (
    <>
      {types.includes('organization') && (
        <OrganizationSchema url={baseUrl} logo={data.logo || '/images/logo.png'} />
      )}
      
      {types.includes('team') && (
        <TeamSchema 
          teamName={data.teamName || 'FC Cardedeu'} 
          coach={data.coach} 
          players={data.players} 
          baseUrl={baseUrl}
        />
      )}
      
      {types.includes('event') && data.homeTeam && data.awayTeam && data.startDate && (
        <SportEventSchema
          homeTeam={data.homeTeam}
          awayTeam={data.awayTeam}
          startDate={data.startDate}
          endDate={data.endDate}
          location={data.location}
        />
      )}
      
      {types.includes('news') && data.headline && data.datePublished && (
        <NewsArticleSchema
          headline={data.headline}
          datePublished={data.datePublished}
          dateModified={data.dateModified}
          description={data.description}
          image={data.image}
          author={data.author}
          url={data.url}
          baseUrl={baseUrl}
        />
      )}
      
      {types.includes('breadcrumb') && data.items && data.items.length > 0 && (
        <BreadcrumbSchema items={data.items} baseUrl={baseUrl} />
      )}
      
      {types.includes('facility') && (
        <SportFacilitySchema
          name={data.name}
          description={data.description}
          imageUrl={data.imageUrl}
          latitude={data.latitude}
          longitude={data.longitude}
          baseUrl={baseUrl}
        />
      )}
      
      {types.includes('contact') && (
        <ContactPageSchema
          telephone={data.telephone}
          email={data.email}
          baseUrl={baseUrl}
        />
      )}
    </>
  );
}
