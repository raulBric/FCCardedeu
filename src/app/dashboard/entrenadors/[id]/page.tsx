import { EntrenadorDetalleClient } from './components/EntrenadorDetalleClient';

// Use the most basic pattern for Next.js 15 App Router
export default async function Page({ params }: { params: { id: string } }) {
  // Extract the ID from the URL params
  const id = params.id;
  
  // Render the client component
  return <EntrenadorDetalleClient id={id} />;
}

// Metadata generation
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}) {
  return {
    title: `Detall Entrenador ${params.id} - FC Cardedeu`,
    description: `Gestió de l'entrenador ${params.id} i els seus equips`
  };
}
