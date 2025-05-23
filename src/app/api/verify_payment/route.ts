import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    // Obtener session_id de la URL
    const url = new URL(req.url)
    const session_id = url.searchParams.get('session_id')
    
    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'No se ha proporcionado session_id' },
        { status: 400 }
      )
    }

    // Recuperar la sesión de Stripe usando el session_id
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent', 'customer_details']
    })
    
    // Verificar si el pago está completado
    if (session.status !== 'complete') {
      return NextResponse.json(
        { success: false, error: `El pago no está completado. Estado: ${session.status}` },
        { status: 400 }
      )
    }

    // Si llegamos aquí, el pago está completado
    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        customer_details: session.customer_details,
        amount_total: session.amount_total,
        payment_status: session.payment_status,
        metadata: session.metadata
      }
    })
  } catch (error) {
    console.error('Error al verificar el pago:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido al verificar el pago' 
      },
      { status: 500 }
    )
  }
}
