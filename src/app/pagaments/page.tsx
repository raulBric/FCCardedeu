"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CheckoutForm from "@/app/pagaments/checkout-form"
import Header from "@/components/Header"
import Escudo from "@/assets/Escudo.png"

// Inicializa Stripe (en una aplicación real, usa tu clave pública real)
const stripePromise = loadStripe("pk_test_51NpTMtKZ6R0djt0A0RAg1234567890ABCDEFGHIJKLMN")

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Obtener el ID de inscripción de los parámetros de la URL
  const inscriptionId = searchParams.get("id")

  // Datos de ejemplo para la inscripción (en una aplicación real, obtendrías estos datos de tu API)
  const inscriptionData = {
    playerName: "Marc Garcia Fernández",
    category: "Infantil A",
    season: "2025-2026",
    amount: 450,
    paymentReference: "INS-2025-0123",
  }

  useEffect(() => {
    // Verificar que tenemos un ID de inscripción
    if (!inscriptionId) {
      setError("No s'ha trobat la referència de la inscripció")
      setLoading(false)
      return
    }

    // En una aplicación real, aquí harías una llamada a tu API para crear un PaymentIntent
    // y obtener el clientSecret
    const fetchPaymentIntent = async () => {
      try {
        // Simulación de llamada a API para este ejemplo
        // En una implementación real, harías algo como:
        /*
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            inscriptionId, 
            amount: inscriptionData.amount 
          }),
        });
        
        if (!response.ok) {
          throw new Error('Error al crear la intención de pago');
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
        */

        // Simulación para este ejemplo - FORMATO CORRECTO
        setTimeout(() => {
          setClientSecret("pi_3NpTMtKZ6R0djt0A0RAg1234_secret_rFUQwg8V9P2BNgBZUGtVyXcQq")
          setLoading(false)
        }, 1500)
      } catch {
        setError("Hi ha hagut un error carregant les dades de pagament. Si us plau, torna-ho a provar més tard.")
        setLoading(false)
      }
    }

    fetchPaymentIntent()
  }, [inscriptionId])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-700">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href="/inscripcio">Tornar a la inscripció</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Header />
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/inscripcio" className="inline-flex items-center text-sm text-gray-600 hover:text-red-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tornar a la inscripció
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Resumen de la inscripción */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Resum de la inscripció</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-24 h-24">
                      <Image
                        src={Escudo}
                        alt="FC Cardedeu"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Jugador</p>
                    <p className="font-medium">{inscriptionData.playerName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Categoria</p>
                    <p className="font-medium">{inscriptionData.category}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Temporada</p>
                    <p className="font-medium">{inscriptionData.season}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Referència</p>
                    <p className="font-medium">{inscriptionData.paymentReference}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Import total</p>
                      <p className="font-bold text-xl text-red-700">{inscriptionData.amount},00 €</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de pago */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pagament segur
                </CardTitle>
                <CardDescription>Completa el pagament per finalitzar la inscripció</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-red-700 animate-spin mb-4" />
                    <p className="text-gray-600">Carregant opcions de pagament...</p>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#b91c1c",
                        },
                      },
                    }}
                  >
                    <CheckoutForm amount={inscriptionData.amount} />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-red-600">No s&apos;ha pogut carregar el formulari de pagament.</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                      Tornar a intentar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información de seguridad */}
            <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Pagament segur
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Dades encriptades
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

