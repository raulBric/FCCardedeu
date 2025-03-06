import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Logo y descripción */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-white flex items-center">
              ⚽ FC Cardedeu
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Empoderamos el fútbol local con pasión y compromiso desde 1934. Únete a nuestra familia deportiva.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resultados" className="text-sm hover:text-blue-500 transition-colors">
                  Resultados
                </Link>
              </li>
              <li>
                <Link href="/clasificacion" className="text-sm hover:text-blue-500 transition-colors">
                  Clasificación
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-sm hover:text-blue-500 transition-colors">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/jugadores" className="text-sm hover:text-blue-500 transition-colors">
                  Jugadores
                </Link>
              </li>
              <li>
                <Link href="/gestion-jugadores" className="text-sm hover:text-blue-500 transition-colors">
                  Gestión de Jugadores
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                <a href="mailto:info@fccardedeu.com" className="hover:text-blue-500 transition-colors">
                  info@fccardedeu.com
                </a>
              </li>
              <li className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2 text-blue-500" />
                <a href="tel:+34900000000" className="hover:text-blue-500 transition-colors">
                  +34 900 000 000
                </a>
              </li>
              <li className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span>Cardedeu, Barcelona</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-white font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} FC Cardedeu. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacidad" className="text-sm text-gray-400 hover:text-blue-500 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-blue-500 transition-colors">
                Política de Cookies
              </Link>
              <Link href="/legal" className="text-sm text-gray-400 hover:text-blue-500 transition-colors">
                Aviso Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

