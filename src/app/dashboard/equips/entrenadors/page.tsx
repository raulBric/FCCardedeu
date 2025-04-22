"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  UserCog,
  Loader2, 
  AlertTriangle 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, DataTable, InputField, TextareaField, SelectField } from "@/components/dashboard/FormComponents";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Card from "@/components/dashboard/Card";
import { Entrenador, obtenerEntrenadors, crearEntrenador, eliminarEntrenador } from "@/services/entrenadorService";

export default function EntrenadorsPage() {
  const router = useRouter();
  const [entrenadors, setEntrenadors] = useState<Entrenador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [newEntrenador, setNewEntrenador] = useState<Omit<Entrenador, 'id' | 'created_at' | 'updated_at'>>({
    nom: '',
    cognom: '',
    tipus: 'principal',
    telefon: '',
    email: '',
    titulacio: '',
    observacions: ''
  });

  // Cargar entrenadores
  const loadEntrenadors = async () => {
    try {
      setIsLoading(true);
      const data = await obtenerEntrenadors();
      setEntrenadors(data);
    } catch (error) {
      console.error("Error al cargar entrenadors:", error);
      alert("No s&apos;han pogut carregar els entrenadors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntrenadors();
  }, []);

  // Manejar creación de entrenador
  const handleCreateEntrenador = async () => {
    if (!newEntrenador.nom || !newEntrenador.cognom || !newEntrenador.tipus) {
      alert("Has d&apos;indicar el nom, cognom i tipus d&apos;entrenador");
      return;
    }

    try {
      setIsCreating(true);
      await crearEntrenador(newEntrenador);
      alert("Entrenador creat correctament");
      setModalOpen(false);
      await loadEntrenadors();
      // Resetear form
      setNewEntrenador({
        nom: '',
        cognom: '',
        tipus: 'principal',
        telefon: '',
        email: '',
        titulacio: '',
        observacions: ''
      });
    } catch (error) {
      console.error("Error al crear entrenador:", error);
      alert("No s&apos;ha pogut crear l&apos;entrenador");
    } finally {
      setIsCreating(false);
    }
  };

  // Manejar eliminación de entrenador
  const handleDeleteEntrenador = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await eliminarEntrenador(deleteId);
      alert("Entrenador eliminat correctament");
      await loadEntrenadors();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error al eliminar entrenador:", error);
      alert("No s&apos;ha pogut eliminar l&apos;entrenador");
    }
  };

  // Columnas para la tabla
  const columns = [
    {
      key: "nom_complet",
      header: "Nom",
      render: (_: React.ReactNode, entrenador: Entrenador) => (
        <div>
          <p className="font-medium">{`${entrenador.nom} ${entrenador.cognom}`}</p>
          <p className="text-xs text-gray-500">
            {entrenador.titulacio && `${entrenador.titulacio}`}
          </p>
        </div>
      )
    },
    {
      key: "tipus",
      header: "Tipus",
      render: (value: string) => {
        const typeLabels = {
          'principal': 'Entrenador principal',
          'segon': 'Segon entrenador',
          'tercer': 'Tercer entrenador',
          'delegat': 'Delegat'
        };
        return <span>{typeLabels[value as keyof typeof typeLabels] || value}</span>;
      }
    },
    {
      key: "contacte",
      header: "Contacte",
      render: (_: React.ReactNode, entrenador: Entrenador) => (
        <div>
          {entrenador.telefon && <p className="text-sm">{entrenador.telefon}</p>}
          {entrenador.email && <p className="text-sm text-gray-500">{entrenador.email}</p>}
        </div>
      )
    },
    {
      key: "actions",
      header: "Accions",
      render: (_: React.ReactNode, entrenador: Entrenador) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => router.push(`/dashboard/equips/entrenadors/${entrenador.id || 0}`)}
            iconLeft={<Pencil className="h-4 w-4" />}
          >
            Editar
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => entrenador.id !== undefined ? handleDeleteEntrenador(entrenador.id) : null}
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
      title="Gestió d'Entrenadors"
      description="Afegeix i gestiona els entrenadors i delegats del club"
    >
      <div className="flex justify-between items-center mb-6">
        <div></div>
        
        <Button 
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => setModalOpen(true)}
          iconLeft={<Plus className="h-4 w-4" />}
        >
          Nou Entrenador
        </Button>
      </div>
      
      {/* Modal para crear nuevo entrenador */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Afegir Nou Entrenador</h3>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nom*"
                  id="nom" 
                  value={newEntrenador.nom} 
                  onChange={e => setNewEntrenador({...newEntrenador, nom: e.target.value})}
                  placeholder="Joan"
                  required
                />
                
                <InputField
                  label="Cognom*"
                  id="cognom" 
                  value={newEntrenador.cognom} 
                  onChange={e => setNewEntrenador({...newEntrenador, cognom: e.target.value})}
                  placeholder="García"
                  required
                />
              </div>
              
              <SelectField
                label="Tipus*"
                id="tipus"
                value={newEntrenador.tipus}
                onChange={e => setNewEntrenador({...newEntrenador, tipus: e.target.value as 'principal' | 'segon' | 'tercer' | 'delegat'})}
                options={[
                  { value: "principal", label: "Entrenador principal" },
                  { value: "segon", label: "Segon entrenador" },
                  { value: "tercer", label: "Tercer entrenador" },
                  { value: "delegat", label: "Delegat" }
                ]}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Telèfon"
                  id="telefon" 
                  value={newEntrenador.telefon || ''}
                  onChange={e => setNewEntrenador({...newEntrenador, telefon: e.target.value})}
                  placeholder="123456789"
                />
                
                <InputField
                  label="Email"
                  id="email" 
                  type="email"
                  value={newEntrenador.email || ''}
                  onChange={e => setNewEntrenador({...newEntrenador, email: e.target.value})}
                  placeholder="entrenador@example.com"
                />
              </div>
              
              <InputField
                label="Titulació"
                id="titulacio" 
                value={newEntrenador.titulacio || ''}
                onChange={e => setNewEntrenador({...newEntrenador, titulacio: e.target.value})}
                placeholder="Nivell 1, Nivell 2, etc."
              />
              
              <TextareaField
                label="Observacions"
                id="observacions" 
                value={newEntrenador.observacions || ''}
                onChange={e => setNewEntrenador({...newEntrenador, observacions: e.target.value})}
                placeholder="Observacions addicionals"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel·lar
              </Button>
              <Button 
                variant="primary"
                onClick={handleCreateEntrenador}
                disabled={isCreating || !newEntrenador.nom || !newEntrenador.cognom}
                isLoading={isCreating}
              >
                {isCreating ? 'Creant...' : 'Crear Entrenador'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminació</h3>
            <p className="text-gray-600 mb-4">
              Estàs segur que vols eliminar aquest entrenador? Aquesta acció no es pot desfer.
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
      
      <Card>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 mb-4">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Instruccions d&apos;ús</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Des d&apos;aquesta secció pots gestionar els entrenadors i delegats del club:</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Crea nous entrenadors indicant el seu tipus (principal, segon, tercer o delegat)</li>
                  <li>Edita o elimina entrenadors existents</li>
                  <li>Els entrenadors creats aquí es podran assignar als equips</li>
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
            {entrenadors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <UserCog className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No hi ha entrenadors</h3>
                <p className="text-gray-500 mb-4">Comença afegint el teu primer entrenador</p>
                <Button 
                  variant="primary"
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2"
                  iconLeft={<Plus className="h-4 w-4" />}
                >
                  Afegir Entrenador
                </Button>
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={entrenadors}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
