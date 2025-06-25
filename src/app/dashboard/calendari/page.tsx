"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Calendar, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

import { getConvocatorias, eliminarConvocatoria } from '@/services/convocatorias';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/dashboard/FormComponents';

import { Convocatoria } from '@/services/convocatorias';

export default function CalendariPage() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminarId, setEliminarId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  async function fetchConvocatorias() {
    try {
      setLoading(true);
      const data = await getConvocatorias();
      setConvocatorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar convocatorias:', error);
      toast.error('No se pudieron cargar las convocatorias');
    } finally {
      setLoading(false);
    }
  }

  const handleEliminarClick = (id: string) => {
    setEliminarId(id);
  };

  const confirmarEliminar = async () => {
    if (!eliminarId) return;
    
    try {
      await eliminarConvocatoria(eliminarId);
      setConvocatorias(convocatorias.filter(conv => conv.id !== eliminarId));
      toast.success('Convocatoria eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar convocatoria:', error);
      toast.error('No se pudo eliminar la convocatoria');
    } finally {
      setEliminarId(null);
    }
  };

  const cancelarEliminar = () => {
    setEliminarId(null);
  };

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'borrador':
        return 'bg-yellow-100 text-yellow-800';
      case 'publicada':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ca-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="ml-0 md:ml-64">
      <div className="py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Gestió de Convocatòries
          </h1>
          <Link href="/dashboard/calendari/nueva">
            <Button className="flex items-center justify-center whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              <span>Nova Convocatòria</span>
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Convocatòries</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : convocatorias.length === 0 ? (
              <p className="text-center py-6 text-gray-500">No hi ha convocatòries disponibles</p>
            ) : (
              <>
                {/* Vista en dispositivos grandes (md y superior) - Tabla tradicional */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                      <thead className="text-xs uppercase bg-gray-50">
                        <tr>
                          <th className="px-2 py-3 text-center">Títol</th>
                          <th className="px-2 py-3 text-center" style={{width: '100px'}}>Data</th>
                          <th className="px-2 py-3 text-center" style={{width: '80px'}}>Hora</th>
                          <th className="px-2 py-3 text-center hidden lg:table-cell">Lloc</th>
                          <th className="px-2 py-3 text-center" style={{width: '80px'}}>Equip</th>
                          <th className="px-2 py-3 text-center" style={{width: '90px'}}>Estat</th>
                          <th className="px-2 py-3 text-right" style={{width: '100px'}}>Accions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {convocatorias.map((convocatoria) => (
                          <tr key={convocatoria.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-2 py-2 font-medium text-center truncate">{convocatoria.titulo}</td>
                            <td className="px-2 py-2 text-center">{formatDate(convocatoria.fecha)}</td>
                            <td className="px-2 py-2 text-center hidden lg:table-cell">{convocatoria.hora}</td>
                            <td className="px-2 py-2 text-center hidden lg:table-cell truncate">{convocatoria.lugar}</td>
                            <td className="px-2 py-2 text-center">{convocatoria.equipo}</td>
                            <td className="px-2 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(convocatoria.estado)}`}>
                                {convocatoria.estado}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-right">
                              <div className="flex justify-end gap-1 w-auto whitespace-nowrap">
                                <Link href={`/dashboard/calendari/${convocatoria.id}`}>
                                  <Button variant="outline" size="sm" className="min-w-0">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button 
                                  variant="danger" 
                                  size="sm" 
                                  className="min-w-0"
                                  onClick={() => handleEliminarClick(convocatoria.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                  </table>
                </div>

                {/* Vista en dispositivos móviles (sm y xs) - Cards verticales */}
                <div className="md:hidden grid grid-cols-1 gap-4 w-auto">
                  {convocatorias.map((convocatoria) => (
                    <div key={convocatoria.id} className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-base">{convocatoria.titulo}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(convocatoria.estado)}`}>
                          {convocatoria.estado}
                        </span>
                      </div>
                      
                      <div className="text-sm space-y-1 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Data:</span> 
                          <span>{formatDate(convocatoria.fecha)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Hora:</span> 
                          <span>{convocatoria.hora}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Lloc:</span> 
                          <span>{convocatoria.lugar}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Equip:</span> 
                          <span>{convocatoria.equipo}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-3 pt-2 border-t">
                        <Link href={`/dashboard/calendari/${convocatoria.id}`} aria-label="Editar convocatoria">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4 mr-1" />
                            <span>Editar</span>
                          </Button>
                        </Link>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleEliminarClick(convocatoria.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span>Eliminar</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal de confirmación para eliminar */}
        {eliminarId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-auto">
              <h3 className="text-lg font-semibold mb-4">Confirmar Eliminació</h3>
              <p className="mb-6">Estàs segur que vols eliminar aquesta convocatòria? Aquesta acció no es pot desfer.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={cancelarEliminar}>
                  Cancel·lar
                </Button>
                <Button variant="danger" onClick={confirmarEliminar}>
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
