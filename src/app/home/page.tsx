"use client";

import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";   
import SponsorsSection from "@/components/SponsorSection";
import MatchResults from "@/components/MatchResults";
import LatestNewsSection from "@/components/LatestNewsSection";
import AdBanner from "@/components/AdBanner";
import Damm from "@/assets/Patrocinadores/damm.png";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Comprobar si el usuario tiene acceso (CÓDIGO TEMPORAL - ELIMINAR CUANDO SE QUITE EL MODO MANTENIMIENTO)
  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window !== "undefined") {
      const hasAccess = localStorage.getItem('fcCardedeuAccess') === 'granted';
      if (!hasAccess) {
        router.replace('/');
      }
    }
  }, [router]);

  return (
    <>
      <Header />
      <HeroSection />
      <MatchResults/>
      <AdBanner adUrl="https://example.com" imageUrlMobile={Damm} imageUrlDesktop={Damm} altText="Anunci publicitari" sponsorName="Patrocinador Oficial" />
      <LatestNewsSection />
      <SponsorsSection />
    </>
  );
}
