"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowLeft, Upload, X } from "lucide-react";
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
  crearPatrocinador, 
  subirArchivo, 
  Patrocinador 
} from "@/services/dashboardService";

export default function CrearPatrocinadorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoInicial = searchParams.get('tipo') || 'colaborador';
  
  const [formData, setFormData] = useState<Omit<Patrocinador, 'id'>>({
    nombre: '',
    logo_url: '',
    url: '',
    tipo: tipoInicial as 'principal' | 'colaborador',
    activo: true
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
  
  // Manejar subida de logo
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Limpiar logo
  const handleClearLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setFormData(prev => ({ ...prev, logo_url: '' }));
  };
  
  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nom és obligatori";
    }
    
    if (!logoFile && !formData.logo_url) {
      newErrors.logo = "Has de pujar un logo";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Guardar patrocinador
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Si hay un nuevo logo, subirlo primero
      let logoUrl = formData.logo_url;
      if (logoFile) {
        const fileName = `${Date.now()}-${logoFile.name}`;
        logoUrl = await subirArchivo('patrocinadores', fileName, logoFile);
      }
      
      // Crear patrocinador con la URL del logo
      const nuevoPatrocinador = {
        ...formData,
        logo_url: logoUrl
      };
      
      await crearPatrocinador(nuevoPatrocinador);
      
      // Redirigir a la lista de patrocinadores
      router.push('/dashboard/patrocinadors');
    } catch (error) {
      console.error('Error al crear patrocinador:', error);
      setErrors({
        form: 'Ha ocorregut un error al crear el patrocinador. Intenta-ho de nou.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout 
      title="Crear patrocinador" 
      description="Afegeix un nou patrocinador o col·laborador al web"
    >
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/patrocinadors')}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Tornar a patrocinadors
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card 
          title="Informació del patrocinador" 
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <InputField 
                label="Nom del patrocinador" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange}
                placeholder="Exemple: Ajuntament de Cardedeu" 
                error={errors.nombre}
                required
              />
              
              <InputField 
                label="URL del lloc web" 
                name="url" 
                type="url"
                value={formData.url} 
                onChange={handleChange}
                placeholder="https://www.exemple.com" 
              />
              
              <SelectField 
                label="Tipus de patrocinador" 
                name="tipo" 
                value={formData.tipo} 
                onChange={handleChange}
                options={[
                  { value: 'principal', label: 'Patrocinador principal' },
                  { value: 'colaborador', label: 'Col·laborador' }
                ]}
              />
              
              <FileUpload 
                label="Logo del patrocinador" 
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoChange}
                preview={logoPreview}
                onClear={handleClearLogo}
                error={errors.logo}
              />
              
              <CheckboxField 
                label="Mostrar com a patrocinador actiu" 
                name="activo" 
                checked={formData.activo} 
                onChange={handleCheckboxChange}
              />
              
              {errors.form && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                  <p className="text-sm text-red-700">{errors.form}</p>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => router.push('/dashboard/patrocinadors')}
                  className="mr-2"
                >
                  Cancel·lar
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  isLoading={isSubmitting}
                  iconLeft={<Save className="h-4 w-4" />}
                >
                  Guardar patrocinador
                </Button>
              </div>
            </div>
          </form>
        </Card>
        
        <Card title="Previsualització">
          <div className="flex flex-col items-center p-4">
            {logoPreview ? (
              <div className="w-40 h-40 relative mb-4 border border-gray-200 rounded-md overflow-hidden p-2">
                <img 
                  src={logoPreview} 
                  alt="Preview del logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-md mb-4">
                <Upload className="h-10 w-10 text-gray-400" />
              </div>
            )}
            
            <h3 className="text-lg font-semibold text-center mb-1">
              {formData.nombre || 'Nom del patrocinador'}
            </h3>
            
            {formData.url && (
              <a 
                href={formData.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:underline"
              >
                {formData.url}
              </a>
            )}
            
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                formData.tipo === 'principal' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {formData.tipo === 'principal' ? 'Principal' : 'Col·laborador'}
              </span>
              
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                formData.activo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {formData.activo ? 'Actiu' : 'Inactiu'}
              </span>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Aquesta és una previsualització de com es veurà el patrocinador al llistat.</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
