"use client";

import React from 'react';
import Header from '@/components/Header';

export default function CookiesContent() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-primary">Política de Cookies</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              <strong>Última actualización:</strong> 23 de junio de 2025
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web colocan en su dispositivo cuando los visita. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y proporcionar información a los propietarios del sitio.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Tipos de cookies que utilizamos</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium mt-6 mb-3">2.1 Cookies esenciales</h3>
              <p>
                Algunas cookies son esenciales para el funcionamiento de nuestro sitio. Le permiten navegar por el sitio y utilizar sus funciones. Sin estas cookies, no podríamos proporcionar los servicios que ha solicitado.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-3">2.2 Cookies de rendimiento y análisis</h3>
              <p>
                Estas cookies recopilan información sobre cómo los visitantes utilizan nuestro sitio web. Por ejemplo, qué páginas visitan con más frecuencia y si reciben mensajes de error. Estos datos nos ayudan a mejorar la forma en que funciona nuestro sitio.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-3">2.3 Cookies de funcionalidad</h3>
              <p>
                Estas cookies permiten que el sitio recuerde las elecciones que hace (como su nombre de usuario, idioma o la región en la que se encuentra) y proporcione características mejoradas y más personales.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-3">2.4 Cookies de terceros y redes sociales</h3>
              <p>
                Nuestro sitio puede incluir funcionalidades proporcionadas por terceros, como botones de "compartir" de redes sociales. Estos terceros pueden configurar sus propias cookies y recopilar información sobre su uso del sitio.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. ¿Cómo utilizamos las cookies?</h2>
            <p>
              Utilizamos cookies para diversos propósitos, que incluyen:
            </p>
            <ul className="list-disc pl-8 mb-6">
              <li>Autenticar a los usuarios registrados y mantener sus sesiones.</li>
              <li>Ayudar a los usuarios a completar formularios, como los de inscripción de jugadores.</li>
              <li>Analizar cómo los visitantes utilizan nuestro sitio para mejorarlo.</li>
              <li>Permitir funciones de redes sociales y compartir contenido.</li>
              <li>Personalizar su experiencia en el sitio basada en sus preferencias.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Control de cookies</h2>
            <p>
              Puede controlar y/o eliminar cookies según lo desee. Puede eliminar todas las cookies que ya están en su dispositivo y puede configurar la mayoría de los navegadores para evitar que se instalen.
            </p>
            <p>
              Para obtener información sobre cómo gestionar las cookies en los navegadores más populares:
            </p>
            <ul className="list-disc pl-8 mb-6">
              <li>Google Chrome: Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
              <li>Mozilla Firefox: Opciones → Privacidad y seguridad → Cookies y datos del sitio</li>
              <li>Safari: Preferencias → Privacidad</li>
              <li>Internet Explorer: Herramientas → Opciones de Internet → Privacidad</li>
            </ul>
            <p>
              Si desactiva las cookies, tenga en cuenta que algunas características de nuestro sitio pueden no funcionar correctamente.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cambios en nuestra Política de Cookies</h2>
            <p>
              Cualquier cambio que realicemos en nuestra política de cookies en el futuro se publicará en esta página. Por favor, revise nuestra política de cookies regularmente.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre nuestra política de cookies, por favor contáctenos en:
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
