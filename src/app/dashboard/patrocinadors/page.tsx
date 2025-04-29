"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  AlertCircle,
  Link as LinkIcon,
  ExternalLink
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button, DataTable } from "@/components/dashboard/FormComponents";
import Card from "@/components/dashboard/Card";
import { obtenerPatrocinadores, eliminarPatrocinador, Patrocinador } from "@/services/dashboardService";

export default function PatrocinadorsPage() {
  const router = useRouter();
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Cargar patrocinadores
  useEffect(() => {
    async function loadPatrocinadores() {
      try {
        setIsLoading(true);
        const data = await obtenerPatrocinadores();
        setPatrocinadores(data);
      } catch (error) {
        console.error("Error al cargar patrocinadores:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPatrocinadores();
  }, []);
  
  // Eliminar patrocinador
  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await eliminarPatrocinador(deleteId);
      setPatrocinadores(prev => prev.filter(p => p.id !== deleteId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error al eliminar patrocinador:", error);
    }
  };
  
  // Definir columnas para la tabla
  const columns = [
    {
      key: "logo_url",
      header: "Logo",
      render: (value: string, item: Patrocinador) => (
        <div className="w-16 h-16 relative rounded-md overflow-hidden border border-gray-200 bg-white">
          {value ? (
            <Image 
              src={value || '/placeholder-logo.png'} 
              alt={item.nombre} 
              className="w-full h-full object-contain p-1"
              width={64}
              height={64}
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
      key: "nombre",
      header: "Nombre",
      render: (value: string, item: Patrocinador) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          {item.url && (
            <div className="flex items-center mt-1 text-sm text-blue-600">
              <LinkIcon className="h-3 w-3 mr-1" />
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs">
                {item.url}
              </a>
            </div>
          )}
        </div>
      )
    },
    {
      key: "tipo",
      header: "Tipo",
      render: (value: 'principal' | 'colaborador') => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'principal' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {value === 'principal' ? 'Principal' : 'Colaborador'}
        </span>
      )
    },
    {
      key: "activo",
      header: "Estado",
      render: (value: boolean) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: "acciones",
      header: "Acciones",
      render: (_: unknown, item: Patrocinador) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/patrocinadors/${item.id}`)}
            iconLeft={<Eye className="h-4 w-4" />}
          >
            Ver
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/patrocinadors/${item.id}/editar`)}
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
      title="Patrocinadors" 
      description="Gestiona els patrocinadors que es mostren al web"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Llista de patrocinadors ({patrocinadores.length})
          </h2>
          <p className="text-gray-600">
            Gestiona els patrocinadors principals i col·laboradors
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => router.push('/dashboard/patrocinadors/crear')}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Afegir patrocinador
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Patrocinador principal" className="col-span-1">
          {(() => {
            const principal = patrocinadores.find(p => p.tipo === 'principal' && p.activo);
            
            if (isLoading) {
              return (
                <div className="animate-pulse flex flex-col items-center py-4">
                  <div className="h-24 w-24 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              );
            }
            
            if (!principal) {
              return (
                <div className="text-center py-6">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">
                    No hi ha cap patrocinador principal actiu
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => router.push('/dashboard/patrocinadors/crear?tipo=principal')}
                  >
                    Afegir patrocinador principal
                  </Button>
                </div>
              );
            }
            
            return (
              <div className="flex flex-col items-center py-4">
                <div className="w-32 h-32 relative rounded-md overflow-hidden border border-gray-200 mb-4 p-2">
                  <Image 
                    src={principal.logo_url || '/placeholder-logo.png'} 
                    alt={principal.nombre}
                    className="w-full h-full object-contain" 
                    width={128}
                    height={128}
                  />
                </div>
                
                <h3 className="text-lg font-semibold text-center mb-1">
                  {principal.nombre}
                </h3>
                
                {principal.url && (
                  <a 
                    href={principal.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:underline mb-4"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Visitar web
                  </a>
                )}
                
                <div className="flex space-x-2 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/dashboard/patrocinadors/${principal.id}/editar`)}
                    iconLeft={<Pencil className="h-4 w-4" />}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            );
          })()}
        </Card>
        
        <Card title="Col·laboradors actius" className="col-span-1">
          {(() => {
            const colaboradores = patrocinadores.filter(p => p.tipo === 'colaborador' && p.activo);
            
            if (isLoading) {
              return (
                <div className="animate-pulse flex flex-col py-4">
                  <div className="h-5 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-full mb-4"></div>
                </div>
              );
            }
            
            if (colaboradores.length === 0) {
              return (
                <div className="text-center py-6">
                  <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">
                    No hi ha col·laboradors actius
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/dashboard/patrocinadors/crear?tipo=colaborador')}
                  >
                    Afegir col·laborador
                  </Button>
                </div>
              );
            }
            
            return (
              <div className="py-3">
                <p className="text-gray-600 mb-2 text-sm">
                  {colaboradores.length} col·laboradors actius
                </p>
                
                <ul className="space-y-2">
                  {colaboradores.slice(0, 5).map((colab) => (
                    <li key={colab.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 mr-3 relative rounded overflow-hidden bg-white border border-gray-200">
                          {colab.logo_url ? (
                            <Image 
                              src={colab.logo_url || '/placeholder-logo.png'} 
                              alt={colab.nombre}
                              className="w-full h-full object-contain" 
                              width={32}
                              height={32}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium">{colab.nombre}</span>
                      </div>
                      
                      <Button 
                        variant="outline"
                        onClick={() => router.push(`/dashboard/patrocinadors/${colab.id}/editar`)}
                        className="h-7 px-2"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
                
                {colaboradores.length > 5 && (
                  <div className="mt-3 text-center">
                    <Button 
                      variant="outline"
                      onClick={() => {}}
                      className="text-xs"
                    >
                      Ver todos ({colaboradores.length})
                    </Button>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
        
        <Card title="Resum" className="col-span-1">
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
                  <p className="text-2xl font-bold text-gray-900">{patrocinadores.length}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Actius</p>
                  <p className="text-2xl font-bold text-green-600">
                    {patrocinadores.filter(p => p.activo).length}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Principals</p>
                  <p className="text-xl font-bold text-red-600">
                    {patrocinadores.filter(p => p.tipo === 'principal').length}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Col·laboradors</p>
                  <p className="text-xl font-bold text-blue-600">
                    {patrocinadores.filter(p => p.tipo === 'colaborador').length}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline"
                fullWidth
                onClick={() => router.push('/dashboard/patrocinadors/crear')}
                iconLeft={<Plus className="h-4 w-4" />}
              >
                Afegir patrocinador
              </Button>
            </div>
          )}
        </Card>
      </div>
      
      <Card title="Tots els patrocinadors">
        <DataTable 
          columns={columns}
          data={patrocinadores}
          isLoading={isLoading}
          emptyMessage="No s'han trobat patrocinadors"
        />
      </Card>
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminació</h3>
            <p className="text-gray-600 mb-4">
              Estàs segur que vols eliminar aquest patrocinador? Aquesta acció no es pot desfer.
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
