"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Shield, Users, Plus, UserRound, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea as TextareaUI } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";
import { toast } from "sonner";
// Usar los adaptadores en lugar de los servicios directos
import { 
  Equip,
  actualizarEquip,
  obtenerEquip,
  Jugador,
  JugadorEquip, 
  obtenerJugadoresEquip, 
  asignarJugadorAEquip, 
  actualizarJugadorEquip, 
  eliminarJugadorDeEquip, 
  obtenerJugadoresDisponibles 
} from "@/adapters/ServiceAdapters";

type Props = {
  params: { id: string }
};

export default function EquipDetail({ params }: Props) {
  const router = useRouter();
  const [equip, setEquip] = useState<Equip | null>(null);
  const [jugadoresEquip, setJugadoresEquip] = useState<JugadorEquip[]>([]);
  const [jugadoresDisponibles, setJugadoresDisponibles] = useState<Jugador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingJugadores, setIsLoadingJugadores] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingJugador, setIsAddingJugador] = useState(false);
  const [showAddJugadorModal, setShowAddJugadorModal] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState("");
  const [jugadorDorsal, setJugadorDorsal] = useState("");
  const [jugadorPosicion, setJugadorPosicion] = useState("");
  const [editingJugador, setEditingJugador] = useState<number | null>(null);
  const [editDorsal, setEditDorsal] = useState("");
  const [editPosicion, setEditPosicion] = useState("");

  // Cargar detalles del equipo y sus jugadores
  useEffect(() => {
    const equipId = parseInt(params.id, 10);
    
    const loadEquip = async () => {
      try {
        setIsLoading(true);
        const data = await obtenerEquip(equipId);
        setEquip(data);
      } catch (error) {
        console.error("Error al cargar equip:", error);
        toast.error("No s&apos;ha pogut carregar l&apos;equip");
        router.push("/dashboard/equips");
      } finally {
        setIsLoading(false);
      }
    };

    const loadJugadores = async () => {
      try {
        setIsLoadingJugadores(true);
        // Cargar jugadores asignados a este equipo
        const jugadores = await obtenerJugadoresEquip(equipId, "2024-2025");
        setJugadoresEquip(jugadores);
        
        // Cargar jugadores disponibles para asignar
        // Usamos el equipo actual para obtener la categoría
const equipoActual = await obtenerEquip(equipId);
const disponibles = await obtenerJugadoresDisponibles(
  equipoActual?.categoria || "", 
  "2024-2025", 
  equipId
);
        setJugadoresDisponibles(disponibles);
      } catch (error) {
        console.error("Error al cargar jugadores:", error);
        toast.error("No s&apos;han pogut carregar els jugadors");
      } finally {
        setIsLoadingJugadores(false);
      }
    };
    
    loadEquip();
    loadJugadores();
  }, [params.id, router]);

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEquip(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!equip || !equip.nom || !equip.categoria) {
      toast.error("Has d&apos;indicar el nom i la categoria de l&apos;equip");
      return;
    }

    try {
      setIsSaving(true);
      await actualizarEquip(equip.id || 0, {
        nom: equip.nom,
        categoria: equip.categoria,
        temporada: equip.temporada,
        entrenador: equip.entrenador,
        delegat: equip.delegat,
        descripcio: equip.descripcio
      });
      toast.success("Equip actualitzat correctament");
    } catch (error) {
      console.error("Error al actualitzar equip:", error);
      toast.error("No s&apos;ha pogut actualitzar l&apos;equip");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  if (!equip) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Shield className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">Equip no trobat</h3>
          <p className="text-gray-500 mb-4">L&apos;equip que busques no existeix</p>
          <Button 
            onClick={() => router.push("/dashboard/equips")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Tornar
          </Button>
        </div>
      </div>
    );
  }

  // Añadir jugador al equipo
  const handleAddJugador = async () => {
    if (!jugadorSeleccionado) {
      toast.error("Has de seleccionar un jugador");
      return;
    }
    
    try {
      setIsAddingJugador(true);
      const equipId = parseInt(params.id, 10);
      const jugadorId = parseInt(jugadorSeleccionado, 10);
      
      // Crear asignación
      await asignarJugadorAEquip(
        jugadorId, 
        equipId, 
        jugadorDorsal, 
        jugadorPosicion, 
        "2024-2025"
      );
      
      // Actualizar listas
      const jugadores = await obtenerJugadoresEquip(equipId, "2024-2025");
      setJugadoresEquip(jugadores);
      
      // Usamos el equipo actual para obtener la categoría
const equipoActual = await obtenerEquip(equipId);
const disponibles = await obtenerJugadoresDisponibles(
  equipoActual?.categoria || "", 
  "2024-2025", 
  equipId
);
      setJugadoresDisponibles(disponibles);
      
      // Cerrar modal
      setShowAddJugadorModal(false);
      toast.success("Jugador afegit correctament");
      
      // Reset form
      setJugadorSeleccionado("");
      setJugadorDorsal("");
      setJugadorPosicion("");
    } catch (error) {
      console.error("Error al afegir jugador:", error);
      toast.error("No s&apos;ha pogut afegir el jugador a l&apos;equip");
    } finally {
      setIsAddingJugador(false);
    }
  };
  
  // Guardar cambios en un jugador (dorsal, posición)
  const handleSaveJugadorChanges = async (jugadorEquipId: number) => {
    try {
      if (!jugadorEquipId) {
        throw new Error("jugadorEquipId es requerido");
      }
      await actualizarJugadorEquip(jugadorEquipId, {
        dorsal: editDorsal,
        rol: editPosicion
      });
      
      // Actualizar lista local
      setJugadoresEquip(jugadoresEquip.map(je => 
        je.id === jugadorEquipId ? {
          ...je,
          dorsal: editDorsal,
          posicio: editPosicion
        } : je
      ));
      
      // Resetear modo edición
      setEditingJugador(jugadorEquipId || null);
      toast.success("Dades actualitzades");
    } catch (error) {
      console.error("Error al actualitzar jugador:", error);
      toast.error("No s&apos;han pogut guardar els canvis");
    }
  };
  
  // Empezar a editar un jugador
  const startEditingJugador = (jugadorEquip: JugadorEquip) => {
    setEditingJugador(jugadorEquip.id || null);
    setEditDorsal(jugadorEquip.dorsal || "");
    setEditPosicion(jugadorEquip.rol || "");
  };
  
  // Manejadores de eventos tipados
  const handleDorsalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJugadorDorsal(e.target.value);
  };
  
  const handleEditDorsalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditDorsal(e.target.value);
  };
  
  const handleEditPosicionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditPosicion(e.target.value);
  };
  
  // Eliminar jugador del equipo
  const handleRemoveJugador = async (jugadorEquipId: number) => {
    if (confirm("Estàs segur que vols eliminar aquest jugador de l&apos;equip?")) {
      try {
        await eliminarJugadorDeEquip(jugadorEquipId);
        
        // Actualizar listas
        const equipId = parseInt(params.id, 10);
        setJugadoresEquip(jugadoresEquip.filter(je => je.id !== jugadorEquipId));
        
        // Usamos el equipo actual para obtener la categoría
const equipoActual = await obtenerEquip(equipId);
const disponibles = await obtenerJugadoresDisponibles(
  equipoActual?.categoria || "", 
  "2024-2025", 
  equipId
);
        setJugadoresDisponibles(disponibles);
        
        toast.success("Jugador eliminat de l&apos;equip");
      } catch (error) {
        console.error("Error al eliminar jugador:", error);
        toast.error("No s&apos;ha pogut eliminar el jugador");
      }
    }
  };

  return (
    <div className="container mx-auto py-6">

      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/dashboard/equips")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Tornar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos básicos del equipo */}
        <div className="lg:col-span-1">  
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dades de l&apos;equip</h2>
            <div className="grid gap-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <Label htmlFor="nom">Nom de l&apos;equip*</Label>
                  <Input 
                    type="text"
                    id="nom" 
                    name="nom"
                    value={equip?.nom || ""} 
                    onChange={handleInputChange}
                    placeholder="Juvenil A"
                    required
                  />
                </FormItem>
                
                <FormItem>
                  <Label htmlFor="categoria">Categoria*</Label>
                  <Select 
                    value={equip?.categoria || ""}
                    onValueChange={(value) => setEquip(prev => prev ? ({ ...prev, categoria: value }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prebenjamí">Prebenjamí</SelectItem>
                      <SelectItem value="Benjamí">Benjamí</SelectItem>
                      <SelectItem value="Aleví">Aleví</SelectItem>
                      <SelectItem value="Infantil">Infantil</SelectItem>
                      <SelectItem value="Cadet">Cadet</SelectItem>
                      <SelectItem value="Juvenil">Juvenil</SelectItem>
                      <SelectItem value="Amateur">Amateur</SelectItem>
                      <SelectItem value="Veterans">Veterans</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormItem>
                  <Label htmlFor="temporada">Temporada</Label>
                  <Input 
                    type="text"
                    id="temporada" 
                    name="temporada"
                    value={equip?.temporada || ""} 
                    onChange={handleInputChange}
                    placeholder="2024-2025"
                  />
                </FormItem>
                
                <FormItem>
                  <Label htmlFor="entrenador">Entrenador</Label>
                  <Input 
                    type="text"
                    id="entrenador" 
                    name="entrenador"
                    value={equip?.entrenador || ''}
                    onChange={handleInputChange}
                    placeholder="Nom de l'entrenador"
                  />
                </FormItem>
                
                <FormItem>
                  <Label htmlFor="delegat">Delegat</Label>
                  <Input 
                    type="text"
                    id="delegat" 
                    name="delegat"
                    value={equip?.delegat || ''}
                    onChange={handleInputChange}
                    placeholder="Nom del delegat"
                  />
                </FormItem>
              </div>

              <FormItem>
                <Label htmlFor="descripcio">Descripció</Label>
                <TextareaUI 
                  id="descripcio" 
                  name="descripcio"
                  value={equip?.descripcio || ''}
                  onChange={handleInputChange}
                  placeholder="Descripció de l'equip"
                />
              </FormItem>

              {/* Aquí se podría añadir la carga de imagen para el equipo en el futuro */}
            </div>
            
            <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={() => router.push("/dashboard/equips")}
          >
            Cancel·lar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !equip.nom || !equip.categoria}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Desant...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Desar Canvis
              </>
            )}
          </Button>
        </div>
      </div>
      </div>
      
      {/* Panel de jugadores del equipo */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Plantilla de l&apos;equip</h2>
            <Button 
              onClick={() => setShowAddJugadorModal(true)}
              disabled={jugadoresDisponibles.length === 0}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Afegir Jugador
            </Button>
          </div>
          
          {isLoadingJugadores ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : jugadoresEquip.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No hi ha jugadors a l&apos;equip</h3>
              <p className="text-gray-500 mb-4 max-w-md">Comença a afegir jugadors a l&apos;equip utilitzant el botó &apos;Afegir Jugador&apos;</p>
              <Button 
                onClick={() => setShowAddJugadorModal(true)}
                disabled={jugadoresDisponibles.length === 0}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Afegir Jugador
              </Button>
              
              {jugadoresDisponibles.length === 0 && (
                <p className="text-amber-600 mt-4 text-sm">
                  No hi ha jugadors disponibles. Afegeix nous jugadors des de la secció d&apos;inscripcions
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jugador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posició</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dorsal</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Accions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jugadoresEquip.map((je) => (
                    <tr key={je.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserRound className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {je.jugador?.nom} {je.jugador?.cognoms}
                            </div>
                            <div className="text-sm text-gray-500">
                              {je.jugador?.categoria || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingJugador === je.id ? (
                          <Input 
                            value={editPosicion} 
                            onChange={handleEditPosicionChange} 
                            className="w-32"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{je.rol || '-'}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingJugador === je.id ? (
                          <Input 
                            value={editDorsal} 
                            onChange={handleEditDorsalChange} 
                            className="w-20"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{je.dorsal || '-'}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {editingJugador === je.id ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => je.id !== undefined ? handleSaveJugadorChanges(je.id) : null}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setEditingJugador(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => startEditingJugador(je)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => je.id !== undefined ? handleRemoveJugador(je.id) : null}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div> {/* cierre grid */}
      
      {/* Modal para añadir jugador */}
      {showAddJugadorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Afegir Jugador a l&apos;Equip</h2>
            
            <div className="space-y-4 mb-6">
              <FormItem>
                <Label htmlFor="jugador">Jugador</Label>
                <Select
                  value={jugadorSeleccionado}
                  onValueChange={setJugadorSeleccionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Selecciona jugador --" />
                  </SelectTrigger>
                  <SelectContent>
                    {jugadoresDisponibles.map((jugador) => (
                      <SelectItem key={jugador.id || 0} value={(jugador.id || 0).toString()}>
                        {jugador.nom} {jugador.cognoms}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
              
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <Label htmlFor="dorsal">Dorsal</Label>
                  <Input
                    id="dorsal"
                    value={jugadorDorsal}
                    onChange={handleDorsalChange}
                    placeholder="Número"
                  />
                </FormItem>
                
                <FormItem>
                  <Label htmlFor="posicio">Posició</Label>
                  <Select
                    value={jugadorPosicion}
                    onValueChange={setJugadorPosicion}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Selecciona --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Porter">Porter</SelectItem>
                      <SelectItem value="Defensa">Defensa</SelectItem>
                      <SelectItem value="Mig">Mig</SelectItem>
                      <SelectItem value="Davanter">Davanter</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddJugadorModal(false)}
              >
                Cancel·lar
              </Button>
              <Button
                onClick={handleAddJugador}
                disabled={isAddingJugador || !jugadorSeleccionado}
                className="flex items-center gap-2"
              >
                {isAddingJugador ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Afegint...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Afegir Jugador
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
