// File: src/app/api/verify_payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe';

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

    // Recuperar la sesión de Stripe
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
  } catch (error: any) {
    console.error('Error al verificar el pago:', error);
    return NextResponse.json(
      { success: false, error: `Error al verificar el pago: ${error.message}` },
      { status: 500 }
    );
  }
}
