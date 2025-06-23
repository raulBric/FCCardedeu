"use client";

import React from 'react';
import Header from '@/components/Header';

export default function LegalContent() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-primary">Aviso Legal</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              <strong>Última actualización:</strong> 23 de junio de 2025
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Identificación</h2>
            <p>
              En cumplimiento con el deber de información establecido en la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico, se informa que:
            </p>
            <ul className="list-disc pl-8 mb-6">
              <li>El titular de esta página web es el FC Cardedeu.</li>
              <li>Con domicilio en: Camp Municipal d'Esports de Cardedeu, 08440 Cardedeu, Barcelona.</li>
              <li>CIF: G08510398</li>
              <li>Teléfono de contacto: +34 938 71 31 31</li>
              <li>Email de contacto: info@fccardedeu.org</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Propiedad intelectual e industrial</h2>
            <p>
              El sitio web, incluyendo a título enunciativo pero no limitativo su programación, edición, compilación y demás elementos necesarios para su funcionamiento, los diseños, logotipos, texto y/o gráficos, son propiedad del FC Cardedeu o en su caso dispone de licencia o autorización expresa por parte de los autores.
            </p>
            <p>
              Todos los contenidos del sitio web están protegidos por derechos de propiedad intelectual e industrial, y están inscritos en los registros públicos correspondientes. Independientemente de la finalidad para la que fueran destinados, la reproducción total o parcial, uso, explotación, distribución y comercialización, requiere en todo caso la autorización escrita previa por parte del Club.
            </p>
            <p>
              Cualquier uso no autorizado previamente se considera un incumplimiento grave de los derechos de propiedad intelectual o industrial del autor.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Condiciones de uso</h2>
            <p>
              Para usar este sitio web, el usuario debe haber leído y aceptar estas condiciones de uso y la política de privacidad. El mero acceso o uso implica el conocimiento y la aceptación de las mismas.
            </p>
            <p>
              El usuario se compromete a utilizar el portal, los servicios y los contenidos del mismo de acuerdo con la ley, el presente aviso legal, y las demás condiciones, reglamentos e instrucciones que sean de aplicación.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Responsabilidad</h2>
            <p>
              FC Cardedeu no se hace responsable de los daños y perjuicios derivados de la existencia de virus, de programas maliciosos o lesivos en los contenidos y/o de fallos operativos que puedan producirse.
            </p>
            <p>
              FC Cardedeu no responde de los contenidos e información que puedan aparecer en enlaces a terceros a los que se haga referencia en la web.
            </p>
            <p>
              FC Cardedeu se reserva el derecho a modificar, en cualquier momento y sin previo aviso, la información contenida en su sitio web, así como las presentes condiciones de uso.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Jurisdicción</h2>
            <p>
              Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española, siendo competentes para la resolución de todos los conflictos derivados o relacionados con su uso los Juzgados y Tribunales de Barcelona.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contacto</h2>
            <p>
              Para cualquier duda, aclaración o comentario sobre este aviso legal, puede contactar con nosotros en:
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
