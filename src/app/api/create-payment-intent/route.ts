import { NextResponse } from 'next/server';
// Importar directamente el constructor de Stripe
import { Stripe } from 'stripe';

// Inicializa Stripe con la clave secreta solo si está bien configurada
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

// Variable para guardar la instancia de Stripe o null si hay error
let stripe: Stripe | null = null;

// Comprobar que la clave secreta está configurada y crear instancia de Stripe
if (!stripeSecretKey || stripeSecretKey.length < 10) {
  console.error('Error: STRIPE_SECRET_KEY no está configurada correctamente en las variables de entorno');
} else {
  try {
    // Crear instancia de Stripe con cualquier versión disponible
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any, // Using a simpler version if available
    });
    console.log('Stripe inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Stripe:', error);
    stripe = null;
  }
}

export async function POST(request: Request) {
  try {
    // Validar que Stripe se ha inicializado correctamente
    if (!stripe) {
      console.error('Error: Stripe no está inicializado correctamente');
      return NextResponse.json(
        { error: 'Error de configuración del servidor de pagos (Stripe no disponible)' },
        { status: 500 }
      );
    }

    // Extraer datos del cuerpo de la petición
    let data;
    try {
      data = await request.json();
    } catch (e) {
      console.error('Error al parsear el cuerpo de la petición:', e);
      return NextResponse.json(
        { error: 'Error al procesar los datos de la petición' },
        { status: 400 }
      );
    }
    
    const { email, playerDNI } = data;
    
    // Validar datos básicos
    if (!email || !playerDNI) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (email o DNI)' },
        { status: 400 }
      );
    }

    try {
      // Crear el PaymentIntent con opción fallback si falla
      try {
        // Intentar primero con opciones completas
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 15000, // 150€ en céntimos
          currency: 'eur',
          payment_method_types: ['card'],
          metadata: {
            playerDNI,
            email,
            source: 'inscripcio_web'
          },
          receipt_email: email,
          description: 'Inscripció FC Cardedeu',
        });

        console.log('PaymentIntent creado correctamente:', paymentIntent.id);

        // Devolver el client_secret para que el cliente pueda confirmar el pago
        return NextResponse.json({ 
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id 
        });
      } catch (initialError) {
        console.error('Error en el primer intento de crear PaymentIntent:', initialError);
        
        // Segundo intento con opciones mínimas
        const simplePaymentIntent = await stripe.paymentIntents.create({
          amount: 15000,
          currency: 'eur',
          // Sin métodos específicos, sin metadata, etc.
        });

        console.log('PaymentIntent creado con opciones mínimas:', simplePaymentIntent.id);

        return NextResponse.json({ 
          clientSecret: simplePaymentIntent.client_secret,
          paymentIntentId: simplePaymentIntent.id 
        });
      }
    } catch (stripeError: any) {
      console.error('Error de Stripe al crear PaymentIntent:', stripeError);
      
      // Manejar errores específicos de Stripe
      return NextResponse.json(
        { 
          error: `Error de Stripe: ${stripeError.message || 'Error desconocido'}`,
          details: stripeError.type || 'stripe_error'
        },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error('Error general al crear PaymentIntent:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Error al procesar el pago', 
        details: error.type || 'unknown_error' 
      },
      { status: 500 }
    );
  }
}
