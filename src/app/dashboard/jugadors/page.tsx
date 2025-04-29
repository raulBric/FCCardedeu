"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  UserRound, 
  Calendar,
  Users
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button, DataTable } from "@/components/dashboard/FormComponents";
import Card from "@/components/dashboard/Card";
// Importar del adaptador en lugar del servicio directo
import { obtenerJugadors, eliminarJugador } from "@/adapters/ServiceAdapters";

// Interfaz para unificar los tipos del modelo antiguo y nuevo
type JugadorUI = {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  posicion: string;
  dorsal?: string;
  imagen_url: string;
  categoria: string;
  equipo: string;
  temporada: string;
  dni_nie: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  observaciones: string;
  activo: boolean;
};

export default function JugadoresPage() {
  const router = useRouter();
  const [jugadores, setJugadores] = useState<JugadorUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    equipo: 'todos',
    categoria: 'todos',
    temporada: '2024-2025',
    activo: true
  });
  
  // Cargar jugadores
  useEffect(() => {
    async function loadJugadores() {
      try {
        setIsLoading(true);
        const dataDB = await obtenerJugadors();
        const dataUI: JugadorUI[] = dataDB
          // Filtramos jugadores sin ID para evitar errores
          .filter(j => j.id !== undefined)
          .map(j => ({
            // Aseguramos que id es un número
            id: j.id as number,
            nombre: j.nom,
            apellidos: j.cognoms,
            fecha_nacimiento: j.data_naixement || '',
            posicion: j.posicio || '',
            dorsal: undefined,
            imagen_url: j.imatge_url || '',
            categoria: j.categoria || '',
            equipo: '',
            temporada: '2024-2025',
            dni_nie: j.dni_nie || '',
            email: j.email || '',
            telefono: j.telefon || '',
            direccion: j.direccio || '',
            ciudad: j.poblacio || '',
            codigo_postal: j.codi_postal || '',
            observaciones: j.observacions || '',
            activo: j.estat === 'actiu'
          }));
        setJugadores(dataUI);
      } catch (error) {
        console.error("Error al cargar jugadores:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadJugadores();
  }, []);
  
  // Jugadores filtrados
  const jugadoresFiltrados = jugadores.filter(jugador => {
    return (
      (filtros.equipo === 'todos' || jugador.equipo === filtros.equipo) &&
      (filtros.categoria === 'todos' || jugador.categoria === filtros.categoria) &&
      (jugador.temporada === filtros.temporada) &&
      (!filtros.activo || jugador.activo)
    );
  });
  
  // Eliminar jugador
  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await eliminarJugador(deleteId);
      setJugadores(prev => prev.filter(j => j.id !== deleteId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error al eliminar jugador:", error);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ca-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };
  
  // Calcular edad
  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  };
  
  // Opciones de filtro
  const equipos = ['todos', ...Array.from(new Set(jugadores.map(j => j.equipo)))];
  const categorias = ['todos', ...Array.from(new Set(jugadores.map(j => j.categoria)))];
  const temporadas = [...Array.from(new Set(jugadores.map(j => j.temporada)))];
  
  // Definir columnas para la tabla
  const columns = [
    {
      key: "imagen_url",
      header: "Foto",
      render: (value: string, item: JugadorUI) => (
        <div className="w-12 h-12 relative rounded-full overflow-hidden border border-gray-200 bg-white">
          {value ? (
            <Image 
              src={value} 
              alt={`${item.nombre} ${item.apellidos}`} 
              className="w-full h-full object-cover"
              width={48}
              height={48}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <UserRound className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      )
    },
    {
      key: "nombre",
      header: "Jugador",
      render: (nombre: string, item: JugadorUI) => (
        <div>
          <p className="font-medium text-gray-900">
            {nombre} {item.apellidos}
            {item.dorsal && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">{item.dorsal}</span>}
          </p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(item.fecha_nacimiento)} ({calcularEdad(item.fecha_nacimiento)} anys)</span>
          </div>
        </div>
      )
    },
    {
      key: "posicion",
      header: "Posició",
      render: (value: string) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: "equipo",
      header: "Equip",
      render: (equipo: string, item: JugadorUI) => (
        <div>
          <p className="font-medium">{equipo}</p>
          <p className="text-xs text-gray-500">{item.categoria}</p>
        </div>
      )
    },
    {
      key: "temporada",
      header: "Temporada",
      render: (value: string) => value
    },
    {
      key: "activo",
      header: "Estat",
      render: (value: boolean) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Actiu' : 'Inactiu'}
        </span>
      )
    },
    {
      key: "acciones",
      header: "Accions",
      render: (_: string, item: JugadorUI) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/jugadors/${item.id}/editar`)}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(item.id)}
            iconLeft={<Trash2 className="h-4 w-4" />}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout 
      title="Jugadors" 
      description="Gestiona els jugadors del club"
    >
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Llista de jugadors ({jugadoresFiltrados.length})
          </h2>
          <p className="text-gray-600">
            Gestiona els jugadors actius i històrics del club
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => router.push('/dashboard/jugadors/crear')}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Afegir jugador
        </Button>
      </div>
      
      {/* Filtros */}
      <Card title="Filtres" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equip
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={filtros.equipo}
              onChange={(e) => setFiltros(prev => ({ ...prev, equipo: e.target.value }))}
            >
              {equipos.map((equipo) => (
                <option key={equipo} value={equipo}>
                  {equipo === 'todos' ? 'Tots els equips' : equipo}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={filtros.categoria}
              onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria === 'todos' ? 'Totes les categories' : categoria}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temporada
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={filtros.temporada}
              onChange={(e) => setFiltros(prev => ({ ...prev, temporada: e.target.value }))}
            >
              {temporadas.map((temporada) => (
                <option key={temporada} value={temporada}>
                  {temporada}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="flex items-center h-12">
              <input
                type="checkbox"
                id="activos"
                checked={filtros.activo}
                onChange={(e) => setFiltros(prev => ({ ...prev, activo: e.target.checked }))}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="activos" className="ml-2 block text-sm text-gray-700">
                Mostrar només jugadors actius
              </label>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Resum per equips" className="col-span-1 lg:col-span-2">
          {isLoading ? (
            <div className="animate-pulse space-y-4 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {Object.entries(jugadores.reduce((acc, jugador) => {
                if (!acc[jugador.equipo]) {
                  acc[jugador.equipo] = [];
                }
                acc[jugador.equipo].push(jugador);
                return acc;
              }, {} as Record<string, JugadorUI[]>)).map(([equipo, jugadoresEquipo]) => (
                <div key={equipo} className="group">
                  <div className="flex justify-between items-center cursor-pointer py-2 px-3 hover:bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-red-600" />
                      <h3 className="font-medium">{equipo}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                        {jugadoresEquipo.filter(j => j.activo).length} actius
                      </span>
                      <span className="text-sm text-gray-500">
                        {jugadoresEquipo.length} total
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {Object.keys(jugadores.reduce((acc, jugador) => {
                if (!acc[jugador.equipo]) {
                  acc[jugador.equipo] = [];
                }
                acc[jugador.equipo].push(jugador);
                return acc;
              }, {} as Record<string, JugadorUI[]>)).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No hi ha jugadors registrats</p>
                </div>
              )}
            </div>
          )}
        </Card>
        
        <Card title="Estadístiques" className="col-span-1">
          {isLoading ? (
            <div className="animate-pulse flex flex-col py-4">
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="py-3 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{jugadores.length}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Actius</p>
                  <p className="text-2xl font-bold text-green-600">
                    {jugadores.filter(j => j.activo).length}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(jugadores.map(j => j.categoria)))
                    .map((categoria, index) => (
                      <div 
                        key={index}
                        className="flex items-center"
                      >
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                          {categoria}: {jugadores.filter(j => j.categoria === categoria).length}
                        </span>
                      </div>
                    ))
                  }
                  
                  {jugadores.length === 0 && (
                    <span className="text-sm text-gray-500">
                      No hi ha categories
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                variant="primary"
                fullWidth
                onClick={() => router.push('/dashboard/jugadors/crear')}
                iconLeft={<Plus className="h-4 w-4" />}
              >
                Afegir jugador
              </Button>
            </div>
          )}
        </Card>
      </div>
      
      <Card>
        <DataTable 
          columns={columns}
          data={jugadoresFiltrados}
          isLoading={isLoading}
          emptyMessage="No s'han trobat jugadors amb els filtres seleccionats"
        />
      </Card>
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminació</h3>
            <p className="text-gray-600 mb-4">
              Estàs segur que vols eliminar aquest jugador? Aquesta acció no es pot desfer.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel·lar
              </Button>
              <Button 
                variant="danger" 
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
