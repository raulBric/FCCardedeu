"use client";

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { stripe } from '../../lib/stripe'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { configurarTablaInscripcions } from '@/services/configurarTablaInscripcions'
import { Check, AlertCircle } from 'lucide-react'

// Define tipos para los parámetros de búsqueda
type SearchParams = {
  session_id?: string
}

export const metadata: Metadata = {
  title: 'Pago Exitoso | FC Cardedeu',
  description: 'Gracias por tu pago. Tu inscripción ha sido procesada correctamente.',
}

export default function Success({ searchParams }: { searchParams: SearchParams }) {
  const { session_id } = searchParams
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [sessionData, setSessionData] = useState<any>(null)
  const [inscripcionId, setInscripcionId] = useState<number | null>(null)

  useEffect(() => {
    if (!session_id) {
      setIsError(true)
      setErrorMessage('No se ha proporcionado un ID de sesión válido')
      setIsLoading(false)
      return
    }

    const processPayment = async () => {
      try {
        // 1. Verificar el estado del pago
        const response = await fetch(`/api/verify_payment?session_id=${session_id}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Error al verificar el pago')
        }

        setSessionData(data.session)

        // 2. Obtener los datos de inscripción guardados en localStorage
        const pendingInscripcionStr = localStorage.getItem('pendingInscripcion')
        if (!pendingInscripcionStr) {
          throw new Error('No se encontraron los datos de la inscripción')
        }

        const inscripcionData = JSON.parse(pendingInscripcionStr)

        // 3. Guardar los datos en Supabase
        // Asegurarse de que la tabla existe
        await configurarTablaInscripcions()
        
        // Conexión con Supabase
        const supabase = createClientComponentClient()
        
        // Agregar el ID de la sesión de pago
        inscripcionData.payment_session_id = session_id
        inscripcionData.payment_status = 'completed'
        
        // Inserción mediante función RPC para sortear RLS
        const { data: insertData, error } = await supabase.rpc('insert_inscripcio', {
          new_row: inscripcionData,
        })

        if (error) {
          console.error('Error en inserción vía RPC:', error)
          throw new Error(error.message || error.details || 'Error al guardar la inscripción')
        }

        // Si llegamos aquí, todo ha ido bien
        setInscripcionId(insertData)
        setIsSuccess(true)
        
        // Limpiar localStorage ya que ya no necesitamos los datos
        localStorage.removeItem('pendingInscripcion')
        localStorage.removeItem('inscripcionFormData')

      } catch (error: any) {
        console.error('Error al procesar la inscripción:', error)
        setIsError(true)
        setErrorMessage(error.message || 'Ha ocurrido un error al procesar tu inscripción')
      } finally {
        setIsLoading(false)
      }
    }

    processPayment()
  }, [session_id])

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
            amb el teu ID de sessió: <span className="font-mono bg-gray-100 p-1 rounded">{session_id}</span>
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
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 w-full mb-6">
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-semibold">ID d'inscripció:</span> {inscripcionId}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">ID de pagament:</span> {session_id?.substring(0, 16)}...
            </p>
          </div>
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