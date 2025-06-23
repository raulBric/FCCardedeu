import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | FC Cardedeu',
  description: 'Información sobre cómo FC Cardedeu recopila, utiliza y protege sus datos personales.',
};

import PrivacyContent from './privacy-content';

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
