"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Shield, User, Clock, AlertCircle, CheckCircle, 
  ChevronLeft, ChevronRight, RefreshCw, Filter,
  Trash2, AlertTriangle, Calendar as CalendarIcon
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSessionLogs, deleteLogs, type SessionLog } from "@/app/actions/auth";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

// Componente para mostrar un log individual
const LogItem = ({ log }: { log: SessionLog }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={`p-4 border-b border-gray-200 ${log.success ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {log.success ? (
            <CheckCircle className="text-green-500 mr-3 h-5 w-5" />
          ) : (
            <AlertCircle className="text-red-500 mr-3 h-5 w-5" />
          )}
          <div>
            <div className="font-medium">{log.user_email}</div>
            <div className="text-sm text-gray-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(log.login_at)}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {log.notes && (
            <span title={log.notes}>
              {log.notes.length > 30 ? `${log.notes.substring(0, 30)}...` : log.notes}
            </span>
          )}
        </div>
      </div>
      
      {log.user_agent && (
        <div className="mt-2 text-xs text-gray-500 italic truncate" title={log.user_agent}>
          {log.user_agent}
        </div>
      )}
    </div>
  );
};

export default function SessionLogsPage() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<boolean | undefined>(undefined);
  
  // Estados para la función de eliminar logs
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'all' | 'old' | 'success' | 'failure'>('all');
  
  const limit = 10;
  
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { logs, count, error } = await getSessionLogs(limit, page * limit, filter);
      
      if (error) {
        setError(`Error al cargar logs: ${error}`);
      } else {
        setLogs(logs);
        setTotalLogs(count);
        setError(null);
      }
    } catch (err) {
      setError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para manejar la eliminación de logs
  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteSuccess(null);
    setDeleteError(null);
    
    try {
      // Configurar los parámetros según el tipo de eliminación
      let all = false;
      let olderThan: Date | undefined = undefined;
      let filterSuccess: boolean | undefined = undefined;
      
      switch (deleteType) {
        case 'all':
          all = true;
          break;
        case 'old':
          // Logs más antiguos que 30 días
          olderThan = subDays(new Date(), 30);
          break;
        case 'success':
          filterSuccess = true;
          break;
        case 'failure':
          filterSuccess = false;
          break;
      }
      
      // Ejecutar la eliminación
      const result = await deleteLogs(all, olderThan, filterSuccess);
      
      if (result.success) {
        setDeleteSuccess(`Se han eliminado ${result.deleted} registros de log`);
        // Actualizar la lista de logs
        fetchLogs();
      } else {
        setDeleteError(`Error al eliminar logs: ${result.error}`);
      }
    } catch (err) {
      setDeleteError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeleteLoading(false);
      // Cerrar el modal en 2 segundos si fue exitoso
      if (deleteSuccess) {
        setTimeout(() => setShowDeleteModal(false), 2000);
      }
    }
  };
  
  // Cargar logs al iniciar y cuando cambian los filtros o la página
  useEffect(() => {
    fetchLogs();
  }, [page, filter]);
  
  const totalPages = Math.ceil(totalLogs / limit);
  
  return (
    <DashboardLayout
      title="Registro de Sesiones"
      description="Historial de intentos de inicio de sesión en el sistema"
    >
      <div className="space-y-6">
        {/* Panel de control */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter(undefined)} 
              className={`px-3 py-1 rounded text-sm ${filter === undefined ? 'bg-club-primary text-white' : 'bg-gray-100'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter(true)} 
              className={`px-3 py-1 rounded text-sm ${filter === true ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
            >
              Exitosos
            </button>
            <button 
              onClick={() => setFilter(false)} 
              className={`px-3 py-1 rounded text-sm ${filter === false ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
            >
              Fallidos
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center text-sm text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar logs
            </button>
            
            <button 
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={fetchLogs}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>
        
        {/* Lista de logs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 text-red-700">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {loading && logs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-club-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Cargando logs de sesión...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-500">No hay registros de sesión disponibles</p>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-700">Usuario</div>
                  <div className="text-sm font-medium text-gray-700">Detalles</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <LogItem key={log.id || `${log.user_email}-${log.login_at}`} log={log} />
                ))}
              </div>
            </>
          )}
          
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="p-4 flex justify-between items-center bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {`Mostrando ${page * limit + 1}-${Math.min((page + 1) * limit, totalLogs)} de ${totalLogs} registros`}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className={`p-2 rounded ${page === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className={`p-2 rounded ${page >= totalPages - 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para eliminar logs */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Eliminar registros de sesión
            </h3>
            
            {deleteSuccess ? (
              <div className="bg-green-50 text-green-700 p-3 rounded mb-4">
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {deleteSuccess}
                </p>
              </div>
            ) : deleteError ? (
              <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
                <p className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {deleteError}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">
                Esta acción no se puede deshacer. Por favor, seleccione qué logs desea eliminar:
              </p>
            )}
            
            <div className="space-y-2 mb-6">
              <div
                onClick={() => setDeleteType('all')}
                className={`cursor-pointer p-3 border rounded flex items-start ${deleteType === 'all' ? 'border-club-primary' : 'border-gray-200'}`}
              >
                <input 
                  type="radio" 
                  className="mt-0.5 mr-2" 
                  checked={deleteType === 'all'}
                  onChange={() => setDeleteType('all')}
                />
                <div>
                  <span className="font-medium">Todos los logs</span>
                  <p className="text-xs text-gray-500">Elimina todos los registros de inicio de sesión</p>
                </div>
              </div>
              
              <div
                onClick={() => setDeleteType('old')}
                className={`cursor-pointer p-3 border rounded flex items-start ${deleteType === 'old' ? 'border-club-primary' : 'border-gray-200'}`}
              >
                <input 
                  type="radio" 
                  className="mt-0.5 mr-2" 
                  checked={deleteType === 'old'}
                  onChange={() => setDeleteType('old')}
                />
                <div>
                  <span className="font-medium">Logs antiguos</span>
                  <p className="text-xs text-gray-500">Elimina todos los registros de más de 30 días</p>
                </div>
              </div>
              
              <div
                onClick={() => setDeleteType('success')}
                className={`cursor-pointer p-3 border rounded flex items-start ${deleteType === 'success' ? 'border-club-primary' : 'border-gray-200'}`}
              >
                <input 
                  type="radio" 
                  className="mt-0.5 mr-2" 
                  checked={deleteType === 'success'}
                  onChange={() => setDeleteType('success')}
                />
                <div>
                  <span className="font-medium">Inicios de sesión exitosos</span>
                  <p className="text-xs text-gray-500">Elimina solo los registros de inicios exitosos</p>
                </div>
              </div>
              
              <div
                onClick={() => setDeleteType('failure')}
                className={`cursor-pointer p-3 border rounded flex items-start ${deleteType === 'failure' ? 'border-club-primary' : 'border-gray-200'}`}
              >
                <input 
                  type="radio" 
                  className="mt-0.5 mr-2" 
                  checked={deleteType === 'failure'}
                  onChange={() => setDeleteType('failure')}
                />
                <div>
                  <span className="font-medium">Intentos fallidos</span>
                  <p className="text-xs text-gray-500">Elimina solo los registros de intentos fallidos</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
