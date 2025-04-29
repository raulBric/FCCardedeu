import { Suspense } from 'react';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CrearJugadorClient from './components/crear-jugador-client';

// This is a server component that provides the Suspense boundary
// for the client component that uses useSearchParams
export default function CrearJugadorPage() {
  return (
    <DashboardLayout title="Crear Jugador">
      <Suspense fallback={<div className="p-8 text-center">Cargando formulario...</div>}>
        <CrearJugadorClient />
      </Suspense>
    </DashboardLayout>
  );
}
