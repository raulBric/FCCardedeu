import Footer from "../components/Footer";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import type React from "react";
import Header from "../components/Header";


const exo2 = Exo_2({ subsets: ["latin"] });

export const metadata = {
  title: "FC Cardedeu | Web Oficial",
  description: "Sitio oficial del FC Cardedeu",
  icons: { icon: "/favicon.ico" },
  other: { "theme-color": "#D81E05" },
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={exo2.className}>
        <Header /> 
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
