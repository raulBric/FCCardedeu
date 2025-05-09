'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { guardarPaso2, recuperarDatosPaso1 } from '@/app/actions/inscripciones';

export default function FormularioPaso2() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datosPaso1, setDatosPaso1] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  // Recuperar los datos del paso 1 al cargar la página
  useEffect(() => {
    async function cargarDatosPaso1() {
      try {
        const datos = await recuperarDatosPaso1();
        if (!datos) {
          // Si no hay datos, redirigir al paso 1
          setError('No se encontraron datos previos. Por favor, completa el Paso 1.');
          setTimeout(() => {
            router.push('/inscripcio/paso1');
          }, 2000);
          return;
        }
        setDatosPaso1(datos);
      } catch (e) {
        console.error('Error al recuperar datos previos:', e);
        setError('Error al recuperar tus datos. Por favor, vuelve al Paso 1.');
      } finally {
        setCargando(false);
      }
    }

    cargarDatosPaso1();
  }, [router]);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await guardarPaso2(formData);
      
      if (result.success) {
        // Redirigir a la página de confirmación
        router.push(`/inscripcio/confirmacion?id=${result.inscripcionId}`);
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

  if (cargando) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Inscripción al FC Cardedeu - Paso 2</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {datosPaso1 && (
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <p className="font-semibold">Datos del jugador:</p>
          <p>{datosPaso1.nombre} {datosPaso1.apellidos}</p>
        </div>
      )}
      
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium mb-1">
            Dirección *
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="codigo_postal" className="block text-sm font-medium mb-1">
            Código Postal *
          </label>
          <input
            type="text"
            id="codigo_postal"
            name="codigo_postal"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="poblacion" className="block text-sm font-medium mb-1">
            Población *
          </label>
          <input
            type="text"
            id="poblacion"
            name="poblacion"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium mb-1">
            Categoría *
          </label>
          <select
            id="categoria"
            name="categoria"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecciona una categoría</option>
            <option value="prebenjami">Prebenjamín</option>
            <option value="benjami">Benjamín</option>
            <option value="alevi">Alevín</option>
            <option value="infantil">Infantil</option>
            <option value="cadet">Cadete</option>
            <option value="juvenil">Juvenil</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="foto_jugador" className="block text-sm font-medium mb-1">
            Foto del Jugador
          </label>
          <input
            type="file"
            id="foto_jugador"
            name="foto_jugador"
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formato: JPG o PNG. Tamaño máximo: 5MB
          </p>
        </div>
        
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/inscripcio/paso1')}
            className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
          >
            Volver al Paso 1
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Procesando...' : 'Completar Inscripción'}
          </button>
        </div>
      </form>
    </div>
  );
}
