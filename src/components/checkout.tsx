'use client'

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState, useEffect } from 'react'

// Inicializar Stripe con la clave pública
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

// Componente de pago con Stripe Embedded Checkout
export default function Checkout({ clientSecret }: { clientSecret?: string }) {
  const [secret, setSecret] = useState<string | null>(clientSecret || null)
  const [isLoading, setIsLoading] = useState(!clientSecret)
  const [error, setError] = useState<string | null>(null)

  // Si no se proporcionó un clientSecret como prop, creamos uno
  useEffect(() => {
    if (!clientSecret) {
      // Esta es una función que deberías crear en app/actions/stripe.ts
      // para obtener el client secret desde el servidor
      async function getClientSecret() {
        try {
          setIsLoading(true)
          // Aquí deberías llamar a tu API o Server Action para obtener el client secret
          // Por ejemplo: const { clientSecret } = await createPaymentIntent({ amount: 15000 })
          // Para pruebas, puedes dejar este comentado y usar un valor estático
          setSecret('test_secret_here') // Reemplazar esto con la llamada real a tu API
          setIsLoading(false)
        } catch (err: any) {
          console.error('Error al obtener client secret:', err)
          setError(err.message || 'Error al preparar el pago')
          setIsLoading(false)
        }
      }

      getClientSecret()
    }
  }, [clientSecret])

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando opciones de pago...</p>
      </div>
    )
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <div className="p-6 border border-red-300 bg-red-50 rounded-md">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // Renderizar el checkout si tenemos el client secret
  return (
    <div id="checkout" className="p-4 border rounded-md shadow-sm bg-white">
      {secret ? (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret: secret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <p className="text-orange-700">No se pudo inicializar el pago. Contacta con el club.</p>
      )}
    </div>
  )
}