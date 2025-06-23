// // File: src/app/api/checkout_sessions/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';

// // Comprobar si la clave de API de Stripe está configurada
// let stripe: Stripe | null = null;
// if (process.env.STRIPE_SECRET_KEY) {
//   stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     apiVersion: '2025-02-24.acacia', // Use your desired API version
//   });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { amount, description, inscripcionData } = await req.json();

//     if (!inscripcionData) {
//       return NextResponse.json({ error: 'Missing inscripcionData' }, { status: 400 });
//     }
    
//     // Verificar si stripe está inicializado
//     if (!stripe) {
//       console.error('Stripe no está configurado. Falta STRIPE_SECRET_KEY.');
//       return NextResponse.json(
//         { error: 'La pasarela de pago no está configurada correctamente.' },
//         { status: 500 }
//       );
//     }

//     // Create a Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'eur',
//             product_data: {
//               name: description || 'Inscripció FC Cardedeu',
//               // You can add more product details if needed
//             },
//             unit_amount: amount * 100, // Amount in cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${req.headers.get('origin')}/inscripcio/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${req.headers.get('origin')}/inscripcio?canceled=true`,
//       metadata: {
//         // Dividir los datos en múltiples campos de metadatos para evitar el límite de 500 caracteres
//         // Datos del jugador
//         player_name: inscripcionData.playerName || '',
//         birth_date: inscripcionData.birthDate || '',
//         player_dni: inscripcionData.playerDNI || '',
//         health_card: inscripcionData.healthCard || '',
//         team: inscripcionData.team || '',
//         shirt_size: inscripcionData.shirtSize || '',
        
//         // Datos de contacto
//         parent_name: inscripcionData.parentName || '',
//         contact_phone1: inscripcionData.contactPhone1 || '',
//         contact_phone2: inscripcionData.contactPhone2 || '',
//         alt_contact: inscripcionData.altContact || '',
//         email1: inscripcionData.email1 || '',
//         email2: inscripcionData.email2 || '',
        
//         // Dirección
//         address: inscripcionData.address || '',
//         city: inscripcionData.city || '',
//         postal_code: inscripcionData.postalCode || '',
//         school: inscripcionData.school || '',
        
//         // Otros datos
//         siblings_in_club: String(inscripcionData.siblingsInClub || ''),
//         seasons_in_club: String(inscripcionData.seasonsInClub || ''),
//         bank_account: inscripcionData.bankAccount || '',
//         comments: inscripcionData.comments || '',
//         accept_terms: String(inscripcionData.acceptTerms || false),
//         temporada: inscripcionData.temporada || '2024-2025',
//         created_at: inscripcionData.created_at || new Date().toISOString(),
//       },
//     });

//     if (!session.url) {
//         return NextResponse.json({ error: 'Could not create Stripe session URL' }, { status: 500 });
//     }

//     return NextResponse.json({ url: session.url, sessionId: session.id });

//   } catch (error: any) {
//     console.error('Error creating Stripe checkout session:', error);
//     return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
//   }
// }
