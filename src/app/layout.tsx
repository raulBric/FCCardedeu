import Footer from "../components/Footer";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import type React from "react";
import { baseMetadata } from "@/lib/metadata";
import { OrganizationSchema } from "@/components/SEO";
import { BaseOpenGraph } from "@/components/SEO";

const exo2 = Exo_2({ subsets: ["latin"] });

export const metadata = {
  ...baseMetadata,
  metadataBase: new URL("https://www.fccardedeu.org"),
  openGraph: {
    ...baseMetadata.openGraph,
    url: "https://www.fccardedeu.org",
    siteName: "FC Cardedeu",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ca">
      <head>
        {/* Schema.org para SEO */}
        <OrganizationSchema url="https://www.fccardedeu.org" />
        
        {/* OpenGraph básico para todo el sitio */}
        <BaseOpenGraph
          title="FC Cardedeu - Club de fútbol de Cardedeu"
          description="FC Cardedeu, club de fútbol con más de 90 años de historia en Cardedeu, Barcelona. Formación de jugadores y competición en todas las categorías."
          url="https://www.fccardedeu.org"
          locale="ca_ES"
        />
      </head>
      <body className={exo2.className}>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
