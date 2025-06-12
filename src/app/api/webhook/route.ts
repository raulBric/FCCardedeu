// File: src/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js'; // Use admin client for webhooks

// Initialize Supabase admin client (use environment variables)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT: Use service role key for backend operations
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error('Webhook Error: Missing signature or secret');
      return NextResponse.json({ error: 'Webhook signature or secret missing' }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('Checkout session completed:', session.id);

    // Verificar que tenemos metadatos
    if (!session.metadata) {
      console.error('Webhook Error: No metadata found in session', session.id);
      return NextResponse.json({ error: 'Missing metadata in session' }, { status: 400 });
    }

    try {
      // Obtener los datos directamente de los campos de metadatos
      const metadata = session.metadata;
      
      // Determinar tipo de pago y estado correspondiente
      const paymentType = metadata?.payment_type || 'completo';
      const productId = metadata?.product_id || '';
      const paymentAmount = metadata?.amount ? parseInt(metadata.amount, 10) : 0;
      
      // Determinar estado según el tipo de pago
      let estadoPago;
      let importePagado = 0;
      let importePendiente = 0;
      
      if (paymentType === 'parcial') {
        estadoPago = 'pago_parcial'; // Estado para pagos parciales
        importePagado = 100; // 100€ para pago parcial
        importePendiente = 160; // 160€ pendientes
        console.log(`Pago parcial recibido (${importePagado}€). Pendiente: ${importePendiente}€`);
      } else {
        estadoPago = 'pagado'; // Estado para pagos completos
        importePagado = 260; // 260€ para pago completo
        importePendiente = 0; // Nada pendiente
        console.log(`Pago completo recibido (${importePagado}€). Nada pendiente.`);
      }
      
      // Add payment status and Stripe session ID
      const dataToSave: any = {
        // Datos del jugador
        player_name: metadata.player_name || '',
        birth_date: metadata.birth_date || '',
        player_dni: metadata.player_dni || '', 
        health_card: metadata.health_card || '',
        team: metadata.team || '',
        shirt_size: metadata.shirt_size || '',
        
        // Datos de contacto
        parent_name: metadata.parent_name || '',
        contact_phone1: metadata.contact_phone1 || '',
        contact_phone2: metadata.contact_phone2 || '',
        alt_contact: metadata.alt_contact || '',
        email1: metadata.email1 || '',
        email2: metadata.email2 || '',
        
        // Dirección
        address: metadata.address || '',
        city: metadata.city || '',
        postal_code: metadata.postal_code || '',
        school: metadata.school || '',
        
        // Otros datos
        siblings_in_club: metadata.siblings_in_club ? parseInt(metadata.siblings_in_club) : 0,
        seasons_in_club: metadata.seasons_in_club ? parseInt(metadata.seasons_in_club) : 0,
        bank_account: metadata.bank_account || '',
        comments: metadata.comments || '',
        accept_terms: metadata.accept_terms === 'true',
        
        // Estado y datos de pago
        estado: estadoPago,
        tipo_pago: paymentType,
        importe_pagado: importePagado,
        importe_pendiente: importePendiente,
        producto_stripe: productId,
        temporada: metadata.temporada || '2024-2025',
        stripe_payment_id: session.payment_intent as string || '', // Store the payment intent ID
        stripe_checkout_session_id: session.id, // Store the checkout session ID
        fecha_pago: new Date().toISOString(),
        created_at: metadata.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('inscripciones') // Your Supabase table name
        .insert([dataToSave])
        .select();

      if (error) {
        console.error('Supabase error inserting inscription:', error);
        // Consider retry logic or alerting for failed DB writes
        return NextResponse.json({ error: `Supabase error: ${error.message}` }, { status: 500 });
      }

      console.log('Inscription saved successfully to Supabase:', data);

    } catch (parseError: any) {
      console.error('Webhook Error: Failed to parse inscripcionData from metadata for session', session.id, parseError);
      return NextResponse.json({ error: 'Failed to parse inscription data' }, { status: 400 });
    }
  } else {
    console.log(`Received unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
