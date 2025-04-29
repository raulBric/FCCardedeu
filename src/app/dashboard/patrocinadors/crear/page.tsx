import { Suspense } from 'react';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CrearPatrocinadorClient from './components/crear-patrocinador-client';

// Este es un componente del servidor que proporciona el límite de Suspense
// para el componente cliente que usa useSearchParams y otras APIs cliente
export default function CrearPatrocinadorPage() {
  return (
    <DashboardLayout 
      title="Crear patrocinador" 
      description="Afegeix un nou patrocinador o col·laborador al web"
    >
      <Suspense fallback={<div className="p-8 text-center">Carregant formulari...</div>}>
        <CrearPatrocinadorClient />
      </Suspense>
    </DashboardLayout>
  );
}
