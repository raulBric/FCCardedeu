"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Pencil, Trash2, AlertTriangle, Calendar, FileEdit, AlertCircle, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DataTable, Button } from "@/components/dashboard/FormComponents";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { obtenerNoticias, eliminarNoticia, Noticia } from "@/services/dashboardService";
import { generarSlug } from "@/utils/slugUtils";

export default function NoticiasPage() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Cargar noticias
  useEffect(() => {
    async function loadNoticias() {
      try {
        setIsLoading(true);
        const data = await obtenerNoticias();
        setNoticias(data);
      } catch (error) {
        console.error("Error al cargar noticias:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadNoticias();
  }, []);
  
  // Eliminar noticia
  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await eliminarNoticia(deleteId);
      setNoticias(prev => prev.filter(n => n.id !== deleteId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error al eliminar noticia:", error);
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
    } catch (error) {
      return dateString;
    }
  };
  
  // Definir columnas para la tabla
  const columns = [
    {
      key: "imagen_url",
      header: "Imatge",
      render: (value: string, item: Noticia) => (
        <div className="w-16 h-16 relative rounded-md overflow-hidden border border-gray-200 bg-white">
          {value ? (
            <img 
              src={value} 
              alt={item.titulo} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
      )
    },
    {
      key: "titulo",
      header: "Títol",
      render: (value: string, item: Noticia) => (
        <div>
          <p className="font-medium text-gray-900 line-clamp-2">{value}</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(item.fecha)}</span>
            
            {item.autor && (
              <>
                <span className="mx-1">•</span>
                <FileEdit className="h-3 w-3 mr-1" />
                <span>{item.autor}</span>
              </>
            )}
            
            {item.categoria && (
              <>
                <span className="mx-1">•</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                  {item.categoria}
                </span>
              </>
            )}
          </div>
        </div>
      )
    },
    {
      key: "destacada",
      header: "Destacada",
      render: (value: boolean) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-amber-100 text-amber-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Destacada' : 'Normal'}
        </span>
      )
    },
    {
      key: "acciones",
      header: "Accions",
      render: (_: any, item: Noticia) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/noticies/${generarSlug(item.titulo, item.id)}`)}
            iconLeft={<Eye className="h-4 w-4" />}
          >
            Veure
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/noticies/${item.id}/editar`)}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
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

  return (
    <DashboardLayout 
      title="Notícies" 
      description="Gestiona el contingut informatiu del web"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Llista de notícies ({noticias.length})
          </h2>
          <p className="text-gray-600">
            Gestiona les notícies que es mostren al web
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => router.push('/dashboard/noticies/crear')}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Crear notícia
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Últimes notícies</CardTitle>
          </CardHeader>
          <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4 py-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-20 w-20 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : noticias.length === 0 ? (
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
          ) : (
            <div className="divide-y">
              {noticias.slice(0, 5).map((noticia) => (
                <div 
                  key={noticia.id} 
                  className="py-4 flex space-x-4 hover:bg-gray-50 px-2 rounded-md cursor-pointer"
                  onClick={() => router.push(`/dashboard/noticies/${noticia.id}/editar`)}
                >
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {noticia.imagen_url ? (
                      <img 
                        src={noticia.imagen_url} 
                        alt={noticia.titulo}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {noticia.titulo}
                    </h3>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(noticia.fecha)}</span>
                      
                      {noticia.destacada && (
                        <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-xs">
                          Destacada
                        </span>
                      )}
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {noticia.contenido}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
              
              {noticias.length > 5 && (
                <div className="py-3 text-center">
                  <Button 
                    variant="outline"
                    onClick={() => {}}
                  >
                    Veure totes les notícies
                  </Button>
                </div>
              )}
            </div>
          )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Resum</CardTitle>
          </CardHeader>
          <CardContent>
          {isLoading ? (
            <div className="animate-pulse flex flex-col py-4">
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="py-3 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{noticias.length}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Destacades</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {noticias.filter(n => n.destacada).length}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Categories populars</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(noticias.map(n => n.categoria).filter(Boolean)))
                    .slice(0, 5)
                    .map((categoria, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                      >
                        {categoria}
                      </span>
                    ))
                  }
                  
                  {noticias.length === 0 && (
                    <span className="text-sm text-gray-500">
                      No hi ha categories
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                variant="primary"
                fullWidth
                onClick={() => router.push('/dashboard/noticies/crear')}
                iconLeft={<Plus className="h-4 w-4" />}
              >
                Crear notícia
              </Button>
            </div>
          )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Totes les notícies</CardTitle>
        </CardHeader>
        <CardContent>
        <DataTable 
          columns={columns}
          data={noticias}
          isLoading={isLoading}
          emptyMessage="No s'han trobat notícies"
        />
        </CardContent>
      </Card>
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminació</h3>
            <p className="text-gray-600 mb-4">
              Estàs segur que vols eliminar aquesta notícia? Aquesta acció no es pot desfer.
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
