"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Search, X, Filter, ArrowRight } from "lucide-react";
import { obtenerNoticias, Noticia } from "@/services/dashboardService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generarSlug } from "@/utils/slugUtils";
import { NewsListingSEO } from "./page-seo";

export default function NoticiasContent() {
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
        (noticia.contenido && noticia.contenido.toLowerCase().includes(busqueda.toLowerCase()))
      : true;
    
    return pasaCategoria && pasaBusqueda;
  });

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Notícies</h1>
        
        {/* Filtros y búsqueda */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar notícies..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {busqueda && (
              <button 
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 items-center overflow-x-auto pb-2">
            <Filter className="text-gray-500" />
            <button 
              onClick={() => setCategoriaSeleccionada(null)}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                !categoriaSeleccionada 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Totes
            </button>
            {categorias.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setCategoriaSeleccionada(cat)}
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                  categoriaSeleccionada === cat 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Grid de noticias */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : noticiasFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticiasFiltradas.map((noticia) => (
              <article key={noticia.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:-translate-y-1">
                <div className="relative h-48 w-full">
                  <Image
                    src={noticia.imagen_url || "/images/noticia-placeholder.jpg"}
                    alt={noticia.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {noticia.categoria && (
                    <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {noticia.categoria}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(noticia.fecha).toLocaleDateString("ca-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 line-clamp-2">
                    {noticia.titulo}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {noticia.contenido?.substring(0, 120) + "..."}
                  </p>
                  <Link
                    href={`/noticies/${generarSlug(noticia.titulo, noticia.id)}`}
                    className="inline-flex items-center text-blue-600 font-medium hover:underline"
                  >
                    Llegir més <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No s'han trobat notícies</h3>
            <p className="text-gray-500">
              No hi ha notícies que coincideixin amb els criteris de cerca.
            </p>
            {busqueda || categoriaSeleccionada ? (
              <button
                onClick={() => {
                  setBusqueda("");
                  setCategoriaSeleccionada(null);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Veure totes les notícies
              </button>
            ) : null}
          </div>
        )}
      </main>
      
      <Footer />
    </>
  );
}
