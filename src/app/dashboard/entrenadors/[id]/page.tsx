import { EntrenadorDetalleClient } from './components/EntrenadorDetalleClient';
import { Metadata } from 'next';

type PageParams = { id: string };

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { id } = params;
  return {
    title: `Detall Entrenador ${id} - FC Cardedeu`,
    description: `Gestió de l'entrenador ${id} i els seus equips`
  };
}

// Server component that satisfies Next.js 15 page requirements
export default function EntrenadorDetallePage({ params }: { params: PageParams }) {
  // Usar el id directamente del params
  return <EntrenadorDetalleClient id={params.id} />;
}
