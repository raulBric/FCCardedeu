"use client"

import { useState, useEffect } from 'react'
import { CreditCard } from 'lucide-react'
import { fetchClientSecret } from '@/app/actions/stripe'

interface CheckoutFormProps {
  email: string
  playerDNI: string
  setSubmitError: (error: string | null) => void
  setIsPaying: (isPaying: boolean) => void
  isPaying: boolean
}

export function CheckoutForm({ email, playerDNI, setSubmitError, setIsPaying, isPaying }: CheckoutFormProps) {
  const [paymentOption, setPaymentOption] = useState<'parcial' | 'completo'>('completo')
  const [isLoading, setIsLoading] = useState(false)
  
  // Verificar que los datos estén disponibles al cargar el componente
  useEffect(() => {
    try {
      // Verificar si tenemos datos de inscripción pendiente
      const pendingData = localStorage.getItem('pendingInscripcion')
      if (!pendingData) {
        console.warn('No se encontraron datos de inscripción pendiente en localStorage')
        // No lanzamos error aquí para permitir que el formulario se muestre normalmente
      } else {
        // Verificar que los datos son válidos
        const inscripcionData = JSON.parse(pendingData)
        if (!inscripcionData.playerName || !inscripcionData.email1) {
          console.warn('Los datos de inscripción parecen incompletos:', inscripcionData)
        }
      }
    } catch (error) {
      console.error('Error al verificar datos de inscripción:', error)
    }
  }, [])
  
  // Manejar cambio de opción de pago
  const handlePaymentOptionChange = (option: 'parcial' | 'completo') => {
    if (option === paymentOption) return
    setPaymentOption(option)
    console.log(`Cambiando opción de pago a: ${option}`)
  }
  
  // Manejar el proceso de pago
  const handleProcessPayment = async () => {
    try {
      setIsPaying(true)
      setIsLoading(true)
      
      // Recuperar datos de inscripción (fuente única de verdad)
      const pendingInscripcionStr = localStorage.getItem('pendingInscripcion')
      if (!pendingInscripcionStr) {
        throw new Error('No se encontraron los datos de la inscripción. Por favor, vuelve a completar el formulario.')
      }
      
      // Validar que los datos sean correctos y completos
      let inscripcionData
      try {
        inscripcionData = JSON.parse(pendingInscripcionStr)
        
        // Verificación mínima de datos
        if (!inscripcionData.playerName || !inscripcionData.playerDNI || !inscripcionData.email1) {
          throw new Error('Los datos de inscripción están incompletos')
        }
      } catch (parseError) {
        console.error('Error al procesar los datos de inscripción:', parseError)
        throw new Error('Los datos de inscripción son inválidos. Por favor, vuelve a completar el formulario.')
      }
      
      // Actualizar los datos con la opción de pago seleccionada
      inscripcionData.payment_type = paymentOption
      inscripcionData.payment_amount = paymentOption === 'parcial' ? 100 : 260
      inscripcionData.last_updated = new Date().toISOString()
      
      // Guardar los datos actualizados en localStorage
      localStorage.setItem('pendingInscripcion', JSON.stringify(inscripcionData))
      
      // Obtener la URL de la sesión de Checkout
      console.log(`Obteniendo sesión de Checkout para opción de pago: ${paymentOption}`)
      const checkoutUrl = await fetchClientSecret(paymentOption)
      
      if (!checkoutUrl) {
        throw new Error('No se pudo obtener la información de pago. Por favor, inténtalo de nuevo más tarde.')
      }
      
      console.log(`Redirigiendo a Stripe con el precio correcto: ${paymentOption === 'parcial' ? '100€' : '260€'}`)
      
      // Redireccionar al checkout de Stripe usando la URL completa de la sesión
      window.location.href = checkoutUrl
      
    } catch (error: any) {
      console.error('Error al iniciar el proceso de pago:', error)
      setSubmitError(`Error al iniciar el pago: ${error.message || 'Error desconocido'}. Contacta con el club.`)
      setIsPaying(false)
      setIsLoading(false)
    }
  }
  
  return (
    <div className="mb-6 w-full mx-auto px-2 sm:px-0 sm:max-w-md">
      {/* Opción de pagament */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
          Opció de pagament
        </label>
        <div className="border border-gray-300 rounded-md p-3 sm:p-4 bg-white">
          {/* Option Grid for better mobile layout */}
          <div className="grid gap-3 sm:gap-4">
            {/* Complete Payment Option */}
            <div 
              className={`flex items-start p-3 rounded-md cursor-pointer ${paymentOption === 'completo' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => handlePaymentOptionChange('completo')}
            >
              <div className="flex items-center h-5 mr-3">
                <input
                  type="radio"
                  id="pago-completo"
                  name="paymentOption"
                  value="completo"
                  checked={paymentOption === 'completo'}
                  onChange={() => handlePaymentOptionChange('completo')}
                  className="h-4 w-4 text-green-600 border-gray-300"
                  aria-labelledby="pago-completo-label"
                />
              </div>
              <div>
                <label id="pago-completo-label" htmlFor="pago-completo" className="font-medium cursor-pointer block">
                  Pagament complet - 260€
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Pagament únic de tota la temporada</p>
              </div>
            </div>
            
            {/* Partial Payment Option */}
            <div 
              className={`flex items-start p-3 rounded-md cursor-pointer ${paymentOption === 'parcial' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => handlePaymentOptionChange('parcial')}
            >
              <div className="flex items-center h-5 mr-3">
                <input
                  type="radio"
                  id="pago-parcial"
                  name="paymentOption"
                  value="parcial"
                  checked={paymentOption === 'parcial'}
                  onChange={() => handlePaymentOptionChange('parcial')}
                  className="h-4 w-4 text-green-600 border-gray-300"
                  aria-labelledby="pago-parcial-label"
                />
              </div>
              <div>
                <label id="pago-parcial-label" htmlFor="pago-parcial" className="font-medium cursor-pointer block">
                  Pagament parcial - 100€
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Primer pagament fraccionat (resta pendent de 160€)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
          Resum del pagament
        </label>
        <div className="border border-gray-300 rounded-md p-3 sm:p-4 bg-white">
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Import seleccionat:</h3>
            <div className="text-center py-2">
              <span className="text-lg sm:text-xl font-bold text-green-600">
                {paymentOption === 'completo' ? '260€ - Pagament complet' : '100€ - Pagament parcial'}
              </span>
              {paymentOption === 'parcial' && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Resta pendent de 160€</p>
              )}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 text-xs sm:text-sm">
            <p className="mb-1 flex items-start">
              <span className="mr-1 block">•</span>
              <span>Pagament segur amb targeta de crèdit/dèbit</span>
            </p>
            <p className="mb-1 flex items-start">
              <span className="mr-1 block">•</span>
              <span>Al clicar en "Pagar", seràs redirigit al portal de pagament segur de Stripe</span>
            </p>
            <p className="flex items-start">
              <span className="mr-1 block">•</span>
              <span>Rebràs un correu electrònic de confirmació després del pagament</span>
            </p>
          </div>
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleProcessPayment}
        disabled={isPaying || isLoading}
        className="w-full px-4 sm:px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition flex items-center justify-center disabled:bg-green-300 disabled:cursor-not-allowed"
      >
        {isPaying ? (
          <>
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
            <span className="text-sm sm:text-base">Processant pagament...</span>
          </>
        ) : (
          <>
            <CreditCard className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Pagar {paymentOption === 'parcial' ? '100€' : '260€'}</span>
          </>
        )}
      </button>
    </div>
  )
}
