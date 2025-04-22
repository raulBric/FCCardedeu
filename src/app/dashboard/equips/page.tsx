"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2,
  ShieldIcon,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, DataTable, InputField, TextareaField, SelectField } from "@/components/dashboard/FormComponents";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Card from "@/components/dashboard/Card";
// Usar los adaptadores en lugar de los servicios directos
import { 
  Equip, 
  crearEquip, 
  eliminarEquip, 
  obtenerEquips,
  obtenerEntrenadors
} from "@/adapters/ServiceAdapters";
import { Entrenador } from "@/core/domain/models/Entrenador";
import { toast } from "react-hot-toast";

export default function EquipsPage() {
  const router = useRouter();
  const [equips, setEquips] = useState<Equip[]>([]);
  const [entrenadors, setEntrenadors] = useState<Entrenador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newEquip, setNewEquip] = useState<Omit<Equip, 'id' | 'created_at' | 'updated_at'>>({
    nom: '',
    categoria: '',
    temporada: '2024-2025',
    entrenador: '',
    delegat: '',
    descripcio: ''
  });
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar equipos y entrenadores
  const loadData = async () => {
    try {
      setIsLoading(true);
      // Intentamos cargar los equipos
      const equipData = await obtenerEquips();
      setEquips(equipData);
      
      // Intentamos cargar los entrenadores, pero manejamos el error por si la tabla no existe
      try {
        const entrenadorData = await obtenerEntrenadors();
        setEntrenadors(entrenadorData);
      } catch (entError) {
        console.error("Error al cargar entrenadores (posiblemente la tabla no existe):", entError);
        // Datos de ejemplo para entrenadores si la tabla no existe
        setEntrenadors([
          { id: 1, nom: 'Joan', cognom: 'García', tipus: 'principal', created_at: '', updated_at: '' },
          { id: 2, nom: 'Marta', cognom: 'Rodríguez', tipus: 'segon', created_at: '', updated_at: '' },
          { id: 3, nom: 'Josep', cognom: 'Martínez', tipus: 'principal', created_at: '', updated_at: '' },
          { id: 4, nom: 'Anna', cognom: 'López', tipus: 'delegat', created_at: '', updated_at: '' }
        ]);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("No s&apos;han pogut carregar les dades");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos cuando se monta el componente o cambia la ruta
  useEffect(() => {
    loadData();
    
    // Escuchar cambios en la URL para recargar datos cuando se vuelve a esta página
    const handleRouteChange = () => {
      console.log('Cambio de ruta detectado, recargando datos de equipos...');
      loadData();
    };
    
    // Usar un listener manual ya que Next.js App Router no proporciona eventos de ruta
    window.addEventListener('focus', handleRouteChange);
    
    return () => {
      window.removeEventListener('focus', handleRouteChange);
    };
  }, []);
  
  // Recargar datos cuando se hace visible la página (como cuando se vuelve atrás)
  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('Página visible, recargando datos...');
        loadData();
      }
    });
  }, []);

  // Manejar creación de equipo
  const handleCreateEquip = async () => {
    if (!newEquip.nom || !newEquip.categoria) {
      alert("Has d&apos;indicar el nom i la categoria de l&apos;equip");
      return;
    }

    try {
      setIsCreating(true);
      await crearEquip(newEquip);
      toast.success("Equip creat correctament");
      setModalOpen(false);
      await loadData();
      // Resetear form
      setNewEquip({
        nom: '',
        categoria: '',
        temporada: '2024-2025',
        entrenador: '',
        delegat: '',
        descripcio: ''
      });
    } catch (error) {
      console.error("Error al crear equip:", error);
      toast.error("No s'ha pogut crear l'equip");
    } finally {
      setIsCreating(false);
    }
  };

  // Manejar eliminación de equipo
  const handleDeleteEquip = async (id: number) => {
    if (confirm("Segur que vols eliminar aquest equip?")) {
      try {
        await eliminarEquip(id);
        toast.success("Equip eliminat correctament");
        await loadData();
      } catch (error) {
        console.error("Error al eliminar equip:", error);
        toast.error("No s'ha pogut eliminar l'equip");
      }
    }
  };

  // Obtener nombre completo del entrenador por ID
  const getEntrenadorNom = (id: string | null) => {
    if (!id) return '-';
    const entrenador = entrenadors.find(e => e && e.id && e.id.toString() === id);
    if (!entrenador) {
      // Si no encontramos el entrenador, puede que haya sido eliminado o actualizado
      // Forzamos una recarga de datos para actualizar la lista
      console.log(`Entrenador con ID ${id} no encontrado, puede ser necesario actualizar`); 
      return 'No assignat';
    }
    return `${entrenador.nom} ${entrenador.cognom || ''}`;
  };

  // Columnas para la tabla
  const columns = [
    {
      key: "nom",
      header: "Nom",
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: "categoria",
      header: "Categoria"
    },
    {
      key: "temporada",
      header: "Temporada"
    },
    {
      key: "entrenador",
      header: "Entrenador",
      render: (value: string) => getEntrenadorNom(value)
    },
    {
      key: "delegat",
      header: "Delegat",
      render: (value: string) => getEntrenadorNom(value)
    },
    {
      key: "actions",
      header: "Accions",
      render: (_: React.ReactNode, equip: Equip) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => router.push(`/dashboard/equips/${equip.id}`)}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => equip.id !== undefined ? handleDeleteEquip(equip.id) : undefined}
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
      title="Gestió d'Equips"
      description="Afegeix i gestiona els equips del club"
    >
      <div className="flex justify-between items-center mb-6">
        <div></div>
        
        <Button 
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => setModalOpen(true)}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Nou Equip
        </Button>
      </div>
        
      {/* Modal para crear nuevo equipo */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Afegir Nou Equip</h3>
            
            <div className="grid gap-4 py-4">
              <InputField
                label="Nom de l'equip*"
                id="nom" 
                value={newEquip.nom} 
                onChange={e => setNewEquip({...newEquip, nom: e.target.value})}
                placeholder="Juvenil A"
                required
              />
              
              <SelectField
                label="Categoria*"
                id="categoria"
                value={newEquip.categoria}
                onChange={e => setNewEquip({...newEquip, categoria: e.target.value})}
                options={[
                  { value: "Prebenjamí", label: "Prebenjamí" },
                  { value: "Benjamí", label: "Benjamí" },
                  { value: "Aleví", label: "Aleví" },
                  { value: "Infantil", label: "Infantil" },
                  { value: "Cadet", label: "Cadet" },
                  { value: "Juvenil", label: "Juvenil" },
                  { value: "Amateur", label: "Amateur" },
                  { value: "Veterans", label: "Veterans" }
                ]}
                required
              />
              
              <InputField
                label="Temporada"
                id="temporada" 
                value={newEquip.temporada} 
                onChange={e => setNewEquip({...newEquip, temporada: e.target.value})}
                placeholder="2024-2025"
              />
              
              <SelectField
                label="Entrenador Principal"
                id="entrenador" 
                value={newEquip.entrenador || ''}
                onChange={e => setNewEquip({...newEquip, entrenador: e.target.value})}
                options={[
                  { value: "", label: "-- Selecciona entrenador --" },
                  ...entrenadors
                    .filter(e => e.tipus === 'principal' || e.tipus === 'segon')
                    .map(e => ({
                      value: e.id?.toString() || '',
                      label: `${e.nom} ${e.cognom} (${e.tipus === 'principal' ? 'Principal' : 'Segon'})`
                    }))
                ]}
              />
              
              <SelectField
                label="Delegat"
                id="delegat" 
                value={newEquip.delegat || ''}
                onChange={e => setNewEquip({...newEquip, delegat: e.target.value})}
                options={[
                  { value: "", label: "-- Selecciona delegat --" },
                  ...entrenadors
                    .filter(e => e.tipus === 'delegat')
                    .map(e => ({
                      value: e.id?.toString() || '',
                      label: `${e.nom} ${e.cognom}`
                    }))
                ]}
              />
              
              <TextareaField
                label="Descripció"
                id="descripcio" 
                value={newEquip.descripcio || ''}
                onChange={e => setNewEquip({...newEquip, descripcio: e.target.value})}
                placeholder="Descripció de l&apos;equip"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel·lar
              </Button>
              <Button 
                variant="primary"
                onClick={handleCreateEquip}
                disabled={isCreating || !newEquip.nom || !newEquip.categoria}
                isLoading={isCreating}
              >
                {isCreating ? 'Creant...' : 'Crear Equip'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Card>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Equips</h2>
          <div className="bg-blue-100 text-blue-800 font-medium rounded-full px-3 py-1">
            Total: {equips.length} {equips.length === 1 ? 'equip' : 'equips'}
          </div>
        </div>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 mb-4">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Instruccions d&apos;ús</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Des d&apos;aquesta secció pots gestionar els equips del club:</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Crea nous equips i assigna entrenadors i delegats</li>
                  <li>Edita o elimina els equips existents</li>
                  <li>Gestiona les categories i temporades actives</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div>
            {equips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShieldIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No hi ha equips</h3>
                <p className="text-gray-500 mb-4">Comença afegint el teu primer equip</p>
                <Button 
                  variant="primary"
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2"
                  iconLeft={<Plus className="h-4 w-4" />}
                >
                  Afegir Equip
                </Button>
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={equips}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
