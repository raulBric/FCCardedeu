// import { NextRequest, NextResponse } from 'next/server';
// import { fetchClientSecret } from '@/app/actions/stripe';

// export async function POST(req: NextRequest) {
//   try {
//     // Obtener datos de la solicitud
//     const body = await req.json();
    
//     // Extraer la opción de pago (parcial o completo)
//     const { email, playerDNI, paymentOption = 'completo' } = body;
    
//     // Validar datos necesarios
//     if (!email) {
//       return NextResponse.json(
//         { error: 'Es necessita un email vàlid.' },
//         { status: 400 }
//       );
//     }

//     // Si es una solicitud de prueba para comprobar si la API está disponible
//     if (body.test) {
//       return NextResponse.json({ status: 'ok' });
//     }

//     console.log(`API: Procesando petición de pago con opción: ${paymentOption}`);
//     console.log(`API: Datos recibidos - email: ${email}, opción: ${paymentOption}`);

//     // Asegurarse de que la opción de pago es válida
//     const validOption = paymentOption === 'parcial' || paymentOption === 'completo' 
//       ? paymentOption 
//       : 'completo';

//     // Crear el checkout session con la opción de pago especificada
//     const clientSecret = await fetchClientSecret(validOption);
    
//     // Devolver el clientSecret para inicializar el formulario de pago
//     return NextResponse.json({ 
//       clientSecret,
//       paymentIntentId: 'pi_' + Date.now(), // Este ID sería normalmente devuelto por Stripe
//       paymentOption: validOption, // Devolver la opción validada para confirmación
//       amount: validOption === 'parcial' ? 100 : 260 // Monto en euros para mostrar
//     });
    
//   } catch (error: any) {
//     console.error('Error en create-payment-intent:', error);
    
//     return NextResponse.json(
//       { error: `Error al crear el PaymentIntent: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }
