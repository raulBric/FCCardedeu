"use client"

import { useRef, useEffect } from "react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import Roca from "@/assets/Patrocinadores/RovaVillage.webp"
import Adidas from "@/assets/Patrocinadores/Adidas.png"
import Damm from "@/assets/Patrocinadores/damm.png"
import McDonalds from "@/assets/Patrocinadores/McDonalds.jpeg"
import FutbolEmotion from "@/assets/Patrocinadores/FutbolEmotion.svg"

// Tipos para los patrocinadores
type SponsorTier = "principal" | "colaborador"

interface Sponsor {
  id: number
  name: string
  logo: StaticImageData | string
  url: string
  tier: SponsorTier
}

// Datos de patrocinadores
const sponsorsData: Sponsor[] = [
  { 
    id: 1, 
    name: "Ajuntament de Cardedeu", 
    logo: Roca, 
    url: "https://www.cardedeu.cat", 
    tier: "principal"
  },
  { 
    id: 2, 
    name: "Adidas", 
    logo: Adidas, 
    url: "https://www.adidas.es", 
    tier: "colaborador"
  },
  { 
    id: 3, 
    name: "Damm", 
    logo: Damm, 
    url: "https://www.damm.com", 
    tier: "colaborador"
  },
  { 
    id: 4, 
    name: "McDonald's", 
    logo: McDonalds, 
    url: "https://www.mcdonalds.es", 
    tier: "colaborador"
  },
  { 
    id: 5, 
    name: "Adidas Training", 
    logo: Adidas, 
    url: "https://www.adidas.com/training", 
    tier: "colaborador"
  },
  { 
    id: 6, 
    name: "Grup Damm", 
    logo: Damm, 
    url: "https://www.damm.com", 
    tier: "colaborador"
  },
  { 
    id: 7, 
    name: "Futbol Emotion", 
    logo: FutbolEmotion, 
    url: "https://www.futbolemotion.com", 
    tier: "colaborador"
  },
]

export default function SponsorsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Animación al hacer scroll para revelar los logos
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appear');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.sponsor-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const patrocinadorPrincipal = sponsorsData.find(s => s.tier === "principal");
  const patrocinadores = sponsorsData.filter(s => s.tier === "colaborador");

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-white relative overflow-hidden"
      id="sponsors"
    >
      {/* Fondo minimalista */}
      <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-[200%] aspect-square rounded-full opacity-5 bg-gradient-radial from-gray-900 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-club-primary sm:text-4xl mb-1">
            Els Nostres Patrocinadors
          </h2>
          <div className="w-24 h-1 bg-club-primary mx-auto mb-6"></div>
          <p className="mt-4 text-lg leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Gràcies a tots els nostres patrocinadors pel seu suport al FC Cardedeu
          </p>
        </motion.div>

        {/* Patrocinador Principal */}
        {patrocinadorPrincipal && (
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-2xl"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-medium text-gray-700">Patrocinador Principal</h3>
              </div>
              <Link
                href={patrocinadorPrincipal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-club-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="relative h-40 flex items-center justify-center">
                      <img
                        src={typeof patrocinadorPrincipal.logo === 'string' ? patrocinadorPrincipal.logo : patrocinadorPrincipal.logo?.src || "/placeholder.svg"}
                        alt={patrocinadorPrincipal.name}
                        width="300"
                        height="150"
                        loading="lazy"
                        style={{ objectFit: 'contain' }}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-club-primary/10 text-center py-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{patrocinadorPrincipal.name}</span>
                </div>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Carrusel de Patrocinadores */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-gray-700">Col·laboradors</h3>
          </div>

          <div className="sponsor-carousel overflow-hidden">
            <div className="relative pb-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-12 before:z-10 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:bottom-0 after:w-12 after:z-10 after:bg-gradient-to-l after:from-white after:to-transparent">
              <div className="flex animate-scroll py-6">
                {/* Duplicamos los patrocinadores para crear un carrusel infinito */}
                {[...patrocinadores, ...patrocinadores].map((sponsor, index) => (
                  <div 
                    key={`${sponsor.id}-${index}`} 
                    className="sponsor-item flex-shrink-0 mx-6"
                  >
                    <Link 
                      href={sponsor.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="bg-white rounded-lg shadow-sm p-4 w-40 h-40 flex items-center justify-center hover:shadow-md transition-all duration-300">
                        <div className="relative w-32 h-32">
                          <img
                            src={typeof sponsor.logo === 'string' ? sponsor.logo : sponsor.logo?.src || "/placeholder.svg"}
                            alt={sponsor.name}
                            width="100%"
                            height="100%"
                            loading="lazy"
                            style={{ objectFit: 'contain' }}
                            className="absolute inset-0 transition-all duration-300 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="text-xs font-medium text-gray-500">{sponsor.name}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link 
            href="/patrocini" 
            className="inline-block bg-club-primary hover:bg-club-primary/90 text-white font-medium py-3 px-8 rounded-md transition-colors shadow-sm hover:shadow"
          >
            Converteix-te en patrocinador
          </Link>
        </motion.div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-club-primary/30 to-transparent"></div>
    </section>
  )
}
