"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CreditCard, Calendar, Lock, Smartphone, BanknoteIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface DemoCheckoutFormProps {
  amount: number
}

type PaymentMethod = "card" | "bizum" | "googlepay" | "applepay" | "transfer"

export default function DemoCheckoutForm({ amount }: DemoCheckoutFormProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    name: "",
    email: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Formateo básico para los campos de tarjeta
    let formattedValue = value

    if (name === "cardNumber") {
      // Eliminar espacios y caracteres no numéricos
      const cleaned = value.replace(/\D/g, "")
      // Limitar a 16 dígitos
      const limited = cleaned.substring(0, 16)
      // Formatear con espacios cada 4 dígitos
      formattedValue = limited.replace(/(\d{4})(?=\d)/g, "$1 ")
    }

    if (name === "cardExpiry") {
      // Eliminar caracteres no numéricos
      const cleaned = value.replace(/\D/g, "")
      // Limitar a 4 dígitos
      const limited = cleaned.substring(0, 4)
      // Formatear como MM/YY
      if (limited.length > 2) {
        formattedValue = `${limited.substring(0, 2)}/${limited.substring(2)}`
      } else {
        formattedValue = limited
      }
    }

    if (name === "cardCvc") {
      // Eliminar caracteres no numéricos
      const cleaned = value.replace(/\D/g, "")
      // Limitar a 3 o 4 dígitos
      formattedValue = cleaned.substring(0, 4)
    }

    if (name === "phone") {
      // Eliminar caracteres no numéricos
      const cleaned = value.replace(/\D/g, "")
      formattedValue = cleaned
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Validación básica según el método de pago
    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc || !formData.name) {
        setMessage("Si us plau, omple tots els camps obligatoris.")
        setIsLoading(false)
        return
      }
    } else if (paymentMethod === "bizum") {
      if (!formData.phone) {
        setMessage("Si us plau, introdueix el teu número de telèfon.")
        setIsLoading(false)
        return
      }
    } else if (paymentMethod === "transfer") {
      if (!formData.name || !formData.email) {
        setMessage("Si us plau, omple tots els camps obligatoris.")
        setIsLoading(false)
        return
      }
    }

    // Simulamos el procesamiento del pago
    setTimeout(() => {
      // Redirigir a la página de confirmación
      router.push(
        "/pagament/confirmacio?payment_intent=pi_demo_123&payment_intent_client_secret=pi_demo_secret&redirect_status=succeeded",
      )
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selector de método de pago */}
      <div className="space-y-4">
        <Label>Mètode de pagament</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          <div>
            <RadioGroupItem value="card" id="card" className="peer sr-only" />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <CreditCard className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Targeta</span>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="bizum" id="bizum" className="peer sr-only" />
            <Label
              htmlFor="bizum"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Smartphone className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Bizum</span>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="googlepay" id="googlepay" className="peer sr-only" />
            <Label
              htmlFor="googlepay"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-3 h-6 w-6 relative">
                <Image src="/placeholder.svg?height=24&width=24&text=G" alt="Google Pay" width={24} height={24} />
              </div>
              <span className="text-sm font-medium">Google Pay</span>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="applepay" id="applepay" className="peer sr-only" />
            <Label
              htmlFor="applepay"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-3 h-6 w-6 relative">
                <Image src="/placeholder.svg?height=24&width=24&text=A" alt="Apple Pay" width={24} height={24} />
              </div>
              <span className="text-sm font-medium">Apple Pay</span>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="transfer" id="transfer" className="peer sr-only" />
            <Label
              htmlFor="transfer"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <BanknoteIcon className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Transferència</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Formulario según el método de pago seleccionado */}
      <div className="pt-4 border-t border-gray-200">
        {paymentMethod === "card" && (
          <div className="space-y-4">
            {/* Información de la tarjeta */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de targeta</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                  required
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="text-xs text-gray-500">Per a proves, pots utilitzar 4242 4242 4242 4242</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Data de caducitat</Label>
                <div className="relative">
                  <Input
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardCvc">CVC</Label>
                <div className="relative">
                  <Input
                    id="cardCvc"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleChange}
                    placeholder="123"
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Información del titular */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom del titular</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom i cognoms"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correu electrònic</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@correu.com"
                required
              />
            </div>
          </div>
        )}

        {paymentMethod === "bizum" && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200 mb-4">
              <h3 className="font-medium text-blue-800 mb-2">Com funciona Bizum?</h3>
              <p className="text-sm text-blue-700">
                Introdueix el teu número de telèfon associat a Bizum. Rebràs una notificació al teu mòbil per confirmar
                el pagament.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Número de telèfon</Label>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="600123456"
                  className="pl-10"
                  required
                />
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correu electrònic (per al rebut)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@correu.com"
              />
            </div>
          </div>
        )}

        {paymentMethod === "googlepay" && (
          <div className="space-y-4">
            <div className="flex justify-center py-6">
              <button
                type="button"
                className="bg-black text-white px-6 py-3 rounded-md flex items-center justify-center w-full max-w-md"
                onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              >
                <div className="mr-2 h-6 w-6 relative">
                  <Image src="/placeholder.svg?height=24&width=24&text=G" alt="Google Pay" width={24} height={24} />
                </div>
                Pagar amb Google Pay
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              En fer clic al botó, s'obrirà Google Pay per completar el pagament.
            </p>
          </div>
        )}

        {paymentMethod === "applepay" && (
          <div className="space-y-4">
            <div className="flex justify-center py-6">
              <button
                type="button"
                className="bg-black text-white px-6 py-3 rounded-md flex items-center justify-center w-full max-w-md"
                onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              >
                <div className="mr-2 h-6 w-6 relative">
                  <Image src="/placeholder.svg?height=24&width=24&text=A" alt="Apple Pay" width={24} height={24} />
                </div>
                Pagar amb Apple Pay
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              En fer clic al botó, s'obrirà Apple Pay per completar el pagament.
            </p>
          </div>
        )}

        {paymentMethod === "transfer" && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mb-4">
              <h3 className="font-medium text-amber-800 mb-2">Informació de transferència</h3>
              <div className="space-y-2 text-sm text-amber-700">
                <p>
                  <span className="font-medium">Beneficiari:</span> FC Cardedeu
                </p>
                <p>
                  <span className="font-medium">IBAN:</span> ES12 3456 7890 1234 5678 9012
                </p>
                <p>
                  <span className="font-medium">Concepte:</span> INS-2025-0123
                </p>
                <p>
                  <span className="font-medium">Import:</span> {amount},00 €
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom i cognoms"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correu electrònic (per al rebut)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@correu.com"
                required
              />
            </div>

            <div className="text-sm text-gray-600 mt-2">
              <p>Un cop realitzada la transferència, rebràs un correu electrònic de confirmació.</p>
            </div>
          </div>
        )}
      </div>

      {message && <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200">{message}</div>}

      {/* Botón de pago (no mostrar para Google Pay y Apple Pay) */}
      {paymentMethod !== "googlepay" && paymentMethod !== "applepay" && (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-4 bg-red-700 text-white font-medium rounded-md hover:bg-red-800 transition flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 w-5 h-5" />
              Processant...
            </>
          ) : (
            <>{paymentMethod === "transfer" ? "Confirmar transferència" : `Pagar ${amount},00 €`}</>
          )}
        </button>
      )}

      <div className="text-xs text-gray-500 text-center mt-4">
        En fer clic a "Pagar", acceptes els{" "}
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



