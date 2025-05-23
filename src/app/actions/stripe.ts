'use server'

// import { headers } from 'next/headers'
// Importar directamente usando ruta relativa explícita
import { stripe } from '../../lib/stripe'

/**
 * Crea un PaymentIntent para el proceso de inscripción
 * @param formData Datos del formulario o del jugador
 */
export async function createPaymentIntent(formData: FormData | Record<string, any>) {
  try {
    // Convertir FormData a objeto si es necesario
    const data = formData instanceof FormData 
      ? Object.fromEntries(formData.entries())
      : formData;

    // Validar datos mínimos necesarios
    if (!data.email) {
      throw new Error('Se requiere un email válido');
    }

    // Crear el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 15000, // 150€ en céntimos
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        email: data.email,
        playerName: data.playerName || 'No especificado',
        source: 'web_inscripcio'
      },
      receipt_email: data.email,
      description: 'Inscripció FC Cardedeu - Temporada 2024-2025',
    });

    console.log('PaymentIntent creado:', paymentIntent.id);

    // Devolver solo la información que necesita el cliente
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error: any) {
    console.error('Error al crear PaymentIntent:', error);
    throw new Error(`Error de pago: ${error.message}`);
  }
}

/**
 * Crea una sesión de Checkout para el proceso de inscripción
 * Utilizada por el componente EmbeddedCheckout
 */
export async function fetchClientSecret() {
  try {
    // URL base para redirecciones - usando valor fijo para evitar problemas con headers()
    const origin = 'https://fccardedeu.cat';
    
    // Si estamos en desarrollo, usar localhost
    if (process.env.NODE_ENV === 'development') {
      console.log('Modo desarrollo detectado');
    }

    // Crear sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: 15000, // 150€ en céntimos
            product_data: {
              name: 'Inscripció FC Cardedeu',
              description: 'Temporada 2024-2025',
              images: ['https://fccardedeu.cat/images/logo-fcc.png'],
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${origin}/inscripcio/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/inscripcio`,
    });

    console.log('Checkout Session creada:', session.id);
    return session.client_secret;
  } catch (error: any) {
    console.error('Error al crear sesión de Checkout:', error);
    throw new Error(`Error al inicializar el pago: ${error.message}`);
  }
}

/**
 * Verifica el estado de un pago
 */
export async function verifyPaymentStatus(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      customer: session.customer_details,
      amount: session.amount_total
    };
  } catch (error: any) {
    console.error('Error al verificar el estado del pago:', error);
    throw new Error(`Error al verificar el pago: ${error.message}`);
  }
}