import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import Escudo from "@/assets/Escudo.png";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-300 py-12">
      <div className="container mx-auto px-6 md:px-12">
        {/* Contenedor principal - CENTRADO en Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          {/* Logo y descripción */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Link
              href="/"
              className="flex flex-col items-center md:items-start"
            >
              <img
                src={Escudo?.src || "/placeholder.svg"}
                alt="FC Cardedeu"
                width="96"
                height="96"
                className="w-20 h-20 sm:w-24 sm:h-24 transition-all duration-300"
                loading="lazy"
              />
              <span className="text-lg font-bold text-white mt-2">
                FC Cardedeu
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Empoderem el futbol local amb passió i compromís.
              Uneix-te a la nostra família esportiva.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Enllaços Ràpids</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resultados"
                  className="text-sm hover:text-blue-500 transition-colors"
                >
                  Resultats
                </Link>
              </li>
              <li>
                <Link
                  href="/clasificacion"
                  className="text-sm hover:text-blue-500 transition-colors"
                >
                  Classificació
                </Link>
              </li>
              <li>
                <Link
                  href="/noticies"
                  className="text-sm hover:text-blue-500 transition-colors"
                >
                  Notícies
                </Link>
              </li>
              <li>
                <Link
                  href="/jugadores"
                  className="text-sm hover:text-blue-500 transition-colors"
                >
                  Jugadors
                </Link>
              </li>
              <li>
                <Link
                  href="/gestion-jugadores"
                  className="text-sm hover:text-blue-500 transition-colors"
                >
                  Gestió de Jugadors
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Contacte</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start text-sm">
                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                <a
                  href="mailto:info@fccardedeu.com"
                  className="hover:text-blue-500 transition-colors"
                >
                  info@fccardedeu.com
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start text-sm">
                <Phone className="w-4 h-4 mr-2 text-blue-500" />
                <a
                  href="tel:+34938713131"
                  className="hover:text-blue-500 transition-colors"
                >
                  +34 938 71 31 31
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start text-sm">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <a
                  href="https://maps.app.goo.gl/it6qNZzNC1doUkPB8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  Cardedeu, Barcelona
                </a>
              </li>
            </ul>
          </div>

          {/* Redes sociales y MyClub */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Segueix-nos</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://www.tiktok.com/@fccardedeu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
                aria-label="TikTok - FC Cardedeu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
              <a
                href="https://x.com/FCCardedeu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
                aria-label="X (Twitter) - FC Cardedeu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/fccardedeu/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
                aria-label="Instagram - FC Cardedeu"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* MyClub */}
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-2">El Meu Club</h3>
              <Link
                href="/my-club"
                className="flex items-center space-x-2 text-blue-500 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Accedir a MyClub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-center">
            <p className="text-sm text-gray-400">
              © 2025 FC Cardedeu. Tots els drets reservats.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/privacidad"
                className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
              >
                Política de Privacitat
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
              >
                Política de Cookies
              </Link>
              <Link
                href="/legal"
                className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
              >
                Avís Legal
              </Link>
            </div>
          </div>
          
          {/* Créditos digital.io */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center">
            <p className="text-xs text-gray-500">
              Impulsa la teva presència digital amb <a href="https://dgital.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">dgital.io</a> | Experts en transformació web
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
