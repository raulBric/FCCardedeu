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
 * @param paymentOption - Opción de pago: 'parcial' para pago de 100€, 'completo' para pago de 260€
 */
export async function fetchClientSecret(paymentOption: 'parcial' | 'completo' = 'completo') {
  try {
    console.log('Creando PaymentIntent con opción:', paymentOption);
    
    // Obtener la URL base desde las variables de entorno si existe, o usar una URL por defecto
    let origin = 'https://fccardedeu.org'; // URL por defecto para producción
    
    if (process.env.NODE_ENV === 'development') {
      // Intentar usar la URL de desarrollo configurada - esto permite usar IPs locales como 192.168.0.14:3000
      origin = process.env.NEXT_PUBLIC_DEVELOPMENT_URL || 'http://localhost:3000';
      console.log('Modo desarrollo detectado - usando URL base:', origin);
    }
    
    // Forzar HTTPS en producción para evitar problemas con Safari
    // En desarrollo mantenemos el protocolo original (podría ser http)
    const secureOrigin = process.env.NODE_ENV === 'development' 
      ? origin 
      : origin.replace('http:', 'https:');

    // Determinar el producto y precio según la opción seleccionada
    // Configurar producto y precio según el tipo de pago
    
    // ID de producto para entorno de desarrollo
    let productId = 'prod_ST4WKzSo96ErCw'; // ID de producto para desarrollo
    
    // IDs de producto para entorno de producción (comentados)
    // Descomentar estos IDs y comentar el anterior para producción
    // if (process.env.NODE_ENV !== 'development') {
    //   if (paymentOption === 'parcial') {
    //     productId = 'prod_OnZSK2AAcxnfhg'; // ID para opción parcial
    //   } else {
    //     productId = 'prod_OnZRixAcDY8h8h'; // ID para opción completa
    //   }
    // }

    let amount, description;
    
    if (paymentOption === 'parcial') {
      // Opción de pago PARCIAL (100€)
      amount = 10000; // 100€ en céntimos
      description = 'Pago parcial (100€)';
      console.log('Configurando pago PARCIAL de 100€');
    } else {
      // Opción de pago COMPLETO (260€) - por defecto
      amount = 26000; // 260€ en céntimos
      description = 'Pago completo (260€)';
      console.log('Configurando pago COMPLETO de 260€');
    }

    // Crear una sesión de Checkout en lugar de usar PaymentIntent directamente
    console.log(`Creando sesión de Checkout con monto: ${amount/100}€ (${paymentOption})`);
    
    // Crear una sesión de checkout con URLs de éxito y cancelación
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Inscripció FC Cardedeu - ${description}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${secureOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${secureOrigin}/inscripcio`,
      billing_address_collection: 'auto',
      submit_type: 'pay',
      customer_creation: 'always',
      metadata: {
        payment_type: paymentOption,  // 'parcial' o 'completo'
        amount: amount.toString(),    // Monto en céntimos
        temporada: '2024-2025',       // Temporada actual
        product_id: productId,
      },
    });
    
    console.log('Sesión de Checkout creada:', session.id);
    
    // Verificar que tenemos una URL válida para la sesión
    if (!session.url) {
      throw new Error('No se pudo obtener la URL de la sesión de pago');
    }
    
    let finalUrl = session.url;
    
    // En producción, asegurar que la URL use HTTPS (importantes para Safari/iOS)
    if (process.env.NODE_ENV !== 'development') {
      finalUrl = finalUrl.replace('http:', 'https:');
    }
    
    // En desarrollo, personalizar la URL si estamos usando una IP local
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEVELOPMENT_URL) {
      // Verificar si estamos usando una IP personalizada
      const customDevUrl = process.env.NEXT_PUBLIC_DEVELOPMENT_URL;
      if (customDevUrl !== 'http://localhost:3000') {
        // Reemplazar localhost por la IP personalizada en la URL de redirección
        finalUrl = finalUrl.replace('localhost:3000', customDevUrl.replace(/^https?:\/\//, ''));
      }
    }
    
    console.log('URL de redirección de pago final:', finalUrl);
    
    // Retornar la URL preparada para la plataforma
    return finalUrl;
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