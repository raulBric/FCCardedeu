"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Newspaper, 
  Trophy, 
  Users, 
  Calendar, 
  Eye, 
  ArrowRight,
  Clock,
  FileEdit,
  AlertCircle,
  UserRound,
  ClipboardPenLine,
  Bell,
  Pencil
} from "lucide-react";
import Image from "next/image";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/dashboard/FormComponents";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { 
  obtenerNoticias, 
  obtenerResultados, 
  obtenerPatrocinadores, 
  obtenerInscripciones, 
  Noticia, 
  Resultado, 
  Patrocinador, 
  InscripcionDashboard as Inscripcion
} from "@/adapters/ServiceAdapters";
// Usar el adaptador en lugar del servicio eliminado
import { obtenerJugadors } from "@/adapters/ServiceAdapters";

export default function DashboardPage() {
  const router = useRouter();
    // Tipo para el partido próximo
  interface ProximoPartido {
    id: number;
    equipo_local: string;
    equipo_visitante: string;
    fecha: string;
    categoria: string;
  }

  interface DashboardStats {
    noticias: number;
    resultados: number;
    patrocinadores: number;
    inscripciones: number;
    inscripcionesPendientes: number;
    jugadores: number;
    patrocinadorPrincipal: boolean;
    ultimaNoticia: Noticia | null;
    ultimasInscripciones: Inscripcion[];
    proximoPartido: ProximoPartido | null;
    isLoading: boolean;
  }



  const [stats, setStats] = useState<DashboardStats>({
    noticias: 0,
    resultados: 0,
    patrocinadores: 0,
    inscripciones: 0,
    inscripcionesPendientes: 0,
    jugadores: 0,
    patrocinadorPrincipal: false,
    ultimaNoticia: null,
    ultimasInscripciones: [],
    proximoPartido: null,
    isLoading: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Cargar datos en orden y manejar errores individualmente
        // 1. Cargar noticias
        let noticiasTotal: Noticia[] = [];
        let noticiasRecientes: Noticia[] = [];
        try {
          // Para las noticias, limitar a un número razonable para evitar problemas de rendimiento
          noticiasTotal = await obtenerNoticias(100, 0); // Limitar a 100 para conteo
          
          // Asegurarnos de que las noticias están ordenadas por fecha (más reciente primero)
          noticiasTotal.sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });
          
          noticiasRecientes = noticiasTotal.slice(0, 10); // Usar solo las 10 más recientes para mostrar
          console.log("Noticias cargadas correctamente:", noticiasTotal.length, "La más reciente es:", noticiasRecientes[0]?.titulo);
        } catch (noticiasError) {
          console.error("Error específico al cargar noticias:", noticiasError);
          // Continuar con otras cargas de datos
        }
        
        // 2. Cargar resultados
        let resultados: Resultado[] = [];
        try {
          resultados = await obtenerResultados(10, 0);
        } catch (resultadosError) {
          console.error("Error al cargar resultados:", resultadosError);
        }
        
        // 3. Cargar patrocinadores
        let patrocinadores: Patrocinador[] = [];
        let patrocinadorPrincipal: Patrocinador | null = null;
        try {
          patrocinadores = await obtenerPatrocinadores(50, 0);
          // Encontrar el patrocinador principal
          patrocinadorPrincipal = patrocinadores.find(p => p.tipo === 'principal' && p.activo) || null;
        } catch (patroError) {
          console.error("Error al cargar patrocinadores:", patroError);
        }
        
        // 4. Cargar inscripciones - Obtener TODAS las inscripciones para mostrar conteo exacto
        let inscripciones: Inscripcion[] = [];
        let inscripcionesPendientes: number = 0;
        try {
          // Aumentamos el límite para mostrar todas las inscripciones existentes
          // (Si hay miles, considerar implementar paginación en el backend)
          inscripciones = await obtenerInscripciones(1000, 0);
          console.log(`Se han cargado ${inscripciones.length} inscripciones en total`);
          inscripcionesPendientes = inscripciones.filter(i => i.estado === 'pendiente').length;
          console.log(`De las cuales ${inscripcionesPendientes} están pendientes`);
        } catch (inscError) {
          console.error("Error al cargar inscripciones:", inscError);
        }
        
        // 5. Cargar jugadores (usando el nuevo servicio jugadorService)
        let jugadores: Record<string, unknown>[] = [];
        try {
          // Obtener jugadores de la nueva tabla 'jugadors'
          const jugadorsData = await obtenerJugadors();
          
          // Convertir al formato antiguo para mantener compatibilidad con el dashboard
          jugadores = jugadorsData.map(j => ({
            id: j.id,
            nombre: j.nom,
            apellidos: j.cognoms,
            fecha_nacimiento: j.data_naixement,
            posicion: j.posicio || '',
            dorsal: '', // Valor por defecto ya que no existe en la interfaz Jugador
            imagen_url: j.imatge_url,
            categoria: j.categoria || '',
            equipo: j.categoria || '',
            temporada: '2024-2025',
            dni_nie: j.dni_nie || '',
            email: j.email || '',
            telefono: j.telefon || '',
            direccion: j.direccio || '',
            ciudad: j.poblacio || '',
            codigo_postal: j.codi_postal || '',
            observaciones: j.observacions || '',
            activo: j.estat === 'actiu'
          }));
        } catch (jugadoresError) {
          console.error("Error al cargar jugadores:", jugadoresError);
        }
        
        // Encontrar el próximo partido (simulado)
        const proximoPartido: ProximoPartido = {
          id: 1,
          equipo_local: "FC Cardedeu",
          equipo_visitante: "CE Europa",
          fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días en el futuro
          categoria: "Primer Equip"
        };
        
        // Actualizar stats con los datos disponibles
        setStats({
          noticias: noticiasTotal.length,
          resultados: resultados.length,
          patrocinadores: patrocinadores.length,
          inscripciones: inscripciones.length,
          inscripcionesPendientes,
          jugadores: jugadores.length,
          patrocinadorPrincipal: !!patrocinadorPrincipal,
          // Aseguramos que ultimaNoticia sea realmente la más reciente por fecha
          ultimaNoticia: noticiasRecientes.length > 0 ? noticiasRecientes[0] : null,
          ultimasInscripciones: inscripciones.filter(i => i.estado === 'pendiente').slice(0, 3),
          proximoPartido,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error general al cargar datos del dashboard:", error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    }
    
    fetchData();
  }, []);

  const metricCards = [
    {
      title: "Inscripcions",
      value: stats.inscripciones,
      icon: ClipboardPenLine,
      color: "bg-red-500",
      link: "/dashboard/inscripciones", // Aseguramos que esta ruta sea correcta
      badge: stats.inscripcionesPendientes > 0 ? stats.inscripcionesPendientes.toString() : undefined,
      badgeColor: "bg-yellow-400"
    },
    {
      title: "Jugadors",
      value: stats.jugadores,
      icon: UserRound,
      color: "bg-blue-500",
      link: "/dashboard/jugadors"
    },
    {
      title: "Resultats",
      value: stats.resultados,
      icon: Trophy,
      color: "bg-green-500",
      link: "/dashboard/resultats"
    },
    {
      title: "Notícies",
      value: stats.noticias,
      icon: Newspaper,
      color: "bg-purple-500",
      link: "/dashboard/noticies"
    }
  ];

  return (
    <DashboardLayout title="Dashboard" description="Gestió del contingut del lloc web">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold mt-1">
                      {stats.isLoading ? "-" : card.value}
                    </p>
                  </div>
                  <div className="relative">
                    <div className={`p-3 rounded-full ${card.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {card.badge && (
                      <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${card.badgeColor} text-xs font-bold text-white`}>
                        {card.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Link 
                href={card.link}
                className="block py-3 px-6 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
              >
                Veure detalls <ArrowRight className="h-4 w-4 inline-block ml-1" />
              </Link>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas noticias */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Última notícia publicada {stats.ultimaNoticia && <span className="text-sm text-gray-500 font-normal">{new Date(stats.ultimaNoticia.fecha).toLocaleDateString('ca-ES')}</span>}</CardTitle>
          </CardHeader>
          <CardContent>
          {stats.isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse flex flex-col w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-32 bg-gray-200 rounded mb-3"></div>
              </div>
            </div>
          ) : stats.ultimaNoticia ? (
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
              {/* Imagen destacada */}
              {stats.ultimaNoticia?.imagen_url ? (
                <div className="w-full h-40 relative">
                  <Image 
                    src={stats.ultimaNoticia.imagen_url} 
                    alt={stats.ultimaNoticia.titulo}
                    className="w-full h-full object-cover" 
                    width={500}
                    height={160}
                  />
                  {stats.ultimaNoticia.destacada && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-sm">
                      Destacada
                    </div>
                  )}
                </div>
              ) : null}
              
              {/* Contenido - Estamos seguros que ultimaNoticia no es null en este contexto */}
              <div className="p-4">
                {/* Metadatos */}
                <div className="flex items-center mb-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{new Date(stats.ultimaNoticia?.fecha || Date.now()).toLocaleDateString('ca-ES')}</span>
                  
                  {stats.ultimaNoticia?.autor && (
                    <>
                      <span className="mx-1">•</span>
                      <FileEdit className="h-3 w-3 mr-1" />
                      <span>{stats.ultimaNoticia.autor}</span>
                    </>
                  )}
                  
                  {stats.ultimaNoticia?.categoria && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                        {stats.ultimaNoticia.categoria}
                      </span>
                    </>
                  )}
                </div>
                
                {/* Título */}
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {stats.ultimaNoticia?.titulo || ""}
                </h3>
                
                {/* Extracto */}
                <div className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {stats.ultimaNoticia?.contenido?.replace(/<[^>]*>/g, '') || ""}
                </div>
                
                {/* Acciones */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    iconRight={<Eye className="h-4 w-4" />}
                    onClick={() => {
                      if (stats.ultimaNoticia) {
                        router.push(`/noticies/${stats.ultimaNoticia.titulo.toLowerCase().replace(/\s+/g, '-')}-${stats.ultimaNoticia.id}`);
                      }
                    }}
                  >
                    Veure publicada
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    size="sm"
                    iconRight={<Pencil className="h-4 w-4" />}
                    onClick={() => {
                      if (stats.ultimaNoticia) {
                        router.push(`/dashboard/noticies/${stats.ultimaNoticia.id}/editar`);
                      }
                    }}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No hi ha notícies publicades</p>
              <Button 
                variant="primary" 
                onClick={() => router.push('/dashboard/noticies/crear')}
              >
                Crear la primera notícia
              </Button>
            </div>
          )}
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/noticies" className="w-full">
              <Button variant="outline" fullWidth iconRight={<ArrowRight className="h-4 w-4" />}>
                Gestionar notícies
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Próximo partido y alertas */}
        <div className="flex flex-col gap-6">
          {/* Inscripciones pendientes */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Inscripcions pendents</CardTitle>
            </CardHeader>
            <CardContent>
            {stats.isLoading ? (
              <div className="animate-pulse flex flex-col">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
              </div>
            ) : stats.ultimasInscripciones.length > 0 ? (
              <div className="divide-y">
                {stats.ultimasInscripciones.map((inscripcion) => (
                  <div 
                    key={inscripcion.id}
                    className="py-3 hover:bg-gray-50 cursor-pointer rounded-md px-2"
                    onClick={() => router.push(`/dashboard/inscripciones/${inscripcion.id}`)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">{inscripcion.player_name}</p>
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        Pendent
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <span>{inscripcion.team}</span>
                      <span className="mx-1">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(inscripcion.created_at).toLocaleDateString('ca-ES')}</span>
                    </div>
                  </div>
                ))}
                
                {stats.inscripcionesPendientes > stats.ultimasInscripciones.length && (
                  <div className="py-3 text-center text-sm text-gray-500">
                    + {stats.inscripcionesPendientes - stats.ultimasInscripciones.length} inscripcions més
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No hi ha inscripcions pendents</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Totes les inscripcions han estat processades.
                </p>
              </div>
            )}
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/inscripciones" className="w-full">
                <Button variant="outline" fullWidth iconRight={<ArrowRight className="h-4 w-4" />}>
                  Gestionar inscripcions
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Próximo partido */}
          <Card>
            <CardHeader>
              <CardTitle>Proper partit</CardTitle>
            </CardHeader>
            <CardContent>
            {stats.isLoading ? (
              <div className="animate-pulse flex flex-col">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between mb-3">
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ) : stats.proximoPartido ? (
              <div>
                <div className="flex justify-between items-center py-3">
                  <div className="text-center">
                    <p className="font-bold text-xl">{stats.proximoPartido.equipo_local}</p>
                  </div>
                  
                  <div className="text-center px-3">
                    <p className="text-lg font-semibold text-gray-500">VS</p>
                    <p className="text-sm text-gray-500">
                      {new Date(stats.proximoPartido.fecha).toLocaleDateString('ca-ES')}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-bold text-xl">{stats.proximoPartido.equipo_visitante}</p>
                  </div>
                </div>
                
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-500">{stats.proximoPartido.categoria}</p>
                </div>
                
                <div className="flex justify-end mt-3">
                  <Button 
                    variant="outline" 
                    iconRight={<Eye className="h-4 w-4" />}
                    onClick={() => router.push(`/dashboard/calendari`)}  
                  >
                    Veure calendari
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No hi ha partits programats</p>
              </div>
            )}
            </CardContent>
          </Card>
          
          {/* Alertas y acciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Accions ràpides</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => router.push('/dashboard/noticies/crear')}
                iconLeft={<Newspaper className="h-4 w-4" />}
              >
                Afegir notícia
              </Button>
              
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => router.push('/dashboard/resultats/crear')}
                iconLeft={<Trophy className="h-4 w-4" />}
              >
                Afegir resultat
              </Button>
              
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => router.push('/dashboard/patrocinadors')}
                iconLeft={<Users className="h-4 w-4" />}
              >
                Gestionar patrocinadors
              </Button>
              
              {!stats.patrocinadorPrincipal && (
                <div className="mt-5 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm text-yellow-700 font-medium">
                        No hi ha cap patrocinador principal actiu
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">
                        És recomanable tenir un patrocinador principal per mostrar-lo destacat al web.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

