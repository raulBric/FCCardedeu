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
          ...inscripcionData,
          payment_session_id: session_id,
          payment_status: 'completed',
          updated_at: new Date().toISOString()
        }
        
        // Inserción mediante función RPC para sortear RLS
        const { data: insertData, error } = await supabase.rpc('insert_inscripcio', {
          new_row: paymentData,
        })

        if (error) {
          console.error('Error en inserción vía RPC:', error)
          throw new Error(error.message || 'Error al guardar la inscripción en la base de datos')
        }

        // Si llegamos aquí, todo ha ido bien
        setInscripcionId(insertData)
        setIsSuccess(true)
        
        // Limpiar localStorage ya que ya no necesitamos los datos
        try {
          localStorage.removeItem('pendingInscripcion')
          // Ya no es necesario eliminar inscripcionFormData porque hemos unificado todo en pendingInscripcion
        } catch (cleanupError) {
          // Sólo log, no fallo crítico
          console.warn('Error al limpiar localStorage:', cleanupError)
        }
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
    const customerEmail = sessionData?.customer_details?.email || ''
    
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