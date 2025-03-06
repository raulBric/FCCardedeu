import HeroSection from "@/components/HeroSection"
// import NextMatchSection from "./components/NextMatchSection"
// import NoticiasSection from "./components/NoticiasSection"
// import PatrocinadoresSection from "./components/PatrocinadoresSection"
// import PublicidadCards from "./components/PublicidadCards"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// import ScrollAnimation from "./components/ScrollAnimation"

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* <NextMatchSection />
      <PublicidadCards />
      <NoticiasSection />
      <PatrocinadoresSection /> */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          {/* <ScrollAnimation> */}
            <h2 className="text-3xl font-bold mb-8 text-club-primary">Uneix-te al nostre club</h2>
          {/* </ScrollAnimation>
          <ScrollAnimation delay={0.2}> */}
            <p className="mb-8 text-lg text-gray-700">
              Forma part de la família FC Cardedeu. Ja sigui com a jugador, aficionat o patrocinador, hi ha un lloc per
              a tu al nostre club.
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/inscripcio">Inscripció de Jugadors</Link>
              </Button>
              <Button asChild>
                <Link href="/pagaments">Pagament de Quotes</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/patrocini">Patrocina el Club</Link>
              </Button>
            </div>
          {/* </ScrollAnimation> */}
        </div>
      </section>
    </>
  )
}

