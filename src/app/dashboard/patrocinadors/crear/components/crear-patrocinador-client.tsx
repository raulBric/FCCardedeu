"use client";

import { useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowLeft, Upload } from "lucide-react";
import Image from "next/image";
import { 
  Button, 
  Card, 
  InputField, 
  SelectField, 
  CheckboxField, 
  FileUpload 
} from "@/components/dashboard/FormComponents";
import { 
  crearPatrocinador, 
  subirArchivo, 
  Patrocinador 
} from "@/services/dashboardService";

export default function CrearPatrocinadorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoInicial = searchParams.get('tipo') || 'colaborador';
  
  const [formData, setFormData] = useState<Omit<Patrocinador, 'id'>>({
    nombre: '',
    logo_url: '',
    url: '',
    nivel: 'oro', // Valor predeterminado requerido por la interfaz
    temporada: new Date().getFullYear().toString(), // Temporada actual
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
    <>
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
                <div className="p-3 text-sm text-red-800 border border-red-200 bg-red-50 rounded-md">
                  {errors.form}
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => router.push('/dashboard/patrocinadors')}
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
        
        <div>
          <Card title="Previsualització">
            <div className="p-4 flex flex-col items-center">
              <div className="w-48 h-32 mb-4 flex items-center justify-center border border-gray-200 rounded-md bg-gray-50">
                {logoPreview ? (
                  <Image 
                    src={logoPreview} 
                    alt={formData.nombre || 'Logo preview'} 
                    className="max-w-full max-h-full object-contain"
                    width={192}
                    height={128}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Upload className="mx-auto h-8 w-8" />
                    <p className="text-xs mt-1">Previsualització del logo</p>
                  </div>
                )}
              </div>
              
              <h3 className="font-medium">{formData.nombre || 'Nom del patrocinador'}</h3>
              
              <p className="text-sm text-gray-500">
                {formData.tipo === 'principal' ? 'Patrocinador principal' : 'Col·laborador'}
              </p>
              
              {formData.url && (
                <a 
                  href={formData.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-red-600 hover:underline mt-2"
                >
                  Visitar web
                </a>
              )}
            </div>
          </Card>
          
          <Card title="Ajuda" className="mt-4">
            <div className="p-4 text-sm space-y-3">
              <p>La imatge del logo ha de ser en format PNG o JPG amb fons transparent sempre que sigui possible.</p>
              <p>Els patrocinadors principals es mostren amb més prominència al web.</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
