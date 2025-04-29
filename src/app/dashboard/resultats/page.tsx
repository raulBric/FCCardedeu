"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  Trophy,
  Shield,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button, DataTable } from "@/components/dashboard/FormComponents";
import Card from "@/components/dashboard/Card";
import { obtenerResultados, eliminarResultado, Resultado } from "@/services/dashboardService";

export default function ResultadosPage() {
  const router = useRouter();
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Cargar resultados
  useEffect(() => {
    async function loadResultados() {
      try {
        setIsLoading(true);
        const data = await obtenerResultados();
        setResultados(data);
      } catch (error) {
        console.error("Error al cargar resultados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadResultados();
  }, []);
  
  // Eliminar resultado
  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await eliminarResultado(deleteId);
      setResultados(prev => prev.filter(r => r.id !== deleteId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error al eliminar resultado:", error);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ca-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };
  
  // Definir columnas para la tabla
  const columns = [
    {
      key: "fecha",
      header: "Data",
      render: (value: string) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span>{formatDate(value)}</span>
        </div>
      )
    },
    {
      key: "partido",
      header: "Partit",
      render: (_: unknown, item: Resultado) => (
        <div>
          <div className="flex items-center justify-between mb-1 font-medium">
            <span className="text-right w-5/12 truncate">{item.equipo_local}</span>
            <div className="flex items-center justify-center space-x-2 w-2/12">
              <span className={`px-2 py-1 rounded text-sm font-bold ${
                item.completado ? 'bg-gray-100' : 'bg-yellow-100'
              }`}>
                {item.completado ? `${item.goles_local} - ${item.goles_visitante}` : 'vs'}
              </span>
            </div>
            <span className="text-left w-5/12 truncate">{item.equipo_visitante}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Trophy className="h-3 w-3 mr-1" />
            <span>{item.categoria}</span>
            
            <span className="mx-1">•</span>
            
            <Shield className="h-3 w-3 mr-1" />
            <span>{item.temporada}</span>
            
            {!item.completado && (
              <>
                <span className="mx-1">•</span>
                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                  Pendent
                </span>
              </>
            )}
          </div>
        </div>
      )
    },
    {
      key: "resultado",
      header: "Resultat",
      render: (_: unknown, item: Resultado) => (
        <div className="text-center">
          {item.completado ? (
            <div>
              <span className={`text-lg font-bold ${
                item.goles_local > item.goles_visitante
                  ? 'text-green-600'
                  : item.goles_local < item.goles_visitante
                    ? 'text-red-600'
                    : 'text-gray-600'
              }`}>
                {item.goles_local} - {item.goles_visitante}
              </span>
              
              <div className="text-xs text-gray-500 mt-1">
                {item.goles_local > item.goles_visitante
                  ? 'Victòria'
                  : item.goles_local < item.goles_visitante
                    ? 'Derrota'
                    : 'Empat'
                }
              </div>
            </div>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pendent
            </span>
          )}
        </div>
      )
    },
    {
      key: "acciones",
      header: "Accions",
      render: (_: unknown, item: Resultado) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/resultats/${item.id}/editar`)}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            {item.completado ? "Editar" : "Completar"}
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(item.id)}
            iconLeft={<Trash2 className="h-4 w-4" />}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];
  
  // Obtener estadísticas generales
  const getEstadisticas = () => {
    const completados = resultados.filter(r => r.completado);
    if (completados.length === 0) return { victorias: 0, derrotas: 0, empates: 0 };
    
    const victorias = completados.filter(r => r.goles_local > r.goles_visitante).length;
    const derrotas = completados.filter(r => r.goles_local < r.goles_visitante).length;
    const empates = completados.filter(r => r.goles_local === r.goles_visitante).length;
    
    return { victorias, derrotas, empates };
  };
  
  const estadisticas = getEstadisticas();
  
  // Obtener categorías
  const getCategorias = () => {
    const categorias = new Set(resultados.map(r => r.categoria));
    return Array.from(categorias);
  };

  return (
    <DashboardLayout 
      title="Resultats" 
      description="Gestiona els resultats dels partits"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Resultats ({resultados.length})
          </h2>
          <p className="text-gray-600">
            Registra i actualitza els resultats dels equips
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => router.push('/dashboard/resultats/crear')}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Afegir resultat
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Últims resultats" className="col-span-2">
          {isLoading ? (
            <div className="animate-pulse space-y-4 py-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : resultados.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No hi ha resultats registrats</p>
              <Button 
                variant="primary" 
                onClick={() => router.push('/dashboard/resultats/crear')}
              >
                Afegir el primer resultat
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {resultados
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .slice(0, 5)
                .map((resultado) => (
                <div 
                  key={resultado.id} 
                  className="py-4 flex items-center hover:bg-gray-50 px-2 rounded-md cursor-pointer"
                  onClick={() => router.push(`/dashboard/resultats/${resultado.id}/editar`)}
                >
                  <div className="w-20 text-sm text-gray-500">
                    {formatDate(resultado.fecha)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{resultado.equipo_local}</span>
                      <div className="px-3">
                        {resultado.completado ? (
                          <span className="font-bold">
                            {resultado.goles_local} - {resultado.goles_visitante}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">vs</span>
                        )}
                      </div>
                      <span className="font-medium">{resultado.equipo_visitante}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{resultado.categoria}</span>
                      
                      {resultado.completado ? (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          resultado.goles_local > resultado.goles_visitante
                            ? 'bg-green-100 text-green-800'
                            : resultado.goles_local < resultado.goles_visitante
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {resultado.goles_local > resultado.goles_visitante
                            ? 'Victòria'
                            : resultado.goles_local < resultado.goles_visitante
                              ? 'Derrota'
                              : 'Empat'
                          }
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                          Pendent
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-2">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
              
              {resultados.length > 5 && (
                <div className="py-3 text-center">
                  <Button 
                    variant="outline"
                    onClick={() => {}}
                  >
                    Veure tots els resultats
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
        
        <Card title="Resum" className="col-span-1">
          {isLoading ? (
            <div className="animate-pulse flex flex-col py-4">
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="py-3 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Victòries</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.victorias}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Empats</p>
                  <p className="text-2xl font-bold text-gray-600">{estadisticas.empates}</p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Derrotes</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.derrotas}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {getCategorias().map((categoria, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                    >
                      {categoria}
                    </span>
                  ))}
                  
                  {resultados.length === 0 && (
                    <span className="text-sm text-gray-500">
                      No hi ha categories
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Estat</p>
                <div className="flex justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Completats:</span>
                    <span className="ml-1 font-medium">
                      {resultados.filter(r => r.completado).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Pendents:</span>
                    <span className="ml-1 font-medium">
                      {resultados.filter(r => !r.completado).length}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="primary"
                fullWidth
                onClick={() => router.push('/dashboard/resultats/crear')}
                iconLeft={<Plus className="h-4 w-4" />}
              >
                Afegir resultat
              </Button>
            </div>
          )}
        </Card>
      </div>
      
      <Card title="Tots els resultats">
        <DataTable 
          columns={columns}
          data={resultados}
          isLoading={isLoading}
          emptyMessage="No s'han trobat resultats"
        />
      </Card>
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminació</h3>
            <p className="text-gray-600 mb-4">
              Estàs segur que vols eliminar aquest resultat? Aquesta acció no es pot desfer.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel·lar
              </Button>
              <Button 
                variant="danger" 
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
