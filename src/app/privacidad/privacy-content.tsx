"use client";

import React from 'react';
import Header from '@/components/Header';

export default function PrivacyContent() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-primary">Política de Privacidad</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              <strong>Última actualización:</strong> 23 de junio de 2025
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Información General</h2>
            <p>
              FC Cardedeu ("nosotros", "nuestro" o "Club") se compromete a proteger y respetar su privacidad. Esta política de privacidad establece la base sobre la que procesamos cualquier dato personal que recopilamos de usted o que nos proporciona.
            </p>
            <p>
              Para los fines del Reglamento General de Protección de Datos (RGPD), el responsable del tratamiento es FC Cardedeu con sede en Camp Municipal d'Esports de Cardedeu, 08440 Cardedeu, Barcelona.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Información que Recopilamos</h2>
            <p>Podemos recopilar y procesar los siguientes datos:</p>
            <ul className="list-disc pl-8 mb-6">
              <li>Información que nos proporciona al completar formularios en nuestra web, incluyendo información proporcionada al registrarse en nuestro sitio, suscribirse a nuestros servicios o registrar a un jugador.</li>
              <li>Información proporcionada al comunicarse con nosotros o reportar un problema con nuestro sitio.</li>
              <li>Detalles de sus visitas a nuestro sitio y los recursos a los que accede.</li>
              <li>Información médica relevante necesaria para la seguridad de los jugadores durante actividades deportivas.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Uso de la Información</h2>
            <p>Utilizamos la información que tenemos sobre usted de las siguientes maneras:</p>
            <ul className="list-disc pl-8 mb-6">
              <li>Para asegurar que el contenido de nuestro sitio se presente de la manera más efectiva para usted.</li>
              <li>Para proporcionarle información, productos o servicios que nos solicite o que creamos que puedan interesarle.</li>
              <li>Para gestionar inscripciones, licencias federativas y trámites relacionados con la actividad deportiva.</li>
              <li>Para comunicarle cambios en nuestro servicio.</li>
              <li>Para cumplir con nuestras obligaciones legales y reglamentarias.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Divulgación de su Información</h2>
            <p>Podemos compartir su información personal con:</p>
            <ul className="list-disc pl-8 mb-6">
              <li>La Federación Catalana de Fútbol y otras organizaciones deportivas para la gestión de licencias y competiciones.</li>
              <li>Servicios de terceros que utilizamos para operar nuestro Club (como procesadores de pagos).</li>
              <li>Autoridades gubernamentales si estamos obligados a hacerlo por ley.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Conservación de Datos</h2>
            <p>
              Conservaremos sus datos personales solo durante el tiempo necesario para los fines establecidos en esta política de privacidad o según lo requerido por la ley. Para los jugadores, esto generalmente significa durante su permanencia en el Club y hasta cinco años después para cumplir con obligaciones legales y fiscales.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Sus Derechos</h2>
            <p>Usted tiene derecho a:</p>
            <ul className="list-disc pl-8 mb-6">
              <li>Solicitar acceso a sus datos personales.</li>
              <li>Solicitar la corrección de sus datos personales.</li>
              <li>Solicitar la supresión de sus datos personales.</li>
              <li>Oponerse al procesamiento de sus datos personales.</li>
              <li>Solicitar la restricción del procesamiento de sus datos personales.</li>
              <li>Solicitar la portabilidad de sus datos.</li>
              <li>Retirar su consentimiento.</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, por favor contáctenos en info@fccardedeu.org.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Menores</h2>
            <p>
              Nuestros servicios están generalmente dirigidos a menores, ya que operamos como un club de fútbol juvenil. Recopilamos datos de menores solo con el consentimiento explícito de sus padres o tutores legales. Si descubrimos que hemos recopilado datos personales de un menor sin el consentimiento parental/tutor verificable, tomaremos medidas para eliminar esa información.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cambios a nuestra Política de Privacidad</h2>
            <p>
              Cualquier cambio que realicemos en nuestra política de privacidad en el futuro se publicará en esta página. Por favor, revise nuestra política de privacidad regularmente.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre esta política de privacidad, por favor contáctenos en:
            </p>
            <address className="not-italic mb-6">
              FC Cardedeu<br />
              Camp Municipal d'Esports de Cardedeu<br />
              08440 Cardedeu<br />
              Barcelona<br />
              Teléfono: +34 938 71 31 31<br />
              Email: info@fccardedeu.org
            </address>
          </div>
        </div>
      </div>
    </>
  );
}
