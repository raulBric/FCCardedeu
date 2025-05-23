import 'server-only'

import Stripe from 'stripe'

// Verificar que la clave existe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('La variable de entorno STRIPE_SECRET_KEY no está configurada')
}

// Crear la instancia de Stripe con la clave secreta y una versión de API específica
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Usar la versión esperada por el tipo
})
