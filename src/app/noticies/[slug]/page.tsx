"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { obtenerNoticias, Noticia } from "@/services/dashboardService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { generarSlug, obtenerIdDesdeSlug } from "@/utils/slugUtils";

export default function NoticiaDetallePage() {
  const params = useParams();
  const slug = params.slug as string;
  const noticiaId = obtenerIdDesdeSlug(slug); // Extraer el ID del slug usando la utilidad
  
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [noticiasRelacionadas, setNoticiasRelacionadas] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function cargarNoticia() {
      try {
        setIsLoading(true);
        // Cargar todas las noticias y encontrar la que corresponde al slug
        const todasNoticias = await obtenerNoticias(50, 0);
        
        // Encontrar la noticia actual por ID
        const noticiaActual = todasNoticias.find(n => n.id === noticiaId) || null;
        setNoticia(noticiaActual);
        
        // Encontrar noticias relacionadas (misma categoría, excluyendo la actual)
        if (noticiaActual?.categoria) {
          const relacionadas = todasNoticias
            .filter(n => 
              n.id !== noticiaId && 
              n.categoria === noticiaActual.categoria
            )
            .slice(0, 3);
          setNoticiasRelacionadas(relacionadas);
        }
      } catch (error) {
        console.error("Error al cargar noticia:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (noticiaId) {
      cargarNoticia();
    }
  }, [noticiaId, slug]);
  
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
  
  // Calcular tiempo de lectura estimado (1 min por cada 200 palabras)
  const calcularTiempoLectura = (contenido: string) => {
    const wordCount = contenido.split(/\s+/).length;
    return `${Math.max(1, Math.ceil(wordCount / 200))} min`;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  if (!noticia) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow py-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Notícia no trobada</h1>
              <p className="text-gray-600 mb-6">La notícia que estàs buscant no existeix o ha estat eliminada.</p>
              <Link 
                href="/noticies" 
                className="inline-flex items-center text-red-700 font-medium hover:text-red-800 transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Tornar a notícies
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Navegación de migas de pan */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                    Inici
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Link href="/noticies" className="ml-1 text-sm text-gray-500 hover:text-gray-700 md:ml-2">
                      Notícies
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="ml-1 text-sm text-gray-700 md:ml-2 truncate max-w-[200px] md:max-w-xs">
                      {noticia.titulo}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Título y metadatos */}
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{noticia.titulo}</h1>
            
            <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(noticia.fecha)}
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {calcularTiempoLectura(noticia.contenido)}
              </div>
              
              {noticia.autor && (
                <div className="flex items-center">
                  <span className="font-medium text-gray-700">Per: {noticia.autor}</span>
                </div>
              )}
            </div>
            
            {/* Botones para compartir */}
            <div className="mt-4 mb-6 py-3 border-t border-b border-gray-200">
              <ShareButtons 
                url={`${process.env.NEXT_PUBLIC_SITE_URL}/noticies/${slug}`}
                title={noticia.titulo}
                className="mt-6"
              />
            </div>
          </div>
          
          {/* Imagen destacada */}
          {noticia.imagen_url && (
            <div className="max-w-3xl mx-auto mb-10 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full">
                <Image 
                  src={noticia.imagen_url} 
                  alt={noticia.titulo}
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Contenido */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8 prose prose-lg prose-red max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-6
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-red-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:mb-2 prose-li:text-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-red-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:py-1
              prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:mx-auto
              prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
              prose-hr:my-8 prose-hr:border-gray-200
              prose-table:my-8 prose-table:w-full prose-table:border-collapse
              prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
              prose-td:border-t prose-td:border-gray-200 prose-td:p-3
            ">
              {/* Decoración visual del contenido */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700"></div>
              
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Personalizar componentes de ReactMarkdown
                  h1: ({...props}) => <h1 className="border-b border-gray-200 pb-3" {...props} />,
                  h2: ({...props}) => <h2 className="border-b border-gray-100 pb-2" {...props} />,
                  a: ({...props}) => <a className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-500 after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" {...props} />,
                  img: ({src, alt}) => {
                    // Convert string to number for width/height props required by Next.js Image
                    return (
                      <Image 
                        src={src || ''} 
                        alt={alt || 'Imatge de la notícia'} 
                        width={800} 
                        height={600} 
                        className="transition-all duration-300 hover:shadow-lg"
                      />
                    );
                  },
                  blockquote: ({...props}) => (
                    <blockquote className="bg-gray-50 rounded-r-lg overflow-hidden" {...props} />
                  ),
                  code: ({className, ...props}: {className?: string, children?: React.ReactNode}) => {
                    // Para detectar si es un código en línea o un bloque de código
                    const isInline = !className || !className.includes('language-');
                    return isInline ? 
                      <code className="font-mono" {...props} /> : 
                      <code className="block font-mono text-sm" {...props} />;
                  },
                }}
              >
                {noticia.contenido}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Noticias relacionadas */}
          {noticiasRelacionadas.length > 0 && (
            <div className="max-w-3xl mx-auto mt-12 border-t border-gray-200 pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Notícies relacionades
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {noticiasRelacionadas.map((relacionada) => (
                  <div 
                    key={relacionada.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link href={`/noticies/${generarSlug(relacionada.titulo, relacionada.id)}`}>
                      {relacionada.imagen_url && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image 
                            src={relacionada.imagen_url} 
                            alt={relacionada.titulo}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                          {relacionada.categoria && (
                            <div className="absolute top-3 left-3 bg-red-700 text-white text-xs font-medium px-2 py-1 rounded">
                              {relacionada.categoria}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2 hover:text-red-700 transition-colors">
                          {relacionada.titulo}
                        </h3>
                        
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(relacionada.fecha)}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Botón para volver y compartir */}
          <div className="max-w-3xl mx-auto mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <Link 
              href="/noticies" 
              className="inline-flex items-center font-medium text-red-700 hover:text-red-800 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Veure totes les notícies
            </Link>
            
            {/* Botones para compartir (abajo) */}
            <ShareButtons 
              url={`/noticies/${generarSlug(noticia.titulo, noticia.id)}`}
              title={noticia.titulo}
              showLabel={false}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
