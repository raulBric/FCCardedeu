"use client";

import { useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Save, ArrowLeft, User } from "lucide-react";
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
  subirArchivo
} from "@/services/dashboardService";
// Usar el adaptador en lugar del servicio eliminado
import { crearJugador as crearJugadorDB } from "@/adapters/ServiceAdapters";
import { Jugador as JugadorDB } from "@/core/domain/models/Jugador";

// Interfaz UI para el formulario (usando nombres en español para compatibilidad)
interface JugadorUI {
  id?: number;
  nombre: string;           // nom
  apellidos: string;        // cognoms
  fecha_nacimiento: string; // data_naixement
  dni_nie: string;
  posicion: string;         // posicio
  dorsal?: number;
  imagen_url: string;       // imatge_url
  categoria: string;
  equipo: string;           // equip
  temporada: string;
  email: string;
  telefono: string;         // telefon
  direccion: string;        // direccio
  ciudad: string;           // poblacio
  codigo_postal: string;    // codi_postal
  observaciones: string;    // observacions
  activo: boolean;          // estat
}

export default function CrearJugadorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const equipoInicial = searchParams.get('equipo') || '';
  const categoriaInicial = searchParams.get('categoria') || '';
  const temporadaInicial = searchParams.get('temporada') || '2024-2025';
  
  const [formData, setFormData] = useState<Omit<JugadorUI, 'id'>>({
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    posicion: '',
    dorsal: undefined,
    imagen_url: '',
    categoria: categoriaInicial,
    equipo: equipoInicial,
    temporada: temporadaInicial,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tabActiva, setTabActiva] = useState('personal');
  
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
      newErrors.dni_nie = "El DNI o NIE és obligatori";
    }
    
    if (!formData.equipo) {
      newErrors.equipo = "L'equip és obligatori";
    }
    
    if (!formData.categoria) {
      newErrors.categoria = "La categoria és obligatòria";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Guardar jugador
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Si hay errores de validación, evitar envío
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Si hay foto, subirla primero
      let imagen_url = formData.imagen_url;
      
      if (fotoFile) {
        try {
          // Crear un nombre único para el archivo usando timestamp
          const fileName = `${Date.now()}-${fotoFile.name}`;
          // Llamar a subirArchivo con los 3 argumentos requeridos
          const fileUrl = await subirArchivo('jugadores', fileName, fotoFile);
          if (fileUrl) {
            imagen_url = fileUrl;
          }
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          // Continuar sin imagen
        }
      }
      
      // 2. Crear objeto jugador para la BD (convirtiendo nombres de campos)
      // Crear objeto jugador compatible con la interfaz JugadorDB
      // Definimos propiedades básicas que coinciden con la interfaz Jugador
      const jugadorData: Omit<JugadorDB, 'id' | 'created_at' | 'updated_at'> = {
        nom: formData.nombre,
        cognoms: formData.apellidos,
        data_naixement: formData.fecha_nacimiento,
        dni_nie: formData.dni_nie,
        posicio: formData.posicion,
        imatge_url: imagen_url,
        categoria: formData.categoria,
        email: formData.email,
        telefon: formData.telefono,
        direccio: formData.direccion,
        poblacio: formData.ciudad,
        codi_postal: formData.codigo_postal,
        observacions: formData.observaciones,
        estat: formData.activo ? 'actiu' : 'inactiu'
      };
      
      // Añadir propiedades adicionales que no están en la interfaz usando casting
      const jugadorFinal = jugadorData as any;
      jugadorFinal.equip = formData.equipo;
      jugadorFinal.temporada = formData.temporada;
      
      // Añadir dorsal solo si está definido
      if (formData.dorsal !== undefined) {
        jugadorFinal.dorsal = formData.dorsal;
      }
      
      // 3. Guardar en base de datos
      const nuevoJugador = await crearJugadorDB(jugadorFinal);
      
      // 4. Redireccionar a la ficha del jugador creado
      if (nuevoJugador && nuevoJugador.id) {
        router.push(`/dashboard/jugadors/${nuevoJugador.id}`);
      } else {
        router.push('/dashboard/jugadors');
      }
      
    } catch (error) {
      console.error("Error al crear jugador:", error);
      setErrors(prev => ({
        ...prev,
        general: "Error al guardar el jugador. Intenta-ho de nou o contacta amb l'administrador."
      }));
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Formulario principal */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.push('/dashboard/jugadors')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Tornar
              </Button>
              <h1 className="text-2xl font-bold">Crear nou jugador</h1>
            </div>
          </div>
          
          {/* Tarjeta de información general */}
          <Card title="Informació general">
            <div className="p-4">
              {/* Tabs para secciones del formulario */}
              <div className="border-b mb-6">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`pb-2 px-1 font-medium ${
                      tabActiva === 'personal' 
                        ? 'border-b-2 border-red-500 text-red-600' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    onClick={() => setTabActiva('personal')}
                  >
                    Dades personals
                  </button>
                  
                  <button
                    type="button"
                    className={`pb-2 px-1 font-medium ${
                      tabActiva === 'equipo' 
                        ? 'border-b-2 border-red-500 text-red-600' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    onClick={() => setTabActiva('equipo')}
                  >
                    Dades d&apos;equip
                  </button>
                  
                  <button
                    type="button"
                    className={`pb-2 px-1 font-medium ${
                      tabActiva === 'contacto' 
                        ? 'border-b-2 border-red-500 text-red-600' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    onClick={() => setTabActiva('contacto')}
                  >
                    Contacte
                  </button>
                </div>
              </div>
              
              {/* Contenido de las tabs */}
              <div className="space-y-6">
                {/* Datos personales */}
                {tabActiva === 'personal' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField 
                        label="Nom" 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={handleChange}
                        placeholder="Josep" 
                        required
                        error={errors.nombre}
                      />
                      
                      <InputField 
                        label="Cognoms" 
                        name="apellidos" 
                        value={formData.apellidos} 
                        onChange={handleChange}
                        placeholder="García Martínez" 
                        required
                        error={errors.apellidos}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField 
                        label="Data de naixement" 
                        name="fecha_nacimiento" 
                        type="date" 
                        value={formData.fecha_nacimiento} 
                        onChange={handleChange}
                        required
                        error={errors.fecha_nacimiento}
                      />
                      
                      <InputField 
                        label="DNI/NIE" 
                        name="dni_nie" 
                        value={formData.dni_nie} 
                        onChange={handleChange}
                        placeholder="12345678A" 
                        required
                        error={errors.dni_nie}
                      />
                    </div>
                    
                    <TextareaField 
                      label="Observacions" 
                      name="observaciones" 
                      value={formData.observaciones} 
                      onChange={handleChange}
                      placeholder="Informació adicional sobre el jugador" 
                      rows={4}
                    />
                    
                    <div className="mt-2">
                      <CheckboxField 
                        label="Actiu" 
                        name="activo" 
                        checked={formData.activo} 
                        onChange={handleCheckboxChange}
                      />
                      <p className="text-xs text-gray-500 mt-1">Desmarcar per inactivar el jugador</p>
                    </div>
                  </div>
                )}
                
                {/* Datos de equipo */}
                {tabActiva === 'equipo' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SelectField 
                        label="Categoria" 
                        name="categoria" 
                        value={formData.categoria} 
                        onChange={handleChange}
                        options={[
                          { value: "", label: "-- Selecciona categoria --" },
                          { value: "Benjamí", label: "Benjamí" },
                          { value: "Aleví", label: "Aleví" },
                          { value: "Infantil", label: "Infantil" },
                          { value: "Cadet", label: "Cadet" },
                          { value: "Juvenil", label: "Juvenil" },
                          { value: "Amateur", label: "Amateur" }
                        ]}
                        required
                        error={errors.categoria}
                      />
                      
                      <SelectField 
                        label="Equip" 
                        name="equipo" 
                        value={formData.equipo} 
                        onChange={handleChange}
                        options={[
                          { value: "", label: "-- Selecciona equip --" },
                          { value: "Benjamí A", label: "Benjamí A" },
                          { value: "Benjamí B", label: "Benjamí B" },
                          { value: "Aleví A", label: "Aleví A" },
                          { value: "Aleví B", label: "Aleví B" },
                          { value: "Infantil A", label: "Infantil A" },
                          { value: "Infantil B", label: "Infantil B" },
                          { value: "Cadet A", label: "Cadet A" },
                          { value: "Cadet B", label: "Cadet B" },
                          { value: "Juvenil A", label: "Juvenil A" },
                          { value: "Amateur", label: "Amateur" }
                        ]}
                        required
                        error={errors.equipo}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SelectField 
                        label="Posició" 
                        name="posicion" 
                        value={formData.posicion} 
                        onChange={handleChange}
                        options={[
                          { value: "", label: "-- Selecciona posició --" },
                          { value: "Porter", label: "Porter" },
                          { value: "Defensa", label: "Defensa" },
                          { value: "Migcampista", label: "Migcampista" },
                          { value: "Davanter", label: "Davanter" }
                        ]}
                      />
                      
                      <InputField 
                        label="Dorsal" 
                        name="dorsal" 
                        type="number" 
                        value={formData.dorsal?.toString() || ''} 
                        onChange={handleChange}
                        placeholder="Número de samarreta" 
                      />
                    </div>
                    
                    <InputField 
                      label="Temporada" 
                      name="temporada" 
                      value={formData.temporada} 
                      onChange={handleChange}
                      placeholder="2024-2025" 
                    />
                  </div>
                )}
                
                {/* Datos de contacto */}
                {tabActiva === 'contacto' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField 
                        label="Email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        placeholder="exemple@gmail.com" 
                      />
                      
                      <InputField 
                        label="Telèfon" 
                        name="telefono" 
                        value={formData.telefono} 
                        onChange={handleChange}
                        placeholder="666111222" 
                      />
                    </div>
                    
                    <InputField 
                      label="Direcció" 
                      name="direccion" 
                      value={formData.direccion} 
                      onChange={handleChange}
                      placeholder="Carrer Exemple, 123" 
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField 
                        label="Població" 
                        name="ciudad" 
                        value={formData.ciudad} 
                        onChange={handleChange}
                        placeholder="Cardedeu" 
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
                Guardar jugador
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Columna derecha - Foto y previsualización */}
        <div className="lg:col-span-1">
          <Card title="Foto del jugador">
            <div className="flex flex-col items-center p-4">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-100 border border-gray-200 relative">
                {fotoPreview ? (
                  <Image 
                    src={fotoPreview} 
                    alt="Preview del jugador" 
                    className="w-full h-full object-cover"
                    width={160}
                    height={160}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-20 w-20 text-gray-300" />
                  </div>
                )}
              </div>
              
              <FileUpload 
                label="Puja una foto" 
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
                    <Image 
                      src={fotoPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
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
  );
}
