"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Plane } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/services/supabaseService";

interface Convocatoria {
  id: number;
  team: string;
  opponent: string;
  date: string;
  matchTime: string;
  callTime: string;
  location: string;
  locationLink: string;
  title?: string;
  meetingPoint?: string;
  notes?: string;
  status?: string;
}

const teams: string[] = [
  "Primer Equip",
  "Juvenil A",
  "Juvenil B",
  "Cadet A",
  "Cadet B",
  "Infantil A",
  "Infantil B",
  "Aleví A",
  "Aleví B",
  "Benjamí A",
  "Benjamí B",
];

// Los datos ahora vendrán de Supabase

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export default function ConvocatoriasPage() {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        setIsLoading(true);
        
        // Ahora podemos acceder directamente a la tabla convocatorias
        // gracias a la política RLS modificada
        const { data, error } = await supabase
          .from('convocatorias')
          .select('*')
          .order('fecha', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          procesarDatos(data);
        } else {
          setConvocatorias([]);
        }
      
        
      } catch (err: any) {
        console.error("Error al cargar convocatorias:", err);
        setError(`No se pudieron cargar las convocatorias: ${err.message || 'Error desconocido'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Función para procesar los datos una vez obtenidos
    const procesarDatos = (data: any[]) => {
      // Mapear los datos de la BD al formato de nuestra interfaz
      const formattedData: Convocatoria[] = data.map((item: any) => {
        console.log('Procesando item:', item);
        return {
          id: item.id,
          team: item.equipo || '',
          opponent: item.rival || '',
          date: item.fecha || '',
          matchTime: item.hora || '',
          callTime: item.horaencuentro || '',
          location: item.lugar || '',
          locationLink: 'https://maps.app.goo.gl/DtqpXQyKRvjzPj4E8',  // Usamos URL por defecto ya que no hay campo para mapear
          title: item.titulo || '',
          meetingPoint: item.puntoencuentro || '',
          notes: item.notas || '',
          status: item.estado || ''
        };
      });
      
      console.log('Datos formateados:', formattedData);
      setConvocatorias(formattedData);
    };

    fetchConvocatorias();
  }, []); 

  const filteredConvocatorias = selectedTeam
    ? convocatorias.filter((convocatoria) => convocatoria.team === selectedTeam)
    : convocatorias;

  return (
    <>
    <Header />
    <main className="max-w-4xl mx-auto p-6 bg-white  mt-20 relative">
      {/* Componente de Publicidad destacado arriba - Versión mejorada */}
      <div className="w-full bg-gradient-to-r from-red-400 to-red-600 text-white p-4 rounded-lg shadow-md mb-6 border border-red-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full">
              <Image
                src="/placeholder.svg?height=40&width=40&text=FC"
                alt="Logo patrocinador"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">Patrocinador Oficial</p>
              <Link
                href="https://www.dgital.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-white hover:text-yellow-300 transition-colors"
              >
                Dgital
              </Link>
            </div>
          </div>
          <Link
            href="https://www.patrocinador.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-yellow-400 text-red-900 font-medium px-3 py-1 rounded-md text-sm transition-colors"
          >
            Visitar
          </Link>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-red-600 text-center mb-6">Convocatòries de Partits</h1>

      <div className="mb-6">
        <label className="block font-medium text-gray-700">Filtrar per equip:</label>
        <select
          className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          value={selectedTeam}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedTeam(e.target.value)}
        >
          <option value="">Tots els equips</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>


      {isLoading ? (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Cargando convocatorias...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredConvocatorias.length > 0 ? (
        <ul className="space-y-4">
          {filteredConvocatorias.map((convocatoria) => (
            <li key={convocatoria.id} className="p-4 border rounded-lg shadow-md bg-gray-50 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-red-600">{convocatoria.team} vs {convocatoria.opponent}</h2>
                {convocatoria.location.includes("Cardedeu") ? (
                  <Home className="text-green-600 w-6 h-6"  />
                ) : (
                  <Plane className="text-blue-600 w-6 h-6"  />
                )}
              </div>
              <p className="text-gray-700">📅 {formatDate(convocatoria.date)}</p>
              <p className="text-gray-700">📍 <Link href={convocatoria.locationLink} target="_blank" className="text-blue-600 hover:underline">{convocatoria.location}</Link></p>
              <p className="text-gray-700">🕒 Hora de convocatòria: {convocatoria.callTime}</p>
              <p className="text-gray-700">⏳ Hora de partit: {convocatoria.matchTime}</p>
              {convocatoria.meetingPoint && (
                <p className="text-gray-700">📍 Punt de trobada: {convocatoria.meetingPoint}</p>
              )}
              {convocatoria.notes && (
                <div className="mt-2 p-2 bg-gray-100 rounded-md">
                  <p className="text-gray-700 text-sm font-medium">Notes:</p>
                  <p className="text-gray-600 text-sm">{convocatoria.notes}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No hi ha convocatòries per a aquest equip.</p>
      )}
    </main>
    </>
  );
}