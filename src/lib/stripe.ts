import 'server-only'

import Stripe from 'stripe'

// Obtener la clave secreta de Stripe con un fallback para desarrollo
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 
  // Fallback específico para desarrollo - NUNCA hacer esto en producción
  (process.env.NODE_ENV === 'development' ? 
    'sk_test_51RH3VDFoHhaNJ3OMRmLNnvkwyrg3t0ZPzyfApRRs9S8UG8YEMqSqw3tZ2MlI2bcsI6MmaNrIj2NK1yucXe9DCE3E00C1XO1zT3' : 
    undefined)

// Verificar que la clave existe
if (!stripeSecretKey) {
  throw new Error('La variable de entorno STRIPE_SECRET_KEY no está configurada')
}

// Crear la instancia de Stripe con la clave secreta y una versión de API específica
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia', // Usar la versión esperada por el tipo
})
