"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Search, X, Filter, ArrowRight } from "lucide-react";
import { obtenerNoticias, Noticia } from "@/services/dashboardService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generarSlug } from "@/utils/slugUtils";

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  
  useEffect(() => {
    async function cargarNoticias() {
      try {
        setIsLoading(true);
        const data = await obtenerNoticias(50, 0);
        setNoticias(data);
        
        // Extraer categorías únicas
        const categoriasUnicas = Array.from(
          new Set(data.map(n => n.categoria).filter(Boolean))
        );
        setCategorias(categoriasUnicas as string[]);
      } catch (error) {
        console.error("Error al cargar noticias:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    cargarNoticias();
  }, []);
  
  // Filtrar noticias según categoría y búsqueda
  const noticiasFiltradas = noticias.filter(noticia => {
    const pasaCategoria = categoriaSeleccionada 
      ? noticia.categoria === categoriaSeleccionada 
      : true;
    
    const pasaBusqueda = busqueda 
      ? noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        noticia.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
        (noticia.categoria && noticia.categoria.toLowerCase().includes(busqueda.toLowerCase())) ||
        (noticia.autor && noticia.autor.toLowerCase().includes(busqueda.toLowerCase()))
      : true;
    
    return pasaCategoria && pasaBusqueda;
  });
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      return new Date(dateString).toLocaleDateString("ca-ES", options);
    } catch {
      return dateString;
    }
  };
  
  // Extraer extracto del contenido (primeros 150 caracteres)
  const extraerExtracto = (contenido: string) => {
    return contenido
      .replace(/<[^>]+>/g, '') // Eliminar etiquetas HTML si las hay
      .slice(0, 150)
      .trim() + "...";
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Título y descripción */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Notícies
            </h1>
            <p className="text-gray-600">
              Mantingues-te informat de totes les novetats del FC Cardedeu. Resultats, esdeveniments i molt m&eacute;s.
            </p>
          </div>
          
          {/* Filtros y búsqueda */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <button
                onClick={() => setCategoriaSeleccionada(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  categoriaSeleccionada === null 
                    ? "bg-red-700 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Totes
              </button>
              
              {categorias.map((categoria, index) => (
                <button
                  key={index}
                  onClick={() => setCategoriaSeleccionada(categoria)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    categoriaSeleccionada === categoria 
                      ? "bg-red-700 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {categoria}
                </button>
              ))}
              
              {categoriaSeleccionada && (
                <button
                  onClick={() => setCategoriaSeleccionada(null)}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
                >
                  <X className="h-3 w-3 mr-1" />
                  Esborrar filtre
                </button>
              )}
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cerca notícies..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {busqueda && (
                <button 
                  onClick={() => setBusqueda("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
          
          {/* Listado de noticias */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : noticiasFiltradas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No s&apos;han trobat notícies</h2>
              <p className="text-gray-600 mb-6">
                No hi ha notícies que coincideixin amb els teus criteris de cerca.
              </p>
              <button 
                onClick={() => {
                  setCategoriaSeleccionada(null);
                  setBusqueda("");
                }}
                className="inline-flex items-center text-red-700 font-medium hover:text-red-800 transition-colors"
              >
                <X className="mr-1 h-4 w-4" />
                Esborrar tots els filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {noticiasFiltradas.map((noticia) => (
                <article 
                  key={noticia.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <Link href={`/noticies/${generarSlug(noticia.titulo, noticia.id)}`} className="block">
                    {noticia.imagen_url ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image 
                          src={noticia.imagen_url} 
                          alt={noticia.titulo}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          width={400}
                          height={300}
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {noticia.categoria && (
                          <div className="absolute top-3 left-3 bg-red-700 text-white text-xs font-medium px-2 py-1 rounded">
                            {noticia.categoria}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Sense imatge</span>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(noticia.fecha)}
                        
                        {noticia.destacada && (
                          <span className="ml-3 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                            Destacada
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {extraerExtracto(noticia.contenido)}
                      </p>
                      
                      <div className="flex items-center text-red-700 font-medium group-hover:text-red-800 transition-colors">
                        Llegir més
                        <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
          
          {/* Paginación (futura implementación) */}
          {!isLoading && noticiasFiltradas.length > 0 && (
            <div className="mt-12 flex justify-center">
              <span className="text-gray-500 text-sm">
                Mostrant {noticiasFiltradas.length} notícies
              </span>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
