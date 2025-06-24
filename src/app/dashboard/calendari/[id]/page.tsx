// Esta página es un Servidor Component (sin "use client")

import EditConvocatoriaClient from './EditConvocatoriaClient';

export default function EditConvocatoriaPage({ params }: { params: { id: string } }) {
  return <EditConvocatoriaClient id={params.id} />;
}
