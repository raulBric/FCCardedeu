import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal | FC Cardedeu',
  description: 'Información legal sobre FC Cardedeu, derechos de propiedad intelectual y condiciones de uso.',
};

import LegalContent from './legal-content';

export default function LegalNoticePage() {
  return <LegalContent />;
}
