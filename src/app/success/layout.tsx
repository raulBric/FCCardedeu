import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pago Exitoso | FC Cardedeu',
  description: 'Gracias por tu pago. Tu inscripción ha sido procesada correctamente.',
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
