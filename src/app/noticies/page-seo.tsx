// Este archivo contiene los componentes SEO para la página de noticias
// Se importa en page.tsx para mantener la lógica separada

import { Metadata } from "next";
import { SEOManager } from "@/components/SEO";

// Metadatos estáticos para el listado de noticias
export const metadata: Metadata = {
  title: "Notícies | FC Cardedeu",
  description: "Mantingues-te informat de totes les novetats del FC Cardedeu. Resultats, esdeveniments, canvis al club i molt més.",
  openGraph: {
    type: "website",
    title: "Notícies | FC Cardedeu",
    description: "Mantingues-te informat de totes les novetats del FC Cardedeu. Resultats, esdeveniments, canvis al club i molt més.",
    url: "https://www.fccardedeu.org/noticies",
    siteName: "FC Cardedeu",
    images: [
      {
        url: "/images/og-noticies.jpg", // Imagen específica para la sección de noticias
        width: 1200,
        height: 630,
        alt: "Notícies FC Cardedeu",
      }
    ],
    locale: "ca_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notícies | FC Cardedeu",
    description: "Mantingues-te informat de totes les novetats del FC Cardedeu",
    images: ["/images/og-noticies.jpg"],
  }
};

// Componente SEO para inyectar Schema.org en la página de listado de noticias
export function NewsListingSEO() {
  return (
    <>
      <SEOManager 
        type={["organization", "breadcrumb"]} 
        data={{
          items: [
            { name: "Inici", url: "/" },
            { name: "Notícies", url: "/noticies" }
          ]
        }}
        baseUrl="https://www.fccardedeu.org"
      />
    </>
  );
}
