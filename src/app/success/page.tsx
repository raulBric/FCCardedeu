"use client";

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { configurarTablaInscripcions } from '@/services/configurarTablaInscripcions'
import { Check, AlertCircle } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

// Valores de Supabase para asegurar disponibilidad en el cliente
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aiuizlmgicsqsrqdasgv.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWl6bG1naWNzcXNycWRhc2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjI4ODQsImV4cCI6MjA2MDk5ODg4NH0.vtwbwq7iahAIHCd3Y8afZIGBsZZxXz2fHsS6wJDAgwo'

export default function Success() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [sessionData, setSessionData] = useState<any>(null)
  const [inscripcionId, setInscripcionId] = useState<number | null>(null)

  // Separar la lógica de procesamiento de pagos en su propia función
  const processPayment = useCallback(async (session_id: string) => {
    try {
      // 1. Verificar el estado del pago
      const response = await fetch(`/api/verify_payment?session_id=${session_id}`)
      
      // Verificar si tenemos una respuesta válida
      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`)
      }
      
      // Intentar parsear el JSON con manejo de errores
      let data
      try {
        const textResponse = await response.text()
        // Verificar que tenemos contenido antes de parsear
        if (!textResponse || textResponse.trim() === '') {
          throw new Error('La respuesta del servidor está vacía')
        }
        data = JSON.parse(textResponse)
      } catch (parseError: any) {
        console.error('Error al parsear la respuesta JSON:', parseError)
        throw new Error(`Error al procesar la respuesta del servidor: ${parseError.message}`)
      }
      
      // Verificar que la respuesta tiene el formato esperado
      if (!data || !data.success) {
        throw new Error(data?.error || 'Error al verificar el pago: respuesta mal formada')
      }

      setSessionData(data.session)

      // 2. Obtener los datos de inscripción guardados en localStorage
      let inscripcionData: Record<string, any> = {}
      try {
        const pendingInscripcionStr = localStorage.getItem('pendingInscripcion')
        if (!pendingInscripcionStr) {
          throw new Error('No se encontraron los datos de la inscripción. Por favor, vuelve a realizar el proceso.')
        }

        inscripcionData = JSON.parse(pendingInscripcionStr) as Record<string, any>
        
        // Validar datos mínimos
        if (!inscripcionData.playerName || !inscripcionData.email1 || !inscripcionData.payment_type) {
          console.error('Datos de inscripción incompletos:', Object.keys(inscripcionData))
          throw new Error('Los datos de inscripción están incompletos o corruptos')
        }
      } catch (localStorageError) {
        console.error('Error al recuperar datos del localStorage:', localStorageError)
        throw new Error('No se pudieron recuperar los datos de inscripción. Es posible que la sesión haya expirado.')
      }

      // 3. Guardar los datos en Supabase
      try {
        // Asegurarse de que la tabla existe
        await configurarTablaInscripcions()
        
        // Conexión con Supabase con valores explícitos
        const supabase = createClientComponentClient({
          supabaseUrl: SUPABASE_URL,
          supabaseKey: SUPABASE_ANON_KEY
        })
        
        // Agregar el ID de la sesión de pago
        const paymentData = {
          // Asegurar que todos los campos estén correctamente nombrados para Supabase
          player_name: inscripcionData.playerName,
          birth_date: inscripcionData.birthDate,
          player_dni: inscripcionData.playerDNI,
          health_card: inscripcionData.healthCard,
          team: inscripcionData.team,
          parent_name: inscripcionData.parentName,
          contact_phone1: inscripcionData.contactPhone1,
          contact_phone2: inscripcionData.contactPhone2,
          alt_contact: inscripcionData.altContact,
          email1: inscripcionData.email1,
          email2: inscripcionData.email2,
          address: inscripcionData.address,
          city: inscripcionData.city,
          postal_code: inscripcionData.postalCode,
          school: inscripcionData.school,

          siblings_in_club: inscripcionData.siblingsInClub,
          seasons_in_club: inscripcionData.seasonsInClub,
          bank_account: inscripcionData.bankAccount,
          comments: inscripcionData.comments,
          accept_terms: inscripcionData.acceptTerms,
          payment_type: inscripcionData.payment_type,
          payment_amount: inscripcionData.payment_amount,
          payment_session_id: session_id,
          payment_status: 'completed',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          estado: 'pagat',      // Estado pagado en catalán cuando se confirma el pago
          inscripcion_source: 'web'
        }
        
        // Volvemos a usar la función RPC pero con un enfoque más robusto
        try {
          // Enviamos todos los campos del formulario para inserción
          // pero los separamos en campos esenciales y complementarios
          // Crear un objeto que guarde todos los datos de la inscripción
          // y los separe en esenciales y adicionales
          const completeData = {
            // Datos esenciales (los mínimos necesarios para crear un registro)
            essential: {
              player_name: paymentData.player_name,
              email1: paymentData.email1,
              contact_phone1: paymentData.contact_phone1,
              
              // Datos de pago con múltiples opciones de nombre
              // Enviamos varias opciones para aumentar compatibilidad
              session_id: sessionId,
              payment_status: 'completed'
            },
            // Datos complementarios (se guardarán si existen las columnas)
            additional: {
              // Datos personales
              birth_date: paymentData.birth_date,
              player_dni: paymentData.player_dni,
              health_card: paymentData.health_card,
              team: paymentData.team,
              parent_name: paymentData.parent_name,
              
              // Datos de contacto
              contact_phone2: paymentData.contact_phone2,
              alt_contact: paymentData.alt_contact,
              email2: paymentData.email2,
              
              // Dirección
              address: paymentData.address,
              city: paymentData.city,
              postal_code: paymentData.postal_code,
              
              // Datos adicionales
              school: paymentData.school,

              siblings_in_club: paymentData.siblings_in_club || false,
              seasons_in_club: paymentData.seasons_in_club || 0,
              bank_account: paymentData.bank_account,
              comments: paymentData.comments,
              accept_terms: paymentData.accept_terms || false,
              
              // Datos de pago (sin payment_session_id que causó el error)
              payment_type: paymentData.payment_type,
              payment_amount: paymentData.payment_amount,
              
              // Estado y metadatos (en catalán para coherencia)
              estado: 'pagat',
              status: 'pagat',                        // Alternativa
              state: 'pagat'                          // Alternativa
            }
          };
          
          // Para guardar como backup por si falla el principal
          const fallbackData = {
            player_name: paymentData.player_name,
            email1: paymentData.email1,
            contact_phone1: paymentData.contact_phone1
          };
          
          console.log('Usando RPC con datos completos:', completeData);
          
          // Guardar copia completa de los datos originales en localStorage
          // para asegurar que no se pierden aunque la inserción falle
          localStorage.setItem('lastInscripcionData', JSON.stringify({
            data: paymentData,
            timestamp: new Date().toISOString(),
            sessionId: sessionId
          }));
          
          let insertData = null;
          let error = null;
          
          // Intento principal con la función RPC mejorada
          try {
            const result = await supabase.rpc(
              'insert_inscripcio_complete',
              { complete_data: completeData }
            );
            
            insertData = result.data;
            error = result.error;
            
            // Si hay error, intentamos con la función minimalista
            if (error) {
              console.warn('Error con insert_inscripcio_complete, intentando con minimal:', error.message);
              
              // Plan B: Usar la función minimalista
              const minimalResult = await supabase.rpc(
                'insert_inscripcio_minimal',
                { min_data: fallbackData }
              );
              
              if (!minimalResult.error) {
                console.log('Éxito con inserción minimal:', minimalResult.data);
                insertData = minimalResult.data;
                error = null;
              } else {
                console.error('Error también con inserción minimal:', minimalResult.error);
                
                // Plan C: Inserción directa en tabla como último recurso
                const directResult = await supabase
                  .from('inscripcions')
                  .insert(fallbackData)
                  .select('id');
                  
                if (!directResult.error) {
                  console.log('Éxito con inserción directa:', directResult.data);
                  insertData = directResult.data[0];
                  error = null;
                } else {
                  error = directResult.error;
                }
              }
            }
          } catch (unknownError) {
            console.error('Error en el proceso de inserción:', unknownError);
            // Manejar error tipo unknown de forma segura
            const rpcError = unknownError as Error;
            error = { message: rpcError?.message || 'Error desconocido en RPC' };
          }
            
          if (error) {
            console.error('Error en inserción vía RPC:', error);
            throw new Error(`Error en RPC: ${error.message}`);
          }
          
          // Inserción exitosa
          console.log('Inscripción guardada con ID:', insertData?.id);
          setInscripcionId(insertData?.id ? Number(insertData.id) : null);
          setIsSuccess(true);
          
          // Guardar todos los datos originales en localStorage para referencia
          // por si son necesarios más adelante
          try {
            localStorage.setItem('lastSuccessfulInscripcion', JSON.stringify({
              id: insertData?.id,
              sessionId: sessionId,
              data: paymentData,
              timestamp: new Date().toISOString()
            }));
          } catch (storageError) {
            console.warn('Error al guardar datos completos:', storageError);
          }
          
          // Limpiar localStorage ya que ya no necesitamos los datos de formulario
          localStorage.removeItem('pendingInscripcion');
          
        } catch (processingError) {
          console.error('Error en procesamiento:', processingError);
          // Usando 'as any' para acceder a message de forma segura en processingError
          throw new Error(`Error al procesar la inscripción: ${(processingError as any)?.message || 'Error desconocido'}`);
        }
        
        // El resto de la lógica ahora se maneja dentro del try
        // y se ha eliminado código redundante
      } catch (supabaseError: any) {
        console.error('Error con Supabase:', supabaseError)
        throw new Error(`Error al guardar los datos: ${supabaseError.message || 'Error desconocido'}`)
      }

    } catch (error: any) {
      console.error('Error al procesar la inscripción:', error)
      setIsError(true)
      setErrorMessage(error.message || 'Ha ocurrido un error al procesar tu inscripción')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Ejecutar al montar el componente
  useEffect(() => {
    if (!sessionId) {
      setIsError(true)
      setErrorMessage('No se ha proporcionado un ID de sesión válido')
      setIsLoading(false)
      return
    }
    
    // Iniciar el procesamiento del pago
    processPayment(sessionId);
    
  }, [sessionId, processPayment])

  // Pantalla de carga
  if (isLoading) {
    return (
      <section id="loading" className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-red-600 mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">Processant la teva inscripció...</h1>
          <p className="text-center max-w-md">Estem finalitzant el procés d'inscripció. Si us plau, no tanquis aquesta finestra.</p>
        </div>
      </section>
    )
  }

  // Pantalla de error
  if (isError) {
    return (
      <section id="error" className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Hi ha hagut un problema</h1>
          <p className="text-center max-w-md mb-6">
            {errorMessage}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Si has realitzat el pagament correctament però veus aquest missatge, si us plau contacta amb el club a{' '}
            <a href="mailto:info@fccardedeu.cat" className="underline">info@fccardedeu.cat</a>{' '}
            amb el teu ID de sessió: <span className="font-mono bg-gray-100 p-1 rounded">{sessionId}</span>
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Tornar a l'inici
          </button>
        </div>
      </section>
    )
  }

  // Pantalla de éxito
  if (isSuccess) {
    // Obtener el email directamente de localStorage en lugar de sessionData
    let customerEmail = ''
    try {
      const inscripcionData = JSON.parse(localStorage.getItem('pendingInscripcion') || '{}')
      customerEmail = inscripcionData.email1 || ''
    } catch (e) {
      console.error('Error al recuperar email desde localStorage', e)
    }
    
    return (
      <section id="success" className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="flex flex-col items-center text-center max-w-lg">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Inscripció completada amb èxit!</h1>
          <p className="text-center mb-4">
            Gràcies per la teva inscripció al FC Cardedeu. Hem enviat un correu de confirmació a{' '}
            <span className="font-semibold">{customerEmail}</span>.
          </p>
          {/* Removed technical IDs as requested */}
          <p className="text-sm text-gray-600 mb-6">
            Si tens alguna pregunta, si us plau contacta amb el club a{' '}
            <a href="mailto:info@fccardedeu.cat" className="underline">info@fccardedeu.cat</a>.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Tornar a l'inici
          </button>
        </div>
      </section>
    )
  }
  
  // Fallback (no debería ocurrir pero por seguridad)
  return null
}