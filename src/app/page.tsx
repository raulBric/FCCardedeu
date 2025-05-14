import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";   
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
    </>
  );
}
