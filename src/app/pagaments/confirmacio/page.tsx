"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentConfirmationPage() {
  const [status, setStatus] = useState<"success" | "failure" | "processing" | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  // Obtener el estado del pago de los parámetros de la URL
  const paymentIntent = searchParams.get("payment_intent")
  const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")
  const redirectStatus = searchParams.get("redirect_status")

  useEffect(() => {
    if (!paymentIntent || !paymentIntentClientSecret) {
      setLoading(false)
      return
    }

    // En una aplicación real, verificarías el estado del pago con tu backend
    const checkPaymentStatus = async () => {
      try {
        // Simulación de verificación para este ejemplo
        setTimeout(() => {
          if (redirectStatus === "succeeded") {
            setStatus("success")
          } else if (redirectStatus === "processing") {
            setStatus("processing")
          } else {
            setStatus("failure")
          }
          setLoading(false)
        }, 1500)

        // En una implementación real, harías algo como:
        /*
        const response = await fetch('/api/check-payment-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            paymentIntent,
            paymentIntentClientSecret
          }),
        });
        
        if (!response.ok) {
          throw new Error('Error al verificar el estado del pago');
        }
        
        const data = await response.json();
        setStatus(data.status);
        */
      } catch {
        setStatus("failure")
        setLoading(false)
      }
    }

    checkPaymentStatus()
  }, [paymentIntent, paymentIntentClientSecret, redirectStatus])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Verificant pagament</CardTitle>
            <CardDescription>Estem processant el teu pagament</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-red-700 animate-spin mb-6" />
            <p className="text-gray-600">Si us plau, espera mentre verifiquem l&apos;estat del teu pagament...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Pagament completat!</CardTitle>
            <CardDescription>La teva inscripció ha estat processada correctament</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center my-6">
                <div className="relative w-24 h-24">
                  <img
                    src="/placeholder.svg?height=96&width=96&text=FC"
                    alt="FC Cardedeu"
                    width="96"
                    height="96"
                    className="object-contain absolute inset-0 w-full h-full"
                  />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <p className="text-green-800 text-sm">
                  Hem enviat un correu electrònic amb els detalls de la teva inscripció i el rebut del pagament.
                </p>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Referència de pagament: <span className="font-medium">PI-{paymentIntent?.substring(0, 8)}</span>
                </p>

                <div className="pt-4 flex flex-col space-y-3">
                  <Button asChild>
                    <Link href="/">Tornar a l&apos;inici</Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link href="/inscripcio/descarregar-rebut">Descarregar rebut</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-yellow-500 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-700">Pagament en procés</CardTitle>
            <CardDescription>El teu pagament està sent processat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  El teu pagament està sent processat. T&apos;enviarem un correu electrònic quan es completi.
                </p>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Referència de pagament: <span className="font-medium">PI-{paymentIntent?.substring(0, 8)}</span>
                </p>

                <div className="pt-4">
                  <Button asChild>
                    <Link href="/">Tornar a l&apos;inici</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">Error en el pagament</CardTitle>
          <CardDescription>No s&apos;ha pogut completar el pagament</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <p className="text-red-800 text-sm">
                Hi ha hagut un problema amb el teu pagament. Si us plau, torna a intentar-ho o contacta amb nosaltres si
                el problema persisteix.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="pt-4 flex flex-col space-y-3">
                <Button asChild>
                  <Link href="/pagament">Tornar a intentar</Link>
                </Button>

                <Button variant="outline" asChild>
                  <Link href="/contacte">Contactar amb suport</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

