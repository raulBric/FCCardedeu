'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { guardarPaso1 } from '@/app/actions/inscripciones';

export default function FormularioPaso1() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await guardarPaso1(formData);
      
      if (result.success) {
        // Redirigir al paso 2
        router.push('/inscripcio/paso2');
      } else {
        setError(result.error || 'Error al procesar el formulario');
      }
    } catch (e) {
      setError('Ha ocurrido un error en el servidor');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Inscripción al FC Cardedeu - Paso 1</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium mb-1">
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium mb-1">
            Apellidos *
          </label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="fecha_nacimiento" className="block text-sm font-medium mb-1">
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="dni" className="block text-sm font-medium mb-1">
            DNI/NIE
          </label>
          <input
            type="text"
            id="dni"
            name="dni"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="email1" className="block text-sm font-medium mb-1">
            Email de Contacto *
          </label>
          <input
            type="email"
            id="email1"
            name="email1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="telefono1" className="block text-sm font-medium mb-1">
            Teléfono de Contacto *
          </label>
          <input
            type="tel"
            id="telefono1"
            name="telefono1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Procesando...' : 'Continuar al Paso 2'}
          </button>
        </div>
      </form>
    </div>
  );
}
