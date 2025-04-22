"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Upload, X, Camera, User, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
  Button, 
  Card, 
  InputField, 
  TextareaField, 
  SelectField, 
  CheckboxField, 
  FileUpload 
} from "@/components/dashboard/FormComponents";
import { 
  obtenerJugador,
  actualizarJugador, 
  subirArchivo, 
  Jugador 
} from "@/services/dashboardService";

export default function EditarJugadorPage() {
  const router = useRouter();
  const params = useParams();
  const jugadorId = parseInt(params.id as string);
  
  const [formData, setFormData] = useState<Omit<Jugador, 'id'>>({
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    posicion: '',
    dorsal: undefined,
    imagen_url: '',
    categoria: '',
    equipo: '',
    temporada: '',
    dni_nie: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    observaciones: '',
    activo: true
  });
  
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tabActiva, setTabActiva] = useState('personal');
  
  // Cargar datos del jugador
  useEffect(() => {
    async function loadJugador() {
      try {
        setIsLoading(true);
        const jugador = await obtenerJugador(jugadorId);
        
        if (jugador) {
          setFormData({
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            fecha_nacimiento: jugador.fecha_nacimiento,
            posicion: jugador.posicion,
            dorsal: jugador.dorsal,
            imagen_url: jugador.imagen_url || '',
            categoria: jugador.categoria,
            equipo: jugador.equipo,
            temporada: jugador.temporada,
            dni_nie: jugador.dni_nie,
            email: jugador.email || '',
            telefono: jugador.telefono || '',
            direccion: jugador.direccion || '',
            ciudad: jugador.ciudad || '',
            codigo_postal: jugador.codigo_postal || '',
            observaciones: jugador.observaciones || '',
            activo: jugador.activo
          });
          
          if (jugador.imagen_url) {
            setFotoPreview(jugador.imagen_url);
          }
        } else {
          router.push('/dashboard/jugadors');
        }
      } catch (error) {
        console.error('Error al obtener jugador:', error);
        router.push('/dashboard/jugadors');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (jugadorId) {
      loadJugador();
    }
  }, [jugadorId, router]);
  
  // Manejar cambios en los campos de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el campo se edita
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Manejar cambios en checkboxes
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Manejar subida de foto
  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Limpiar foto
  const handleClearFoto = () => {
    setFotoFile(null);
    setFotoPreview('');
    setFormData(prev => ({ ...prev, imagen_url: '' }));
  };
  
  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nom és obligatori";
    }
    
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Els cognoms són obligatoris";
    }
    
    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = "La data de naixement és obligatòria";
    }
    
    if (!formData.dni_nie.trim()) {
      newErrors.dni_nie = "El DNI/NIE és obligatori";
    }
    
    if (!formData.equipo) {
      newErrors.equipo = "L'equip és obligatori";
    }
    
    if (!formData.categoria) {
      newErrors.categoria = "La categoria és obligatòria";
    }
    
    if (!formData.temporada) {
      newErrors.temporada = "La temporada és obligatòria";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Guardar jugador
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Si hay una nueva foto, subirla primero
      let fotoUrl = formData.imagen_url;
      if (fotoFile) {
        const fileName = `${Date.now()}-${fotoFile.name}`;
        fotoUrl = await subirArchivo('jugadores', fileName, fotoFile);
      }
      
      // Actualizar jugador con la URL de la foto
      const jugadorActualizado = {
        ...formData,
        imagen_url: fotoUrl
      };
      
      await actualizarJugador(jugadorId, jugadorActualizado);
      
      // Redirigir a la lista de jugadores
      router.push('/dashboard/jugadors');
    } catch (error) {
      console.error('Error al actualizar jugador:', error);
      setErrors({
        form: 'Ha ocorregut un error al actualitzar el jugador. Intenta-ho de nou.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Opciones para los selectores
  const posiciones = [
    { value: 'Porter', label: 'Porter' },
    { value: 'Defensa', label: 'Defensa' },
    { value: 'Lateral', label: 'Lateral' },
    { value: 'Migcampista', label: 'Migcampista' },
    { value: 'Extrem', label: 'Extrem' },
    { value: 'Davanter', label: 'Davanter' }
  ];
  
  const equipos = [
    { value: 'Primer Equip', label: 'Primer Equip' },
    { value: 'Juvenil A', label: 'Juvenil A' },
    { value: 'Juvenil B', label: 'Juvenil B' },
    { value: 'Cadet A', label: 'Cadet A' },
    { value: 'Cadet B', label: 'Cadet B' },
    { value: 'Infantil A', label: 'Infantil A' },
    { value: 'Infantil B', label: 'Infantil B' },
    { value: 'Aleví A', label: 'Aleví A' },
    { value: 'Aleví B', label: 'Aleví B' },
    { value: 'Benjamí A', label: 'Benjamí A' },
    { value: 'Benjamí B', label: 'Benjamí B' },
    { value: 'Prebenjamí', label: 'Prebenjamí' },
    { value: 'Escoleta', label: 'Escoleta' }
  ];
  
  const categorias = [
    { value: 'Sènior', label: 'Sènior' },
    { value: 'Juvenil', label: 'Juvenil' },
    { value: 'Cadet', label: 'Cadet' },
    { value: 'Infantil', label: 'Infantil' },
    { value: 'Aleví', label: 'Aleví' },
    { value: 'Benjamí', label: 'Benjamí' },
    { value: 'Prebenjamí', label: 'Prebenjamí' },
    { value: 'Escoleta', label: 'Escoleta' }
  ];
  
  const temporadas = [
    { value: '2024-2025', label: 'Temporada 2024-2025' },
    { value: '2023-2024', label: 'Temporada 2023-2024' },
    { value: '2022-2023', label: 'Temporada 2022-2023' }
  ];
  
  if (isLoading) {
    return (
      <DashboardLayout 
        title="Editant jugador" 
        description="Carregant dades del jugador..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Carregant jugador</h3>
            <p className="mt-2 text-gray-500">Espera uns moments mentre carreguem les dades...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout 
      title={`Editar jugador: ${formData.nombre} ${formData.apellidos}`} 
      description="Actualitza les dades del jugador"
    >
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/jugadors')}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Tornar a jugadors
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pestañas */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    type="button"
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      tabActiva === 'personal'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setTabActiva('personal')}
                  >
                    Dades personals
                  </button>
                  <button
                    type="button"
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      tabActiva === 'deportivos'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setTabActiva('deportivos')}
                  >
                    Dades esportives
                  </button>
                  <button
                    type="button"
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      tabActiva === 'contacto'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setTabActiva('contacto')}
                  >
                    Contacte
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* Datos personales */}
                {tabActiva === 'personal' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField 
                        label="Nom" 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={handleChange}
                        placeholder="Nom del jugador" 
                        error={errors.nombre}
                        required
                      />
                      
                      <InputField 
                        label="Cognoms" 
                        name="apellidos" 
                        value={formData.apellidos} 
                        onChange={handleChange}
                        placeholder="Cognoms del jugador" 
                        error={errors.apellidos}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField 
                        label="Data de naixement" 
                        name="fecha_nacimiento" 
                        type="date"
                        value={formData.fecha_nacimiento} 
                        onChange={handleChange}
                        error={errors.fecha_nacimiento}
                        required
                      />
                      
                      <InputField 
                        label="DNI/NIE" 
                        name="dni_nie" 
                        value={formData.dni_nie} 
                        onChange={handleChange}
                        placeholder="12345678A" 
                        error={errors.dni_nie}
                        required
                      />
                    </div>
                  </div>
                )}
                
                {/* Datos deportivos */}
                {tabActiva === 'deportivos' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SelectField 
                        label="Equip" 
                        name="equipo" 
                        value={formData.equipo} 
                        onChange={handleChange}
                        options={equipos}
                        error={errors.equipo}
                        required
                      />
                      
                      <SelectField 
                        label="Categoria" 
                        name="categoria" 
                        value={formData.categoria} 
                        onChange={handleChange}
                        options={categorias}
                        error={errors.categoria}
                        required
                      />
                      
                      <SelectField 
                        label="Temporada" 
                        name="temporada" 
                        value={formData.temporada} 
                        onChange={handleChange}
                        options={temporadas}
                        error={errors.temporada}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField 
                        label="Posició" 
                        name="posicion" 
                        value={formData.posicion} 
                        onChange={handleChange}
                        options={posiciones}
                        error={errors.posicion}
                      />
                      
                      <InputField 
                        label="Dorsal" 
                        name="dorsal" 
                        type="number"
                        value={formData.dorsal?.toString() || ''} 
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dorsal: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        placeholder="Número de dorsal" 
                        error={errors.dorsal}
                      />
                    </div>
                    
                    <TextareaField 
                      label="Observacions" 
                      name="observaciones" 
                      value={formData.observaciones || ''} 
                      onChange={handleChange}
                      placeholder="Observacions sobre el jugador" 
                      error={errors.observaciones}
                      rows={3}
                    />
                    
                    <CheckboxField 
                      label="Jugador actiu per la temporada actual" 
                      name="activo" 
                      checked={formData.activo} 
                      onChange={handleCheckboxChange}
                    />
                  </div>
                )}
                
                {/* Datos de contacto */}
                {tabActiva === 'contacto' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField 
                        label="Email" 
                        name="email" 
                        type="email"
                        value={formData.email || ''} 
                        onChange={handleChange}
                        placeholder="exemple@gmail.com" 
                        error={errors.email}
                      />
                      
                      <InputField 
                        label="Telèfon" 
                        name="telefono" 
                        value={formData.telefono || ''} 
                        onChange={handleChange}
                        placeholder="600123456" 
                        error={errors.telefono}
                      />
                    </div>
                    
                    <InputField 
                      label="Adreça" 
                      name="direccion" 
                      value={formData.direccion || ''} 
                      onChange={handleChange}
                      placeholder="Carrer, número, pis..." 
                      error={errors.direccion}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField 
                        label="Població" 
                        name="ciudad" 
                        value={formData.ciudad || ''} 
                        onChange={handleChange}
                        placeholder="Cardedeu" 
                        error={errors.ciudad}
                      />
                      
                      <InputField 
                        label="Codi postal" 
                        name="codigo_postal" 
                        value={formData.codigo_postal || ''} 
                        onChange={handleChange}
                        placeholder="08440" 
                        error={errors.codigo_postal}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex justify-end space-x-3">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.push('/dashboard/jugadors')}
              >
                Cancel·lar
              </Button>
              
              <Button 
                variant="primary" 
                type="submit"
                isLoading={isSubmitting}
                iconLeft={<Save className="h-4 w-4" />}
              >
                Guardar canvis
              </Button>
            </div>
          </div>
          
          {/* Columna derecha - Foto y previsualización */}
          <div className="lg:col-span-1">
            <Card title="Foto del jugador">
              <div className="flex flex-col items-center p-4">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-100 border border-gray-200 relative">
                  {fotoPreview ? (
                    <img 
                      src={fotoPreview} 
                      alt="Preview del jugador" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-20 w-20 text-gray-300" />
                    </div>
                  )}
                </div>
                
                <FileUpload 
                  label="Canviar foto" 
                  id="foto-upload"
                  accept="image/*"
                  onChange={handleFotoChange}
                  preview={fotoPreview}
                  onClear={handleClearFoto}
                  error={errors.imagen_url}
                />
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Puja una foto del jugador per millorar la visualització al web.</p>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <h3 className="font-medium mb-1">Previsualització</h3>
                <div className="flex items-center p-2 bg-gray-50 rounded-md">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                    {fotoPreview ? (
                      <img 
                        src={fotoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {formData.nombre || 'Nom'} {formData.apellidos || 'Cognoms'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.equipo || 'Equip'} · {formData.posicion || 'Posició'}
                      {formData.dorsal && <span className="ml-1">· #{formData.dorsal}</span>}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
