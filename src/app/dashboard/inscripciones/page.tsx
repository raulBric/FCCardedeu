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
  Trash2,
  Download
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

// Tipo reducido únicamente con los campos usados en esta página
export interface InscripcionTabla extends Record<string, unknown> {
  id: number;
  player_name: string;
  birth_date?: string;
  team?: string;
  contact_phone1?: string;
  email1?: string;
  estado: "pendiente" | "completada" | "rechazada";
  processed: boolean;
  created_at: string;
  /* Campos adicionales opcionales requeridos por la lógica de la página */
  parent_name?: string;
  player_dni?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  accept_terms?: boolean;
  temporada?: string;
  site_access?: string;
  payment_info?: {
    reference?: string;
    method?: string;
    amount?: number;
    date?: string;
  };
}

export default function InscripcionesPage() {
  const router = useRouter();
  const [inscripciones, setInscripciones] = useState<InscripcionTabla[]>([]);
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
        console.log("Obteniendo inscripciones...");
        
        // Acceder directamente a la tabla de Supabase para verificar datos
        // Importamos el cliente de supabase
        const { supabase } = await import('@/lib/supabaseClient');
        
        // Consulta directa a Supabase para diagnosticar
        const { data: directData, error: directError } = await supabase
          .from('inscripcions')
          .select('*')
          .order('created_at', { ascending: false });
        
        console.log("Datos directos de Supabase:", directData, "Error:", directError);
        
        if (directError) {
          console.error("Error directo de Supabase:", directError);
          throw directError;
        }
        
        // Si hay datos directos, usarlos
        if (directData && directData.length > 0) {
          console.log(`Encontradas ${directData.length} inscripciones directamente`);
          
          // Convertir el formato de Supabase a InscripcionTabla
          const inscripcionesDirectas = directData.map(item => ({
            id: item.id,
            player_name: item.player_name || "",
            birth_date: item.birth_date || "",
            team: item.team || "",
            contact_phone1: item.contact_phone1 || "",
            email1: item.email1 || "",
            estado: item.estado || "pendiente",
            processed: item.processed || false,
            created_at: item.created_at || new Date().toISOString(),
            parent_name: item.parent_name || "",
            player_dni: item.player_dni || "",
            address: item.address || "",
            city: item.city || "",
            postal_code: item.postal_code || "",
            accept_terms: item.accept_terms || false,
            temporada: item.temporada || "2024-2025",
            site_access: item.site_access || "",
            payment_info: item.payment_info
          }));
          
          setInscripciones(inscripcionesDirectas);
          return; // Salimos temprano si hay datos directos
        }
        
        // Si no hay datos directos, intentamos con el servicio
        console.log("Intentando con el servicio de adaptadores...");
        const data = await obtenerInscripciones(0, 0);
        console.log("Datos del servicio:", data);
        
        // Convertir el tipo InscripcionDashboard a InscripcionTabla
        const inscripcionesTabla = data.map(inscripcion => ({
          id: inscripcion.id,
          player_name: inscripcion.player_name,
          birth_date: inscripcion.birth_date,
          team: inscripcion.team,
          contact_phone1: inscripcion.contact_phone1,
          email1: inscripcion.email1,
          estado: inscripcion.estado,
          processed: inscripcion.processed,
          created_at: inscripcion.created_at,
          parent_name: inscripcion.parent_name,
          player_dni: inscripcion.player_dni,
          address: inscripcion.address,
          city: inscripcion.city,
          postal_code: inscripcion.postal_code,
          accept_terms: inscripcion.accept_terms,
          temporada: inscripcion.temporada,
          site_access: inscripcion.site_access,
          payment_info: inscripcion.payment_info ? {
            reference: inscripcion.payment_info.payment_id,
            method: inscripcion.payment_info.payment_method,
            amount: inscripcion.payment_info.payment_amount,
            date: inscripcion.payment_info.payment_date
          } : undefined
        }));
        
        setInscripciones(inscripcionesTabla);
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
  const handleProcesarInscripcion = async (inscripcion: InscripcionTabla) => {
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
        // Use a defined string type instead of 'any' cast for site_access
        site_access: (inscripcion as Inscripcion & { site_access?: string }).site_access || "",
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
            ? { ...item, estado: 'completada', processed: true } as InscripcionTabla 
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
  
  // Descargar una inscripción como CSV
  const downloadCSV = (row: InscripcionTabla) => {
    const header = [
      "ID",
      "Nom",
      "Data naixement",
      "Equip",
      "Telèfon",
      "Email",
      "Estat",
      "Processada",
      "Creat"
    ];
    const values = [
      row.id,
      row.player_name,
      row.birth_date || "",
      row.team || "",
      row.contact_phone1 || "",
      row.email1 || "",
      row.estado,
      row.processed ? "Sí" : "No",
      row.created_at
    ];
    const csv = `${header.join(",")}\n${values.join(",")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inscripcio_${row.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Descargar todas las inscripciones (filtradas) en formato Excel
  const downloadExcel = () => {
    // Usar las inscripciones filtradas actualmente visibles en la tabla
    const inscripcionesADescargar = inscripcionesFiltradas;
    
    if (inscripcionesADescargar.length === 0) {
      alert("No hi ha inscripcions per descarregar amb els filtres actuals");
      return;
    }
    
    // Cabecera con todos los campos relevantes
    const header = [
      "ID",
      "Nom",
      "Data naixement",
      "Equip",
      "Telèfon",
      "Email",
      "Estat",
      "Processada",
      "Creat",
      "Pare/Mare/Tutor",
      "DNI",
      "Adreça",
      "Ciutat",
      "Codi Postal",
      "Temporada"
    ];
    
    // Crear filas para cada inscripción
    const rows = inscripcionesADescargar.map(ins => [
      ins.id,
      ins.player_name,
      ins.birth_date || "",
      ins.team || "",
      ins.contact_phone1 || "",
      ins.email1 || "",
      ins.estado,
      ins.processed ? "Sí" : "No",
      ins.created_at,
      ins.parent_name || "",
      ins.player_dni || "",
      ins.address || "",
      ins.city || "",
      ins.postal_code || "",
      ins.temporada || ""
    ]);
    
    // Crear HTML para el Excel
    let excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Inscripcions FC Cardedeu</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            font-family: Calibri, sans-serif;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
          }
          td {
            text-align: left;
            padding: 5px;
          }
          .header {
            font-size: 16px;
            font-weight: bold;
            background-color: #DD0000;
            color: white;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr class="header">
    `;
    
    // Añadir cabeceras
    header.forEach(h => {
      excelHtml += `<th>${h}</th>`;
    });
    excelHtml += '</tr></thead><tbody>';
    
    // Añadir filas
    rows.forEach(row => {
      excelHtml += '<tr>';
      row.forEach(cell => {
        excelHtml += `<td>${cell !== undefined && cell !== null ? cell : ''}</td>`;
      });
      excelHtml += '</tr>';
    });
    
    excelHtml += '</tbody></table></body></html>';
    
    // Crear y descargar el archivo Excel
    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inscripcions_fc_cardedeu_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Mantener la función CSV original por compatibilidad
  const downloadAllCSV = downloadExcel;
  
  // Definir columnas para la tabla
  const columns = [
    {
      key: "created_at",
      header: "Data",
      render: (value: unknown) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 sm:mr-2 text-gray-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm">{formatDate(value as string)}</span>
        </div>
      )
    },
    {
      key: "player_name",
      header: "Jugador",
      render: (value: unknown, item: InscripcionTabla) => (
        <div>
          <p className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-full">{value as string}</p>
          <div className="flex flex-wrap items-center mt-1 text-xs text-gray-500 gap-1">
            <span className="inline-block max-w-[80px] truncate">{item.team}</span>
            {item.birth_date && (
              <>
                <span className="hidden sm:inline mx-1">•</span>
                <span className="inline-block">{formatDate(item.birth_date)}</span>
              </>
            )}
          </div>
        </div>
      )
    },
    {
      key: "parent_name",
      header: "Tutor",
      render: (value: unknown, item: InscripcionTabla) => (
        <div>
          <p className="font-medium">{value as string}</p>
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
      render: (value: unknown, item: InscripcionTabla) => {
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
      render: (_: unknown, item: InscripcionTabla) => (
        <div className="flex flex-wrap gap-1 justify-end">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/inscripciones/${item.id}`)}
            iconLeft={<Eye className="h-3.5 w-3.5" />}
            className="p-1.5 text-xs"
            size="sm"
          >
            <span className="hidden sm:inline">Veure</span>
          </Button>
          
          <Button 
            variant="outline" 
            isLoading={actionLoading === item.id}
            onClick={() => item.id !== undefined ? handleProcesarInscripcion(item) : null}
            iconLeft={<UserPlus className="h-3.5 w-3.5" />}
            className="p-1.5 text-xs"
            size="sm"
            disabled={item.estado === 'completada' || item.processed}
          >
            <span className="hidden sm:inline">Crear</span>
          </Button>
          
          {item.estado === 'pendiente' && (
            <>
              <Button 
                variant="primary" 
                isLoading={actionLoading === item.id}
                onClick={() => item.id !== undefined ? handleChangeEstado(item.id, 'completada') : null}
                iconLeft={<CheckCircle className="h-3.5 w-3.5" />}
                className="p-1.5 text-xs bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <span className="hidden sm:inline">OK</span>
              </Button>
              
              <Button 
                variant="danger" 
                isLoading={actionLoading === item.id}
                onClick={() => item.id !== undefined ? handleChangeEstado(item.id, 'rechazada') : null}
                iconLeft={<XCircle className="h-3.5 w-3.5" />}
                className="p-1.5 text-xs"
                size="sm"
              >
                <span className="hidden sm:inline">No</span>
              </Button>
            </>
          )}
          
          {item.estado === 'rechazada' && (
            <Button 
              variant="outline" 
              isLoading={actionLoading === item.id}
              onClick={() => item.id !== undefined ? handleChangeEstado(item.id, 'pendiente') : null}
              iconLeft={<Clock className="h-3.5 w-3.5" />}
              className="p-1.5 text-xs"
              size="sm"
            >
              <span className="hidden sm:inline">React.</span>
            </Button>
          )}
          
          <Button 
            variant="danger" 
            onClick={() => item.id !== undefined ? handleDelete(item.id) : null}
            iconLeft={<Trash2 className="h-3.5 w-3.5" />}
            className="p-1.5 text-xs"
            size="sm"
          >
            <span className="sr-only">Eliminar</span>
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
      <div className="mb-4 sm:mb-6 flex flex-wrap justify-between items-center gap-3">
        <div className="w-full sm:w-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Inscripcions ({inscripcionesFiltradas.length})
          </h2>
          <p className="text-sm text-gray-600 pr-2">
            Gestiona inscripcions i crea jugadors
          </p>
        </div>
        
        <div className="w-full sm:w-auto">
          <Button
            variant="primary"
            onClick={downloadExcel}
            iconLeft={<Download className="h-4 w-4" />}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium w-full sm:w-auto"
            size="sm"
          >
            <span className="hidden sm:inline">Descarregar Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
        </div>
      </div>
      
      {/* Contador eliminado según solicitud del usuario */}
      
      <Card>
        <div className="p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 mb-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-2 sm:mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-blue-800">Instruccions d&apos;ús</h3>
              <div className="mt-1 text-xs sm:text-sm text-blue-700">
                <p>Des d&apos;aquesta secció pots gestionar les inscripcions rebudes:</p>
                <ul className="list-disc ml-4 sm:ml-5 mt-1">
                  <li>Revisa les dades de cada inscripció abans de processar-la</li>
                  <li className="hidden sm:block">Utilitza &quot;Crear jugador&quot; per convertir automàticament una inscripció en un jugador del club</li>
                  <li className="sm:hidden">Crea jugadors del club a partir d&apos;inscripcions</li>
                  <li>Les inscripcions rebutjades es poden reactivar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <DataTable<InscripcionTabla> 
              columns={columns as Array<{key: string; header: string; render?: (value: unknown, item: InscripcionTabla) => React.ReactNode}>}
              data={inscripcionesFiltradas}
              isLoading={isLoading}
              emptyMessage="No s'han trobat inscripcions"
            />
          </div>
        </div>
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
