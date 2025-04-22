"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  UserPlus,
  Calendar,
  Eye,
  Trash2
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button, DataTable } from "@/components/dashboard/FormComponents";
import Card from "@/components/dashboard/Card";
import { 
  obtenerInscripciones, 
  actualizarEstadoInscripcion, 
  crearJugadorDesdeInscripcion, 
  eliminarInscripcion,
  Inscripcion, 
  InscripcionDashboard
} from "@/services/dashboardService";

export default function InscripcionesPage() {
  const router = useRouter();
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'completadas' | 'rechazadas'>('todas');
  
  // Cargar inscripciones
  useEffect(() => {
    async function loadInscripciones() {
      try {
        setIsLoading(true);
        const data = await obtenerInscripciones();
        // Asegurarnos que los tipos son compatibles con actualización explícita
        setInscripciones(data as unknown as Inscripcion[]);
      } catch (err) {
        console.error("Error al cargar inscripciones:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadInscripciones();
  }, []);
  
  // Filtrar inscripciones
  // Aseguramos que la función de filtrado sea correcta para todos los estados
  const inscripcionesFiltradas = inscripciones.filter(inscripcion => {
    // Por defecto, si no hay estado o es inválido, lo tratamos como pendiente
    const estado = inscripcion.estado || 'pendiente';
    
    if (filtro === 'todas') return true;
    if (filtro === 'pendientes') return estado === 'pendiente';
    if (filtro === 'completadas') return estado === 'completada';
    if (filtro === 'rechazadas') return estado === 'rechazada';
    return true;
  });
  
  // Procesar inscripción - Crear jugador
  const handleProcesarInscripcion = async (inscripcion: Inscripcion) => {
    if (!inscripcion.id) {
      console.error("Error: La inscripción no tiene ID");
      return;
    }
    try {
      setActionLoading(inscripcion.id || null);
      // Extraer y convertir payment_info sólo si es compatible; evitamos conflicto de tipos
      const { payment_info: originalPaymentInfo, ...inscripcionBase } = inscripcion;
      // Convertir explícitamente a formato esperado por el servicio (InscripcionDashboard)
      // Necesitamos asegurar que tenga todos los campos requeridos, incluyendo los obligatorios
      const inscripcionCompatible: InscripcionDashboard = {
        ...inscripcionBase,
        // Añadir/forzar campos requeridos por InscripcionDashboard que pueden faltar en Inscripcion
        image_rights: true,
        exit_authorization: true,
        processed: false,
        // Campos que podrían ser opcionales en Inscripcion pero obligatorios en InscripcionDashboard
        id: inscripcion.id!,
        player_name: inscripcion.player_name || "",
        birth_date: inscripcion.birth_date || "",
        player_dni: inscripcion.player_dni || "",
        team: inscripcion.team || "",
        parent_name: inscripcion.parent_name || "",
        contact_phone1: inscripcion.contact_phone1 || "",
        email1: inscripcion.email1 || "",
        address: inscripcion.address || "",
        city: inscripcion.city || "",
        postal_code: inscripcion.postal_code || "",
        accept_terms: inscripcion.accept_terms ?? true,
        created_at: inscripcion.created_at || new Date().toISOString(),
        estado: inscripcion.estado || "pendiente",
        temporada: inscripcion.temporada || "2024-2025",
        site_access: (inscripcion as any).site_access || "",
        // Mapear información de pago si existe y es compatible
        payment_info: originalPaymentInfo ? {
          payment_id: originalPaymentInfo.reference ?? undefined,
          payment_status: 'pending', // valor por defecto ya que mapping exacto no aplica
          payment_method: originalPaymentInfo.method ?? undefined,
          payment_amount: originalPaymentInfo.amount ?? undefined,
          payment_date: originalPaymentInfo.date ?? undefined,
          is_verified: false,
        } : undefined,
      };
      await crearJugadorDesdeInscripcion(inscripcionCompatible);
      
      // Actualizar estado local inmediatamente (estrategia optimista)
      setInscripciones(prev => 
        prev.map(item => 
          item.id === inscripcion.id 
            ? { ...item, estado: 'completada', processed: true } as Inscripcion 
            : item
        )
      );
    } catch (error) {
      console.error("Error al procesar inscripción:", error);
      alert("Error al procesar la inscripción. Inténtalo de nuevo.");
    } finally {
      setActionLoading(null);
    }
  };
  
  // Cambiar estado de inscripción
  const handleChangeEstado = async (id: number, estado: 'pendiente' | 'completada' | 'rechazada') => {
    try {
      setActionLoading(id);
      // Añadir parámetros processed y useRpc para usar la estrategia optimista
      const processed = estado === 'completada' ? true : false;
      await actualizarEstadoInscripcion(id, estado, processed, undefined, true);
      
      // Actualizar estado local inmediatamente sin importar resultado de BD (estrategia optimista)
      setInscripciones(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, estado, processed } 
            : item
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado. Inténtalo de nuevo.");
      // Nota: No revertimos el cambio en UI debido a la estrategia optimista
    } finally {
      setActionLoading(null);
    }
  };
  
  // Eliminar inscripción
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      setActionLoading(deleteId);
      await eliminarInscripcion(deleteId);
      
      // Actualizar estado local
      setInscripciones(prev => prev.filter(item => item.id !== deleteId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error al eliminar inscripción:", error);
      alert("Error al eliminar la inscripción. Inténtalo de nuevo.");
    } finally {
      setActionLoading(null);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      // Si hay error al formatear, devolver la fecha original
      return dateString;
    }
  };
  
  // Definir columnas para la tabla
  const columns = [
    {
      key: "created_at",
      header: "Data",
      render: (value: string) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span>{formatDate(value)}</span>
        </div>
      )
    },
    {
      key: "player_name",
      header: "Jugador",
      render: (value: string, item: Inscripcion) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span>{item.team}</span>
            {item.birth_date && (
              <>
                <span className="mx-1">•</span>
                <span>Nascut: {formatDate(item.birth_date)}</span>
              </>
            )}
          </div>
        </div>
      )
    },
    {
      key: "parent_name",
      header: "Tutor",
      render: (value: string, item: Inscripcion) => (
        <div>
          <p className="font-medium">{value}</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span>{item.contact_phone1}</span>
            {item.email1 && (
              <>
                <span className="mx-1">•</span>
                <span className="truncate max-w-32">{item.email1}</span>
              </>
            )}
          </div>
        </div>
      )
    },
    {
      key: "estado",
      header: "Estat",
      render: (value: string | number | boolean, item: Inscripcion) => {
        // Asegurar que siempre haya un valor válido para estado
        const estado = value || 'pendiente';
        return (
          <div className="flex items-center">
            {(estado === 'pendiente' || estado === '') && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center border border-yellow-200">
                <Clock className="h-4 w-4 mr-1" />
                Pendent
              </span>
            )}
            {estado === 'completada' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center border border-green-200">
                <CheckCircle className="h-4 w-4 mr-1" />
                {item.processed ? (
                  <>
                    <span>Processada</span>
                    <span className="ml-1 px-1.5 py-0.5 bg-green-200 text-green-900 rounded-md text-xs">Jugador creat</span>
                  </>
                ) : (
                  <span>Completada</span>
                )}
              </span>
            )}
            {estado === 'rechazada' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center border border-red-200">
                <XCircle className="h-4 w-4 mr-1" />
                Rebutjada
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: "acciones",
      header: "Accions",
      render: (_: unknown, item: Inscripcion) => (
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => item.id !== undefined ? router.push(`/dashboard/inscripciones/detalle/${item.id}`) : null}
            iconLeft={<Eye className="h-4 w-4" />}
            className="px-3 py-2 border-gray-300 hover:bg-gray-100 font-medium"
          >
            Veure detall
          </Button>
          
          {item.estado === 'pendiente' && (
            <>
              <Button 
                variant="success" 
                isLoading={actionLoading === item.id}
                onClick={() => handleProcesarInscripcion(item)}
                iconLeft={<UserPlus className="h-4 w-4" />}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Crear jugador
              </Button>
              
              <Button 
                variant="danger" 
                isLoading={actionLoading === item.id}
                onClick={() => item.id !== undefined ? handleChangeEstado(item.id, 'rechazada') : null}
                iconLeft={<XCircle className="h-4 w-4" />}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Rebutjar
              </Button>
            </>
          )}
          
          {item.estado === 'rechazada' && (
            <Button 
              variant="outline" 
              isLoading={actionLoading === item.id}
              onClick={() => item.id !== undefined ? handleChangeEstado(item.id, 'pendiente') : null}
              iconLeft={<Clock className="h-4 w-4" />}
              className="px-3 py-2 border-gray-300 hover:bg-gray-100 font-medium"
            >
              Reactivar
            </Button>
          )}
          
          <Button 
            variant="danger" 
            onClick={() => item.id !== undefined ? handleDelete(item.id) : null}
            iconLeft={<Trash2 className="h-4 w-4" />}
            className="px-2"
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout 
      title="Inscripcions" 
      description="Gestiona les inscripcions rebudes al formulari web"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Inscripcions ({inscripcionesFiltradas.length})
          </h2>
          <p className="text-gray-600">
            Gestiona les inscripcions rebudes i crea jugadors automàticament
          </p>
        </div>
        
        <div className="flex space-x-2">
          <div className="inline-block">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtre
            </label>
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as 'todas' | 'pendientes' | 'completadas' | 'rechazadas')}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="todas">Totes</option>
              <option value="pendientes">Pendents</option>
              <option value="completadas">Completades</option>
              <option value="rechazadas">Rebutjades</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Contador eliminado según solicitud del usuario */}
      
      <Card>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 mb-4">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Instruccions d&apos;ús</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Des d&apos;aquesta secció pots gestionar les inscripcions rebudes al formulari web:</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Revisa les dades de cada inscripció abans de processar-la</li>
                  <li>Utilitza &quot;Crear jugador&quot; per convertir automàticament una inscripció en un jugador del club</li>
                  <li>Les inscripcions rebutjades es poden reactivar si és necessari</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <DataTable 
          columns={columns}
          data={inscripcionesFiltradas}
          isLoading={isLoading}
          emptyMessage="No s'han trobat inscripcions"
        />
      </Card>
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminació</h3>
            <p className="text-gray-600 mb-4">
              Estàs segur que vols eliminar aquesta inscripció? Aquesta acció no es pot desfer.
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
                isLoading={actionLoading === deleteId}
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
