import React from 'react';
import BaseOpenGraph from './BaseOpenGraph';

interface ProfileOpenGraphProps {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
  teamName?: string;
}

/**
 * Componente OpenGraph específico para perfiles (equipos o jugadores)
 */
export default function ProfileOpenGraph({
  title,
  description,
  url,
  image,
  firstName,
  lastName,
  username,
  role = 'athlete',
  teamName = 'FC Cardedeu'
}: ProfileOpenGraphProps) {
  // URL completa
  const baseUrl = url?.includes('://') 
    ? url 
    : `https://www.fccardedeu.org${url?.startsWith('/') ? url : `/${url}`}`;
  
  // Si es un jugador pero no hay descripción específica
  const finalDescription = description || (
    firstName && lastName
      ? `${firstName} ${lastName} - ${role} del ${teamName}`
      : `Perfil de ${title} - ${teamName}`
  );

  return (
    <>
      <BaseOpenGraph
        title={title}
        description={finalDescription}
        url={baseUrl}
        image={image}
        type="profile"
        siteName="FC Cardedeu"
        locale="ca_ES"
      />
      
      {/* Metadatos específicos de perfil */}
      {firstName && <meta property="profile:first_name" content={firstName} />}
      {lastName && <meta property="profile:last_name" content={lastName} />}
      {username && <meta property="profile:username" content={username} />}
      
      {/* Metadatos adicionales relacionados con el equipo */}
      <meta property="og:profile:role" content={role} />
      <meta property="og:profile:team" content={teamName} />
    </>
  );
}
