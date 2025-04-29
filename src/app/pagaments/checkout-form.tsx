"use client"

import type React from "react"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2 } from "lucide-react"

interface CheckoutFormProps {
  amount: number
}

export default function CheckoutForm({ amount }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js no ha cargado todavía
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // Confirmar el pago
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redireccionar a la página de confirmación después del pago
          return_url: `${window.location.origin}/pagament/confirmacio`,
        },
      })

      // Si hay un error, mostrarlo
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Hi ha hagut un error amb la teva targeta")
        } else {
          setMessage("Hi ha hagut un error inesperat")
        }
        setIsLoading(false)
      }
      // Si no hay error, el usuario será redirigido a return_url
    } catch {
      setMessage("Hi ha hagut un error processant el pagament")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
          defaultValues: {
            billingDetails: {
              name: "",
              email: "",
            },
          },
        }}
      />

      {message && <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200">{message}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full px-6 py-4 bg-red-700 text-white font-medium rounded-md hover:bg-red-800 transition flex items-center justify-center disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2 w-5 h-5" />
            Processant...
          </>
        ) : (
          <>Pagar {amount},00 €</>
        )}
      </button>

      <div className="text-xs text-gray-500 text-center mt-4">
        En fer clic a &quot;Pagar&quot;, acceptes els{" "}
        <a href="/termes" className="text-red-700 hover:underline">
          Termes i Condicions
        </a>{" "}
        i la{" "}
        <a href="/privacitat" className="text-red-700 hover:underline">
          Política de Privacitat
        </a>{" "}
        del FC Cardedeu.
      </div>
    </form>
  )
}

