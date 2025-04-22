"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Plane } from "lucide-react";
import Header from "@/components/Header";

interface Convocatoria {
  id: number;
  team: string;
  opponent: string;
  date: string;
  matchTime: string;
  callTime: string;
  location: string;
  locationLink: string;
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

const convocatorias: Convocatoria[] = [
  { id: 1, team: "Primer Equip", opponent: "FC Barcelona", date: "2025-01-24", matchTime: "18:00", callTime: "16:30", location: "Camp Municipal Cardedeu",locationLink: "https://maps.app.goo.gl/DtqpXQyKRvjzPj4E8" },
  { id: 2, team: "Juvenil A", opponent: "Espanyol", date: "2025-01-26", matchTime: "16:00", callTime: "14:30", location: "Camp de l'Espanyol",locationLink: "https://maps.app.goo.gl/DtqpXQyKRvjzPj4E8" },
  { id: 3, team: "Cadet A", opponent: "Girona FC", date: "2025-01-27", matchTime: "15:00", callTime: "13:30", location: "Camp Municipal Girona",locationLink: "https://maps.app.goo.gl/DtqpXQyKRvjzPj4E8" },
  { id: 4, team: "Aleví B", opponent: "Sabadell FC", date: "2025-01-28", matchTime: "10:30", callTime: "09:00", location: "Camp Sabadell",locationLink: "https://maps.app.goo.gl/DtqpXQyKRvjzPj4E8" },
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export default function ConvocatoriasPage() {
  const [selectedTeam, setSelectedTeam] = useState<string>("");

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

      {filteredConvocatorias.length > 0 ? (
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