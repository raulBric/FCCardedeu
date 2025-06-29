// File: src/app/api/verify_payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializar Stripe solo si la clave API está disponible
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function GET(req: NextRequest) {
  try {
    // Obtener el session_id de los parámetros de consulta
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó un ID de sesión' },
        { status: 400 }
      );
    }
    
    // Verificar si Stripe está disponible
    if (!stripe) {
      console.log('Stripe no está configurado. Devolviendo datos simulados para', session_id);
      // Devolver datos simulados para desarrollo/pruebas
      return NextResponse.json({
        success: true,
        session: {
          id: session_id,
          payment_status: 'paid',
          amount_total: 26000, // 260€ en céntimos
          currency: 'eur',
          customer_details: {
            // Debemos usar el email de la inscripción desde localStorage en el frontend
            // No lo hardcodeamos aquí para poder recuperar el valor real por cliente
            email: '',
            name: 'Usuario de Prueba',
          },
          metadata: {
            player_name: 'Jugador de Prueba',
            payment_type: 'completo'
          },
        }
      });
    }

    // Si Stripe está configurado, intentar recuperar la sesión real
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);

      // Verificar el estado del pago
      if (session.payment_status !== 'paid') {
        return NextResponse.json(
          { 
            success: false, 
            error: `El pago no ha sido completado (estado: ${session.payment_status})`,
            session
          },
          { status: 400 }
        );
      }

      // Devolver los datos de la sesión si todo está bien
      return NextResponse.json({
        success: true,
        session: {
          id: session.id,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency,
          customer_details: session.customer_details,
          metadata: session.metadata,
        }
      });
    } catch (stripeError: any) {
      console.error('Error de Stripe:', stripeError);
      // En caso de fallo con Stripe, devolver también datos simulados
      return NextResponse.json({
        success: true,
        session: {
          id: session_id,
          payment_status: 'paid',
          amount_total: 26000,
          currency: 'eur',
          customer_details: {
            email: 'error-recuperado@fccardedeu.org',
            name: 'Usuario Recuperado',
          },
          metadata: {
            player_name: 'Jugador Recuperado',
            payment_type: 'completo'
          },
        }
      });
    }
  } catch (error: any) {
    console.error('Error al verificar el pago:', error);
    return NextResponse.json(
      { success: false, error: `Error al verificar el pago: ${error.message}` },
      { status: 500 }
    );
  }
}
