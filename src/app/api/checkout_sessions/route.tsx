import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

import { stripe } from '../../../lib/stripe'

// Define una interfaz para los errores de Stripe
interface StripeError extends Error {
  statusCode?: number;
  type?: string;
  code?: string;
}

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    // Obtener datos del body si existen
    let amount = 50; // Valor predeterminado en euros
    let description = 'FC Cardedeu Inscripción';
    
    try {
      const body = await req.json();
      if (body.amount && !isNaN(Number(body.amount))) {
        amount = Number(body.amount);
      }
      if (body.description) {
        description = body.description;
      }
    } catch (e) {
      // Si no hay body o no se puede parsear, usamos los valores predeterminados
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: description,
            },
            unit_amount: Math.round(amount * 100), // Stripe usa céntimos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });
    // Handle the case where session.url could be null
    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session URL' },
        { status: 500 }
      )
    }
    
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    // Manejar el error como un StripeError
    const stripeError = err as StripeError;
    const status = stripeError.statusCode || 500;
    
    return NextResponse.json(
      { error: stripeError.message },
      { status }
    )
  }
}