import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
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
              <Image
                src={Escudo || "/placeholder.svg"}
                alt="FC Cardedeu"
                className="w-20 h-20 sm:w-24 sm:h-24 transition-all duration-300"
              />
              <span className="text-lg font-bold text-white mt-2">
                FC Cardedeu
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Empoderamos el fútbol local con pasión y compromiso desde 1934.
              Únete a nuestra familia deportiva.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resultados"
                  className="text-sm hover:text-blue-500 transition-colors"
                >
                  Resultados
                </Link>
              </li>
              <li>
                <Link
                  href="/clasificacion"
                  className="text-sm hover:text-blue-500 transition-colors"
                >
                  Clasificación
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
                  Jugadores
                </Link>
              </li>
              <li>
                <Link
                  href="/gestion-jugadores"
                  className="text-sm hover:text-blue-500 transition-colors"
                >
                  Gestión de Jugadores
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
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
                  href="tel:+34900000000"
                  className="hover:text-blue-500 transition-colors"
                >
                  +34 900 000 000
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
            <h3 className="text-white font-semibold mb-4">Síguenos</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* MyClub */}
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-2">Mi Club</h3>
              <Link
                href="/my-club"
                className="flex items-center space-x-2 text-blue-500 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Acceder a MyClub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} FC Cardedeu. Todos los derechos
              reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/privacidad"
                className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
              >
                Política de Privacidad
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
                Aviso Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
