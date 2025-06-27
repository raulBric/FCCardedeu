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
    images: [
      {
        url: '/Escudo.webp',
        width: 300,
        height: 300,
        alt: 'Escudo FC Cardedeu',
      }
    ],
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
        <OrganizationSchema url="https://www.fccardedeu.org" logo="/Escudo.webp" />
      </head>
      <body className={exo2.className}>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
