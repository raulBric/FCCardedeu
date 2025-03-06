import Image from "next/image"
import Equipo from "@/assets/Equipo.webp"

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src={Equipo}
        alt="Primera plantilla del FC Cardedeu"
        layout="fill"
        objectFit="cover"
        priority
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-club-primary to-club-accent opacity-70"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <h1 className="text-5xl md:text-7xl font-bold text-white text-center drop-shadow-lg px-4">
          Viu la Passió amb FC Cardedeu!
        </h1>
      </div>
    </section>
  )
}

