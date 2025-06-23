import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies | FC Cardedeu',
  description: 'Información sobre cómo FC Cardedeu utiliza cookies en su sitio web.',
};

import CookiesContent from './cookies-content';

export default function CookiesPolicyPage() {
  return <CookiesContent />;
}
