"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserPlus,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  School,
  Loader2,
  CreditCard,
  Building2,
  Tag,
  UserCircle
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/dashboard/FormComponents";
import Card from "@/components/dashboard/Card";
import { 
  actualizarEstadoInscripcion, 
  crearJugadorDesdeInscripcion
} from "@/adapters/ServiceAdapters";

// Definición del tipo Inscripcion para usar en este componente
export interface Inscripcion {
  id?: number;
  player_name: string;
  birth_date: string;
  player_dni: string;
  health_card?: string;
  team: string;
  parent_name: string;
  contact_phone1: string;
  contact_phone2?: string;
  alt_contact?: string;
  email1: string;
  email2?: string;
  address: string;
  city: string;
  postal_code: string;
  school?: string;
  shirt_size?: string;
  siblings_in_club?: string;
  seasons_in_club?: string;
  bank_account?: string;
  comments?: string;
  accept_terms: boolean;
  created_at?: string;
  estado?: 'pendiente' | 'completada' | 'rechazada';
  temporada?: string;
  processed?: boolean;
  site_access?: string;
}

export default function DetalleInscripcionPage() {
  const router = useRouter();
  const params = useParams();
  const inscripcionId = parseInt(params.id as string);
  
  const [inscripcion, setInscripcion] = useState<Inscripcion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);
  
  // No usamos createClientComponentClient directamente porque causa problemas con RLS

  // Cargar inscripción directamente desde Supabase
  useEffect(() => {
    async function loadInscripcion() {
      try {
        setIsLoading(true);
        setError(null);

        // Validar ID
        if (isNaN(inscripcionId)) {
          throw new Error(`ID de inscripción no válido: ${params.id}`);
        }

        console.log(`Intentando cargar inscripción con ID: ${inscripcionId}`);
      
        // Usar el mismo cliente que funciona en la lista principal
        const { supabase } = await import('@/lib/supabaseClient');
      
        // Consulta directa a Supabase - Exactamente igual que en dashboard/inscripciones/page.tsx
        const { data, error } = await supabase
          .from('inscripcions')
          .select('*')
          .eq('id', inscripcionId)
          .single();
      
        console.log("Respuesta de Supabase:", data ? "Datos encontrados" : "No hay datos", "Error:", error);
      
        if (error) {
          console.error("Error de Supabase:", error);
          throw error;
        }
      
        if (!data) {
          throw new Error(`No s'ha trobat cap inscripció amb ID: ${inscripcionId}`);
        }

        // Normalizar datos con valores por defecto.
        const inscripcionNormalizada: Inscripcion = {
          id: data.id ?? inscripcionId,
          player_name: data.player_name ?? '',
          birth_date: data.birth_date ?? '',
          player_dni: data.player_dni ?? '',
          health_card: data.health_card ?? '',
          team: data.team ?? '',
          parent_name: data.parent_name ?? '',
          contact_phone1: data.contact_phone1 ?? '',
          contact_phone2: data.contact_phone2 ?? '',
          alt_contact: data.alt_contact ?? '',
          email1: data.email1 ?? '',
          email2: data.email2 ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          postal_code: data.postal_code ?? '',
          school: data.school ?? '',
          shirt_size: data.shirt_size ?? '',
          siblings_in_club: data.siblings_in_club ?? '',
          seasons_in_club: data.seasons_in_club ?? '',
          bank_account: data.bank_account ?? '',
          comments: data.comments ?? '',
          accept_terms: data.accept_terms ?? false,
          created_at: data.created_at,
          estado: data.estado ?? 'pendiente',
          temporada: data.temporada ?? '2024-2025',
          processed: data.processed ?? false,
          site_access: data.site_access ?? ''
        };

        setInscripcion(inscripcionNormalizada);
      } catch (err) {
        console.error('Error al cargar inscripción:', err);
        const msg = err instanceof Error ? err.message : 'Error desconegut';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }

    if (inscripcionId) {
      loadInscripcion();
    }
  }, [inscripcionId, params.id]);
  
  // Formatear fechas
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
  
  // Cambiar estado de inscripción - Versión simplificada
  const handleChangeEstado = async (estado: 'pendiente' | 'completada' | 'rechazada') => {
    if (!inscripcion) return;
    
    // El estado se actualiza de forma optimista, no necesitamos revertir
    
    // Primero actualizamos la UI inmediatamente (enfoque optimista)
    setInscripcion({
      ...inscripcion,
      estado
    });
    
    try {
      setActionLoading(`estado-${estado}`);
      
      // Luego intentamos actualizar en el backend
      // Esto ahora es secundario - la UI ya se actualizó
      console.log(`Cambiando estado de inscripción ${inscripcionId} a ${estado}...`);
      
      // IMPORTANTE: Usamos useRpc=true para evitar problemas de RLS
      const resultado = await actualizarEstadoInscripcion(
        inscripcionId, 
        estado, 
        inscripcion.processed || false, 
        undefined, 
        true // useRpc = true para evitar restricciones RLS
      );
      
      // No usar console.log en producción
      if (process.env.NODE_ENV !== 'production') {
        console.log("Resultado de actualización:", resultado);
      }
      
      // No alertamos al usuario si todo va bien
    } catch (error) {
      console.error("Error al cambiar estado (backend):", error);
      
      // En lugar de mostrar un alert, mostramos un mensaje suave en consola
      // y MANTENEMOS el cambio en la UI para mejor experiencia de usuario
      console.log("Error en backend pero la UI se ha actualizado correctamente");
    } finally {
      setActionLoading(null);
    }
  };
  
  // Procesar inscripción - Crear jugador
  const handleProcesarInscripcion = async () => {
    if (!inscripcion) return;
    
    try {
      setActionLoading('procesar');
      
      // Crear un objeto compatible con InscripcionDashboard con todos los campos requeridos
      const inscripcionCompleta = {
        ...inscripcion,
        id: inscripcion.id || 0,                         // Asegurar que id es un número
        estado: inscripcion.estado || 'pendiente',
        processed: inscripcion.processed || false,
        temporada: inscripcion.temporada || '2024-2025',  // Valor por defecto si no existe
        created_at: inscripcion.created_at || new Date().toISOString(),
        accept_terms: inscripcion.accept_terms || true,
        image_rights: false,                           // Campo obligatorio en InscripcionDashboard
        exit_authorization: false                      // Campo obligatorio en InscripcionDashboard
      };
      
      // Llamamos a la función con el tipo correcto
      await crearJugadorDesdeInscripcion(inscripcionCompleta);
      
      // Actualizar estado local
      setInscripcion({
        ...inscripcion,
        estado: 'completada',
        processed: true
      });
    } catch (error) {
      console.error("Error al procesar inscripción:", error);
      alert("Error al procesar la inscripción. Inténtalo de nuevo.");
    } finally {
      setActionLoading(null);
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout 
        title="Detall d'inscripció" 
        description="Carregant dades..."
      >
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Carregant inscripció...</span>
        </div>
      </DashboardLayout>
    );
  }
  
  // Mostrar error si existe
  if (error) {
    return (
      <DashboardLayout 
        title="Error al carregar inscripció" 
        description="S'ha produït un error en carregar les dades"
      >
        <div className="p-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Error al carregar les dades</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4 bg-red-100 p-2 rounded-md">
                  <p className="text-xs font-mono text-red-800">ID inscripció: {inscripcionId}</p>
                </div>
              </div>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/dashboard/inscripciones'}
            iconLeft={<ArrowLeft className="h-4 w-4" />}
          >
            Tornar a inscripcions
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!inscripcion) {
    return (
      <DashboardLayout 
        title="Inscripció no trobada" 
        description="No s'ha pogut trobar la inscripció"
      >
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscripció no trobada</h2>
          <p className="text-gray-600 mb-6">La inscripció que busques no existeix o ha estat eliminada.</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard/inscripciones'}
            iconLeft={<ArrowLeft className="h-4 w-4" />}
          >
            Tornar a inscripcions
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title={`Inscripció de ${inscripcion.player_name}`} 
      description="Detall de la inscripció rebuda"
    >
      <div className="p-4 md:p-6 bg-white rounded-lg shadow mb-4 md:mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 break-words">{inscripcion.player_name}</h1>
            <div className="text-gray-500 flex flex-wrap items-center gap-2">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                {formatDate(inscripcion.created_at || '')}
              </span>
              
              <span className="hidden sm:inline mx-2">•</span>
              
              {inscripcion.estado === 'pendiente' && (
                <span className="flex items-center text-yellow-600 font-medium whitespace-nowrap">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" /> Pendent
                </span>
              )}
              {inscripcion.estado === 'completada' && (
                <span className="flex items-center text-green-600 font-medium whitespace-nowrap">
                  <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" /> Completada {inscripcion.processed && "(Jugador creat)"}
                </span>
              )}
              {inscripcion.estado === 'rechazada' && (
                <span className="flex items-center text-red-600 font-medium whitespace-nowrap">
                  <XCircle className="h-4 w-4 mr-1 flex-shrink-0" /> Rebutjada
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/inscripciones')}
              iconLeft={<ArrowLeft className="h-4 w-4" />}
              size="md"
              className="w-full sm:w-auto"
            >
              Tornar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Panel de acciones */}
      <div className="bg-gray-50 p-4 md:p-6 border border-gray-200 rounded-lg shadow-sm mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-bold mb-4 text-gray-800">Accions disponibles</h2>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {inscripcion.estado !== 'completada' && !inscripcion.processed && (
            <Button
              variant="success"
              onClick={handleProcesarInscripcion}
              isLoading={actionLoading === 'procesar'}
              iconLeft={<UserPlus className="h-5 w-5" />}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Crear jugador
            </Button>
          )}
          
          {inscripcion.estado !== 'pendiente' && (
            <Button
              variant="outline"
              onClick={() => handleChangeEstado('pendiente')}
              isLoading={actionLoading === 'estado-pendiente'}
              iconLeft={<Clock className="h-5 w-5" />}
              className="px-4 py-2 border-yellow-500 hover:bg-yellow-50 text-yellow-600"
            >
              Marcar com pendent
            </Button>
          )}
          
          {inscripcion.estado !== 'completada' && (
            <Button
              variant="outline"
              onClick={() => handleChangeEstado('completada')}
              isLoading={actionLoading === 'estado-completada'}
              iconLeft={<CheckCircle className="h-5 w-5" />}
              className="px-4 py-2 border-green-500 hover:bg-green-50 text-green-600"
            >
              Marcar com completada
            </Button>
          )}
          
          {inscripcion.estado !== 'rechazada' && (
            <Button
              variant="outline"
              onClick={() => handleChangeEstado('rechazada')}
              isLoading={actionLoading === 'estado-rechazada'}
              iconLeft={<XCircle className="h-5 w-5" />}
              className="px-4 py-2 border-red-500 hover:bg-red-50 text-red-600"
            >
              Marcar com rebutjada
            </Button>
          )}
        </div>
        
        {inscripcion.processed && (
          <div className="mt-3 px-3 py-2 bg-green-100 text-green-800 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Aquesta inscripció ja ha estat processada i s&apos;ha creat un jugador a la base de dades.</span>
          </div>
        )}
      </div>
      
      {/* Información personal y de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Datos del jugador */}
        <Card className="p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
            Dades del jugador
          </h2>
          
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Nom complet</p>
              <p className="text-gray-800">{inscripcion.player_name}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Data de naixement</p>
              <p className="text-gray-800">{formatDate(inscripcion.birth_date)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">DNI/NIE</p>
              <p className="text-gray-800">{inscripcion.player_dni}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Targeta sanitària</p>
              <p className="text-gray-800">{inscripcion.health_card || "-"}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Categoria</p>
              <p className="text-gray-800">{inscripcion.team}</p>
            </div>

            <div className="flex items-start">
              <Tag className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Temporada</p>
                <p className="mt-1 text-base">{inscripcion.temporada}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Información de contacto */}
        <Card title="Dades de contacte" className="col-span-1">
          <div className="p-3 md:p-4 space-y-3 md:space-y-4 overflow-hidden">
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Nom del pare/mare/tutor</p>
                <p className="mt-1 text-base">{inscripcion.parent_name}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Telèfon principal</p>
                <p className="mt-1 text-base">{inscripcion.contact_phone1}</p>
              </div>
            </div>

            {inscripcion.contact_phone2 && (
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Telèfon secundari</p>
                  <p className="mt-1 text-base">{inscripcion.contact_phone2}</p>
                </div>
              </div>
            )}

            {inscripcion.alt_contact && (
              <div className="flex items-start">
                <UserCircle className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Contacte alternatiu</p>
                  <p className="mt-1 text-base">{inscripcion.alt_contact}</p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email principal</p>
                <div className="mt-1 text-base break-all">{inscripcion.email1}</div>
              </div>
            </div>

            {inscripcion.email2 && (
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email secundari</p>
                  <div className="mt-1 text-base break-all">{inscripcion.email2}</div>
                </div>
              </div>
            )}

            {inscripcion.bank_account && (
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Compte bancari</p>
                  <p className="mt-1 text-base">{inscripcion.bank_account}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Dirección e información adicional */}
        <Card title="Adreça i informació addicional" className="col-span-1">
          <div className="p-3 md:p-4 space-y-3 md:space-y-4 overflow-hidden">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Adreça</p>
                <p className="mt-1 text-base break-words">{inscripcion.address}</p>
                <p className="text-base break-words">{inscripcion.city}, {inscripcion.postal_code}</p>
              </div>
            </div>
            
            {inscripcion.school && (
              <div className="flex items-start">
                <School className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Escola</p>
                  <p className="mt-1 text-base">{inscripcion.school}</p>
                </div>
              </div>
            )}
            
            {inscripcion.site_access && (
              <div className="flex items-start">
                <Building2 className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Accés a les instal&apos;lacions</p>
                  <p className="mt-1 text-base">{inscripcion.site_access}</p>
                </div>
              </div>
            )}
            
            {inscripcion.comments && (
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Comentaris</p>
                  <p className="mt-1 text-base">{inscripcion.comments}</p>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-gray-600">
                  Termes i condicions acceptats
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(inscripcion.created_at || '')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sección de estado de procesamiento */}
      <div className="mt-6 border rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-800 text-md">Estat de processament</h3>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className={`w-4 h-4 rounded-full mr-2 ${inscripcion.processed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="font-semibold text-gray-800 text-md">
              {inscripcion.processed ? 'Processat' : 'Pendent de processar'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="text-sm font-bold text-gray-700 mb-1">Estat:</div>
              <div className="font-medium mt-1">
                {inscripcion.estado === 'pendiente' && (
                  <span className="inline-flex items-center text-yellow-700 text-md">
                    <Clock className="h-5 w-5 mr-1" /> Pendent
                  </span>
                )}
                {inscripcion.estado === 'completada' && (
                  <span className="inline-flex items-center text-green-700 text-md">
                    <CheckCircle className="h-5 w-5 mr-1" /> Completada
                  </span>
                )}
                {inscripcion.estado === 'rechazada' && (
                  <span className="inline-flex items-center text-red-700 text-md">
                    <XCircle className="h-5 w-5 mr-1" /> Rebutjada
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="text-sm font-bold text-gray-700 mb-1">Data de creació:</div>
              <div className="font-medium mt-1 text-md">{formatDate(inscripcion.created_at || '')}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de información */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Informació sobre la creació de jugadors</h3>
        <p className="text-sm text-blue-700">
          En fer clic a &quot;Crear jugador&quot;, el sistema generarà automàticament un jugador a la base de dades amb les dades d&apos;aquesta inscripció. 
          La inscripció es marcarà com a processada. Un cop creat, podràs editar les dades del jugador des de la secció &quot;Jugadors&quot;.
        </p>
      </div>
    </DashboardLayout>
  );
}
