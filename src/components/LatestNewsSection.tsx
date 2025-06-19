"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Calendar, ChevronRight, Clock, ArrowRight } from "lucide-react"
import { getLatestNews } from "@/services/supabaseService"
import { Noticia } from "@/services/dashboardService"
import { generarSlug } from "@/utils/slugUtils"


// Tipos para las noticias (local del componente)
export interface NewsCategory {
  id: number
  name: string
  slug: string
}

export interface NewsItem {
  id: number
  title: string
  slug: string
  excerpt: string
  content?: string
  date: string
  readTime?: string
  imageUrl: string
  category: NewsCategory
}

// Mapeador para convertir las noticias de Supabase al formato del componente
const mapNoticiaToNewsItem = (noticia: Noticia): NewsItem => {
  // Extrae un extracto del contenido (primeros 150 caracteres)
  const excerpt = noticia.contenido
    .replace(/<[^>]+>/g, '') // Eliminar etiquetas HTML si las hay
    .slice(0, 150)
    .trim();
  
  // Determina la categoría de la noticia
  const categoriaSlug = noticia.categoria?.toLowerCase().replace(/\s+/g, '-') || 'general';
  const categoriaObj = {
    id: Math.random(), // ID único temporal
    name: noticia.categoria || 'General',
    slug: categoriaSlug
  };
  
  // Calcula tiempo de lectura estimado (1 min por cada 200 palabras)
  const wordCount = noticia.contenido.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;
  
  // Genera un slug amigable para SEO
  const slug = generarSlug(noticia.titulo, noticia.id);
  
  return {
    id: noticia.id,
    title: noticia.titulo,
    slug: slug,
    excerpt: excerpt,
    content: noticia.contenido,
    date: noticia.fecha,
    readTime: readTime,
    imageUrl: noticia.imagen_url || '/placeholder.svg?height=400&width=600',
    category: categoriaObj
  };
};

// Props para el componente
interface LatestNewsSectionProps {
  title?: string
  viewAllLink?: string
  limit?: number
  useSampleData?: boolean
}

// Datos de ejemplo (se usarán si no se proporcionan datos externos)
const sampleCategories: NewsCategory[] = [
  { id: 1, name: "Primer Equip", slug: "primer-equip" },
  { id: 2, name: "Club", slug: "club" },
  { id: 3, name: "Futbol Base", slug: "futbol-base" },
  { id: 4, name: "Femení", slug: "femeni" },
]

const sampleNews: NewsItem[] = [
  {
    id: 1,
    title: "Victòria important del primer equip contra el CF Mollet",
    slug: "victoria-important-primer-equip-cf-mollet",
    excerpt: "El FC Cardedeu aconsegueix tres punts vitals en un partit molt disputat al camp municipal.",
    date: "2025-03-12",
    readTime: "3 min",
    imageUrl: "/placeholder.svg?height=400&width=600",
    category: sampleCategories[0],
  },
  {
    id: 2,
    title: "Obertes les inscripcions per al Campus d'Estiu 2025",
    slug: "inscripcions-campus-estiu-2025",
    excerpt: "Ja pots inscriure als teus fills al campus d'estiu del FC Cardedeu. Places limitades!",
    date: "2025-03-10",
    readTime: "2 min",
    imageUrl: "/placeholder.svg?height=400&width=600",
    category: sampleCategories[1],
  },
  {
    id: 3,
    title: "L'Infantil A es classifica per a la fase final del torneig comarcal",
    slug: "infantil-a-fase-final-torneig-comarcal",
    excerpt: "Els nostres infantils han fet una gran temporada i lluitaran pel títol el proper cap de setmana.",
    date: "2025-03-08",
    readTime: "4 min",
    imageUrl: "/placeholder.svg?height=400&width=600",
    category: sampleCategories[2],
  },
  {
    id: 4,
    title: "El femení A aconsegueix l'ascens a Primera Divisió",
    slug: "femeni-a-ascens-primera-divisio",
    excerpt: "Les nostres jugadores han fet història aconseguint l'ascens a la màxima categoria del futbol català.",
    date: "2025-03-05",
    readTime: "5 min",
    imageUrl: "/placeholder.svg?height=400&width=600",
    category: sampleCategories[3],
  },
]

export default function LatestNewsSection({
  title = "Últimes Notícies",
  viewAllLink = "/noticies",
  limit = 4,
  useSampleData = false,
}: LatestNewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  
  // Cargar noticias desde Supabase
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Si estamos en modo ejemplo, usamos datos de muestra
        if (useSampleData) {
          setNews(sampleNews);
          setLoading(false);
          return;
        }
        
        // Obtener noticias reales de Supabase
        const noticiasData = await getLatestNews(limit);
        
        // Mapear a formato del componente
        const newsItems = noticiasData.map(mapNoticiaToNewsItem);
        
        setNews(newsItems);
      } catch (error) {
        console.error("Error al cargar noticias:", error);
        // Fallback a datos de ejemplo si hay un error
        setNews(sampleNews);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [limit, useSampleData])

  // Filtrar noticias por categoría si hay una categoría activa
  const filteredNews = activeCategory ? news.filter((item) => item.category.slug === activeCategory) : news

  // Obtener categorías únicas de las noticias
  const categories = Array.from(new Set(news.map((item) => item.category.slug)))
    .map((slug) => {
      const category = news.find((item) => item.category.slug === slug)?.category
      return category
    })
    .filter((category): category is NewsCategory => category !== undefined)

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("ca-ES", options)
  }


  return (
    <section ref={sectionRef} className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-4 md:mb-0"
          >
            {title}
          </motion.h2>

          {/* Filtros de categoría en desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex space-x-2"
          >
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                activeCategory === null ? "bg-red-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Totes
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeCategory === category.slug
                    ? "bg-red-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Filtros de categoría en móvil (select) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:hidden w-full mb-4"
          >
            <select
              value={activeCategory || ""}
              onChange={(e) => setActiveCategory(e.target.value || null)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700"
            >
              <option value="">Totes les categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {loading ? (
          // Skeleton loader cuando está cargando
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grid de noticias
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNews.length > 0 ? (
              filteredNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 50,
                  }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <Link href={`/noticies/${item.slug}`} className="block relative">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        width="400"
                        height="300"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 left-3 bg-red-700 text-white text-xs font-medium px-2 py-1 rounded">
                        {item.category.name}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center text-gray-500 text-sm mb-2 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(item.date)}
                        </div>
                        {item.readTime && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {item.readTime}
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2 group-hover:text-red-700 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">{item.excerpt}</p>

                      <div className="flex items-center text-red-700 font-medium group-hover:text-red-800 transition-colors">
                        Llegir més
                        <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))
            ) : (
              // Mensaje cuando no hay noticias
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No hi ha notícies disponibles en aquesta categoria.</p>
              </div>
            )}
          </div>
        )}

        {/* Enlace para ver todas las noticias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            href={viewAllLink}
            className="inline-flex items-center text-red-700 font-medium hover:text-red-800 transition-colors"
          >
            Veure totes les notícies
            <ChevronRight className="ml-1 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
