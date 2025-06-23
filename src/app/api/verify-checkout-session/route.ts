// // File: src/app/api/verify-checkout-session/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-02-24.acacia',
// });

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const sessionId = searchParams.get('session_id');

//   if (!sessionId) {
//     return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
//   }

//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     return NextResponse.json({
//       status: session.status, // e.g., 'open', 'complete', 'expired'
//       payment_status: session.payment_status, // e.g., 'paid', 'unpaid', 'no_payment_required'
//       customer_email: session.customer_details?.email
//     });
//   } catch (error: any) {
//     console.error('Error retrieving Stripe session:', error);
//     return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
//   }
// }
