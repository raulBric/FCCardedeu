import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";   
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SponsorsSection from "@/components/SponsorSection";
import MatchResults from "@/components/MatchResults";
import LatestNewsSection from "@/components/LatestNewsSection";
import AdBanner from "@/components/AdBanner";
import Damm from "@/assets/Patrocinadores/damm.png";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <MatchResults/>
      <AdBanner adUrl="https://example.com" imageUrlMobile={Damm} imageUrlDesktop={Damm} altText="Anunci publicitari" sponsorName="Patrocinador Oficial" />
      <LatestNewsSection />
      <SponsorsSection />
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-club-primary">
            Uneix-te al nostre club
          </h2>
          <p className="mb-8 text-lg text-gray-700">
            Forma part de la família FC Cardedeu. Ja sigui com a jugador,
            aficionat o patrocinador, hi ha un lloc per a tu al nostre club.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/inscripcio">Inscripció de Jugadors</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/pagaments">Pagament de Quotes</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/patrocini">Patrocina el Club</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
