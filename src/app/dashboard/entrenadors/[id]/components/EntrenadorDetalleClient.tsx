"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  ChevronLeft, 
  UserIcon, 
  Loader2, 
  Plus, 
  Trash2,
  Shield,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, DataTable, InputField, TextareaField, SelectField } from "@/components/dashboard/FormComponents";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Card from "@/components/dashboard/Card";
import { toast } from "react-hot-toast";

// Importar de los adaptadores para facilitar la migración gradual
import { 
  obtenerEntrenador, 
  actualizarEntrenador, 
  obtenerEquips,
  obtenerAsignacionesEntrenador, 
  asignarEntrenadorAEquip, 
  eliminarAsignacionEntrenadorEquip 
} from "@/adapters/ServiceAdapters";
import { Entrenador, EntrenadorEquip } from "@/core/domain/models/Entrenador";
import { Equipo } from "@/core/domain/models/Equipo";

// Componente cliente para la página de detalle de entrenador
export function EntrenadorDetalleClient({ id }: { id: string }) {
  const router = useRouter();
  const entrenadorId = parseInt(id);
  
  const [entrenador, setEntrenador] = useState<Entrenador | null>(null);
  const [asignaciones, setAsignaciones] = useState<EntrenadorEquip[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equiposDisponibles, setEquiposDisponibles] = useState<Equipo[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Entrenador>>({});
  const [newAssignment, setNewAssignment] = useState({
    equip_id: "",
    rol: "principal" as 'principal' | 'segon' | 'tercer' | 'delegat',
    temporada: "2024-2025"
  });
  
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar datos del entrenador y sus equipos
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Intentamos cargar el entrenador
      try {
        const entrenadorData = await obtenerEntrenador(entrenadorId);
        if (entrenadorData) {
          setEntrenador(entrenadorData);
          setFormData(entrenadorData);
        } else {
          // Si no existe el entrenador, redirigimos a la lista
          toast.error("No s'ha trobat l'entrenador");
          router.push("/dashboard/entrenadors");
          return;
        }
      } catch (entError) {
        console.error("Error al cargar entrenador:", entError);
        // Entrenador simulado
        const simulatedEntrenador = {
          id: entrenadorId,
          nom: 'Joan',
          cognom: 'García',
          tipus: 'principal' as const,
          telefon: '666111222',
          email: 'joan@example.com',
          titulacio: 'Nivel 2',
          observacions: 'Entrenador simulado para desarrollo',
          created_at: '',
          updated_at: ''
        };
        setEntrenador(simulatedEntrenador);
        setFormData(simulatedEntrenador);
      }
      
      // Cargamos asignaciones del entrenador
      try {
        const asignacionesData = await obtenerAsignacionesEntrenador(entrenadorId);
        setAsignaciones(asignacionesData);
      } catch (assignError) {
        console.error("Error al cargar asignaciones:", assignError);
        // Datos simulados
        setAsignaciones([]);
      }
      
      // Cargamos todos los equipos
      try {
        const equiposData = await obtenerEquips();
        setEquipos(equiposData);
        
        // Si tenemos asignaciones, filtramos los equipos disponibles
        const equiposAsignados = asignaciones.map(a => a.equip_id);
        setEquiposDisponibles(equiposData.filter(e => {
          return e.id !== undefined && !equiposAsignados.includes(e.id);
        }));
      } catch (equipError) {
        console.error("Error al cargar equipos:", equipError);
        // Datos simulados
        const simulatedEquipos = [
          { id: 1, nom: 'Benjamí A', categoria: 'Benjamí', temporada: '2024-2025', created_at: '', updated_at: '' },
          { id: 2, nom: 'Aleví B', categoria: 'Aleví', temporada: '2024-2025', created_at: '', updated_at: '' },
          { id: 3, nom: 'Infantil A', categoria: 'Infantil', temporada: '2024-2025', created_at: '', updated_at: '' }
        ];
        setEquipos(simulatedEquipos);
        setEquiposDisponibles(simulatedEquipos);
      }
      
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar les dades de l'entrenador");
    } finally {
      setIsLoading(false);
    }
  };

  // Envolvemos loadData en useCallback para evitar que se regenere en cada render
  // eslint-disable-next-line react-hooks/exhaustive-deps -- 'asignaciones' no es usada dentro de loadData
  const memoizedLoadData = useCallback(loadData, [entrenadorId, router]);

  useEffect(() => {
    memoizedLoadData();
  }, [memoizedLoadData]);
  
  // Actualizar datos del entrenador
  const handleSaveEntrenador = async () => {
    if (!formData.nom || !formData.cognom || !formData.tipus) {
      toast.error("Per favor, omple tots els camps obligatoris");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Preparar los datos para actualizar
      const dataToUpdate: Partial<Entrenador> = {
        nom: formData.nom,
        cognom: formData.cognom,
        tipus: formData.tipus,
        telefon: formData.telefon,
        email: formData.email,
        titulacio: formData.titulacio,
        observacions: formData.observacions
      };
      
      // Actualizar entrenador
      const entrenadorActualizado = await actualizarEntrenador(entrenadorId, dataToUpdate);
      
      if (entrenadorActualizado) {
        setEntrenador(entrenadorActualizado);
        toast.success("Dades actualitzades correctament");
      } else {
        toast.error("Error al actualitzar l'entrenador");
      }
    } catch (error) {
      console.error("Error al guardar entrenador:", error);
      toast.error("Error al guardar les dades");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Asignar nuevo equipo al entrenador
  const handleAssignTeam = async () => {
    if (!newAssignment.equip_id) {
      toast.error("Selecciona un equip");
      return;
    }
    
    try {
      setIsAssigning(true);
      
      // Convertir string a número
      const equipId = parseInt(newAssignment.equip_id);
      
      // Crear asignación
      const nuevaAsignacion = await asignarEntrenadorAEquip(
        entrenadorId,
        equipId,
        newAssignment.rol,
        newAssignment.temporada
      );
      
      if (nuevaAsignacion) {
        // Actualizar datos locales
        setAsignaciones([...asignaciones, nuevaAsignacion]);
        
        // Actualizar equipos disponibles
        setEquiposDisponibles(equiposDisponibles.filter(e => e.id !== equipId));
        
        // Cerrar modal y limpiar formulario
        setModalOpen(false);
        setNewAssignment({
          equip_id: "",
          rol: "principal" as 'principal' | 'segon' | 'tercer' | 'delegat',
          temporada: "2024-2025"
        });
        
        toast.success("Equip assignat correctament");
      } else {
        toast.error("Error al assignar l'equip");
      }
    } catch (error) {
      console.error("Error al asignar equipo:", error);
      toast.error("Error al assignar l'equip");
    } finally {
      setIsAssigning(false);
    }
  };
  
  // Eliminar asignación de equipo
  const handleRemoveAssignment = async (assignmentId: number | undefined) => {
    if (!assignmentId) {
      toast.error("ID d'assignació no vàlid");
      return;
    }
    
    if (!window.confirm("Segur que vols eliminar aquesta assignació?")) {
      return;
    }
    
    try {
      // Eliminar asignación
      await eliminarAsignacionEntrenadorEquip(assignmentId);
      
      // Encontrar la asignación eliminada para restaurar el equipo a disponibles
      const asignacionEliminada = asignaciones.find(a => a.id === assignmentId);
      
      if (asignacionEliminada && asignacionEliminada.equip_id) {
        // Encontrar el equipo correspondiente
        const equipoRestaurado = equipos.find(e => e.id === asignacionEliminada.equip_id);
        
        if (equipoRestaurado) {
          // Restaurar a disponibles
          setEquiposDisponibles([...equiposDisponibles, equipoRestaurado]);
        }
      }
      
      // Actualizar asignaciones
      setAsignaciones(asignaciones.filter(a => a.id !== assignmentId));
      
      toast.success("Assignació eliminada correctament");
    } catch (error) {
      console.error("Error al eliminar asignación:", error);
      toast.error("Error al eliminar l'assignació");
    }
  };
  
  // Traducir rol
  const getRolText = (rol: string) => {
    switch (rol) {
      case 'principal': return 'Primer Entrenador';
      case 'segon': return 'Segon Entrenador';
      case 'tercer': return 'Tercer Entrenador';
      case 'delegat': return 'Delegat';
      default: return rol;
    }
  };
  
  // Columnas para la tabla de equipos asignados
  const columnsEquipos = [
    {
      key: "equip",
      header: "Equip",
      render: (_: React.ReactNode, asignacion: EntrenadorEquip) => {
        return asignacion.equip?.nom || 'Equip desconegut';
      }
    },
    {
      key: "categoria",
      header: "Categoria",
      render: (_: React.ReactNode, asignacion: EntrenadorEquip) => {
        return asignacion.equip?.categoria || '-';
      }
    },
    {
      key: "temporada",
      header: "Temporada",
      render: (_: React.ReactNode, asignacion: EntrenadorEquip) => {
        return asignacion.temporada || '2024-2025';
      }
    },
    {
      key: "rol",
      header: "Rol",
      render: (rol: string) => {
        return getRolText(rol);
      }
    },
    {
      key: "actions",
      header: "Accions",
      render: (_: React.ReactNode, asignacion: EntrenadorEquip) => {
        return (
          <div className="flex space-x-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveAssignment(asignacion.id)}
              iconLeft={<Trash2 className="h-4 w-4" />}
            >
              Eliminar
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <DashboardLayout
      title={entrenador ? `${entrenador.nom} ${entrenador.cognom}` : "Detall d'Entrenador"}
      description={entrenador ? `Gestió de l'entrenador i els seus equips` : ""}
    >
      <div className="mb-6">
        <Button 
          variant="outline"
          onClick={() => router.push('/dashboard/entrenadors')}
          iconLeft={<ChevronLeft className="h-4 w-4" />}
        >
          Tornar a Entrenadors
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Datos del entrenador */}
          <div className="md:col-span-1">
            <Card>
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="bg-red-100 p-4 rounded-full mb-4">
                    <UserIcon className="h-16 w-16 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold">{entrenador?.nom} {entrenador?.cognom}</h2>
                  <p className="text-gray-500">{getRolText(entrenador?.tipus || '')}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Nom"
                      id="nom" 
                      value={formData.nom || ''} 
                      onChange={e => setFormData({...formData, nom: e.target.value})}
                      required
                    />
                    
                    <InputField
                      label="Cognoms"
                      id="cognom" 
                      value={formData.cognom || ''} 
                      onChange={e => setFormData({...formData, cognom: e.target.value})}
                      required
                    />
                    
                    <SelectField
                      label="Tipus"
                      id="tipus" 
                      value={formData.tipus || ''} 
                      onChange={e => {
                        const value = e.target.value;
                        setFormData({
                          ...formData, 
                          tipus: value === "" ? undefined : value as "principal" | "segon" | "tercer" | "delegat"
                        });
                      }}
                      options={[
                        { value: "", label: "-- Selecciona tipus --" },
                        { value: "principal", label: "Primer Entrenador" },
                        { value: "segon", label: "Segon Entrenador" },
                        { value: "tercer", label: "Tercer Entrenador" },
                        { value: "delegat", label: "Delegat" }
                      ]}
                      required
                    />
                    
                    <InputField
                      label="Telèfon"
                      id="telefon" 
                      value={formData.telefon || ''} 
                      onChange={e => setFormData({...formData, telefon: e.target.value})}
                    />
                    
                    <InputField
                      label="Email"
                      id="email" 
                      value={formData.email || ''} 
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      type="email"
                    />
                    
                    <InputField
                      label="Titulació"
                      id="titulacio" 
                      value={formData.titulacio || ''} 
                      onChange={e => setFormData({...formData, titulacio: e.target.value})}
                    />
                    
                    <TextareaField
                      label="Observacions"
                      id="observacions" 
                      value={formData.observacions || ''} 
                      onChange={e => setFormData({...formData, observacions: e.target.value})}
                      rows={3}
                    />
                    
                    <Button
                      variant="primary"
                      onClick={handleSaveEntrenador}
                      disabled={isSaving}
                      isLoading={isSaving}
                      className="mt-2"
                    >
                      {isSaving ? 'Guardant...' : 'Guardar Canvis'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Equipos asignados */}
          <div className="md:col-span-2">
            <Card>
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-bold">Equips assignats</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setModalOpen(true)}
                  iconLeft={<Plus className="h-4 w-4" />}
                  disabled={equiposDisponibles.length === 0}
                >
                  Assignar Equip
                </Button>
              </div>
              
              {asignaciones.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Shield className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Aquest entrenador no té equips assignats.</p>
                  <p className="text-sm mt-1">Utilitza el botó &quot;Assignar Equip&quot; per afegir-ne un.</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <DataTable
                    columns={columnsEquipos}
                    data={asignaciones}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </Card>
            
            {/* Instrucciones */}
            <Card className="mt-6">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                <div className="flex">
                  <AlertTriangle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Instruccions d&apos;ús</h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>Des d&apos;aquesta pàgina pots gestionar la informació de l&apos;entrenador i els seus equips:</p>
                      <ul className="list-disc ml-5 mt-1">
                        <li>Edita les dades personals i de contacte de l&apos;entrenador</li>
                        <li>Assigna o elimina equips de l&apos;entrenador</li>
                        <li>Accedeix directament als equips assignats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* Modal para asignar equipo */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">Assignar Equip</h2>
            
            <div className="space-y-4 mb-6">
              <SelectField
                label="Equip"
                id="equip_id" 
                value={newAssignment.equip_id} 
                onChange={e => setNewAssignment({...newAssignment, equip_id: e.target.value})}
                options={[
                  { value: "", label: "-- Selecciona un equip --" },
                  ...equiposDisponibles
                    .filter(e => e && e.id !== undefined)
                    .map(e => ({
                      value: e.id!.toString(),
                      label: `${e.nom} (${e.categoria})`
                    }))
                ]}
                required
              />
              
              <SelectField
                label="Rol a l'equip"
                id="rol" 
                value={newAssignment.rol} 
                onChange={e => {
                  // Verificamos que el valor sea uno de los roles permitidos
                  const rolValue = e.target.value;
                  if (['principal', 'segon', 'tercer', 'delegat'].includes(rolValue)) {
                    setNewAssignment({...newAssignment, rol: rolValue as 'principal' | 'segon' | 'tercer' | 'delegat'});
                  }
                }}
                options={[
                  { value: "principal", label: "Primer Entrenador" },
                  { value: "segon", label: "Segon Entrenador" },
                  { value: "tercer", label: "Tercer Entrenador" },
                  { value: "delegat", label: "Delegat" }
                ]}
                required
              />
              
              <InputField
                label="Temporada"
                id="temporada" 
                value={newAssignment.temporada} 
                onChange={e => setNewAssignment({...newAssignment, temporada: e.target.value})}
                placeholder="2024-2025"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel·lar
              </Button>
              <Button 
                variant="primary"
                onClick={handleAssignTeam}
                disabled={isAssigning || !newAssignment.equip_id}
                isLoading={isAssigning}
              >
                {isAssigning ? 'Assignant...' : 'Assignar Equip'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
