import type { Metadata, Viewport } from "next";

// Configuración base para metadatos compartidos entre páginas
export const baseMetadata: Metadata = {
  title: {
    default: "FC Cardedeu | Web Oficial",
    template: "%s | FC Cardedeu",
  },
  description: "Web oficial del FC Cardedeu - Club de fútbol desde 1916 en Cardedeu, Barcelona",
  metadataBase: new URL("https://www.fccardedeu.cat"),
  openGraph: {
    type: "website",
    locale: "ca_ES",
    url: "./",
    siteName: "FC Cardedeu",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FC Cardedeu - Web Oficial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FC Cardedeu | Web Oficial",
    description: "Web oficial del FC Cardedeu - Club de fútbol desde 1916 en Cardedeu, Barcelona",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
  other: { 
    "theme-color": "#D81E05",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

// Exportación separada de viewport según la nueva API de Next.js 15
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

// Función para generar metadatos específicos para cada página
export function generateMetadata({
  title,
  description,
  image,
  path,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}): Metadata {
  return {
    title: title,
    description: description,
    openGraph: title || description || image || path
      ? {
          ...(baseMetadata.openGraph || {}),
          ...(title && { title }),
          ...(description && { description }),
          ...(path && { url: path }),
          ...(image && {
            images: [
              {
                url: image,
                width: 1200,
                height: 630,
                alt: title || "FC Cardedeu",
              },
            ],
          }),
        }
      : baseMetadata.openGraph,
    twitter: title || description || image
      ? {
          ...(baseMetadata.twitter || {}),
          ...(title && { title }),
          ...(description && { description }),
          ...(image && { images: [image] }),
        }
      : baseMetadata.twitter,
  };
}

// Esquemas estructurados para eventos deportivos
export function generateMatchSchema(match: {
  homeTeam: string;
  awayTeam: string;
  startDate: string;
  location: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${match.homeTeam} vs ${match.awayTeam}`,
    "startDate": match.startDate,
    "location": {
      "@type": "Place",
      "name": match.location,
    },
    "description": match.description || `Partido entre ${match.homeTeam} y ${match.awayTeam}`,
    "performer": [
      {
        "@type": "SportsTeam",
        "name": match.homeTeam
      },
      {
        "@type": "SportsTeam",
        "name": match.awayTeam
      }
    ]
  };
}
