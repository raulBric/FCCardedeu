"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { getConvocatoriaById, updateConvocatoria, Convocatoria } from '@/services/convocatorias';
import { 
  InputField, 
  SelectField, 
  TextareaField, 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/dashboard/FormComponents';

// Tipo para errores del formulario
interface FormErrors {
  titulo?: string;
  fecha?: string;
  hora?: string;
  lugar?: string;
  equipo?: string;
  rival?: string;
  estado?: string;
  puntoencuentro?: string;
  horaencuentro?: string;
  notas?: string;
}

// Opciones para los selects
const TEAM_OPTIONS = [
  { value: "Escola", label: "Escola" },
  { value: "Prebenjamí", label: "Prebenjamí" },
  { value: "Benjamí", label: "Benjamí" },
  { value: "Aleví", label: "Aleví" },
  { value: "Infantil", label: "Infantil" },
  { value: "Cadet", label: "Cadet" },
  { value: "Juvenil", label: "Juvenil" },
  { value: "Amateur", label: "Amateur" },
  { value: "Femení", label: "Femení" }
];

const STATUS_OPTIONS = [
  { value: "borrador", label: "Borrador" },
  { value: "publicada", label: "Publicada" }
];

export default function EditConvocatoriaClient({ id }: { id: string }) {
  const router = useRouter();

  // Estados
  const [convocatoria, setConvocatoria] = useState<Convocatoria>({
    id: '',
    created_at: '',
    titulo: '',
    fecha: '',
    hora: '',
    lugar: '',
    equipo: '',
    rival: '',
    estado: 'borrador',
    slug: '',
    puntoencuentro: '',
    horaencuentro: "",
    notas: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos
  useEffect(() => {
    async function loadConvocatoria() {
      try {
        setLoading(true);
        const data = await getConvocatoriaById(id);
        if (data) {
          setConvocatoria(data);
        } else {
          toast.error("No s'ha trobat la convocatòria");
          router.push('/dashboard/calendari');
        }
      } catch (error) {
        console.error('Error al cargar la convocatoria:', error);
        toast.error("Error al carregar les dades");
      } finally {
        setLoading(false);
      }
    }

    loadConvocatoria();
  }, [id, router]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConvocatoria(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando se cambia el valor
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validación
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!convocatoria.titulo.trim()) {
      newErrors.titulo = 'El títol és obligatori';
      isValid = false;
    }

    if (!convocatoria.fecha) {
      newErrors.fecha = 'La data és obligatòria';
      isValid = false;
    }

    if (!convocatoria.hora.trim()) {
      newErrors.hora = "L'hora és obligatòria";
      isValid = false;
    }

    if (!convocatoria.lugar.trim()) {
      newErrors.lugar = 'El lloc és obligatori';
      isValid = false;
    }

    if (!convocatoria.equipo) {
      newErrors.equipo = "L'equip és obligatori";
      isValid = false;
    }

    if (!convocatoria.estado) {
      newErrors.estado = "L'estat és obligatori";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Si us plau, corregiu els errors del formulari");
      return;
    }

    try {
      setSubmitting(true);
      await updateConvocatoria(id, {
        titulo: convocatoria.titulo,
        fecha: convocatoria.fecha,
        hora: convocatoria.hora,
        lugar: convocatoria.lugar,
        equipo: convocatoria.equipo,
        rival: convocatoria.rival,
        estado: convocatoria.estado,
        puntoencuentro: convocatoria.puntoencuentro,
        horaencuentro: convocatoria.horaencuentro,
        notas: convocatoria.notas
      });
      
      toast.success("Convocatòria actualitzada correctament");
      router.push('/dashboard/calendari');
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast.error("Error al actualitzar la convocatòria");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:pl-10 lg:pl-12">
      <div className="flex items-center mb-4 sm:mb-6">
        <Link href="/dashboard/calendari" className="mr-3 sm:mr-4">
          <Button variant="outline" className="p-1 h-auto" aria-label="Tornar al llistat">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">
          Editar Convocatòria
        </h1>
      </div>
      
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Informació de la convocatòria</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-6 sm:py-10">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-600" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8">
              <InputField
                label="Títol"
                name="titulo"
                value={convocatoria.titulo}
                onChange={handleChange}
                error={errors.titulo}
                required
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <InputField
                    label="Data"
                    name="fecha"
                    type="date"
                    value={convocatoria.fecha}
                    onChange={handleChange}
                    error={errors.fecha}
                    required
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <InputField
                    label="Hora"
                    name="hora"
                    value={convocatoria.hora}
                    onChange={handleChange}
                    error={errors.hora}
                    required
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <InputField
                    label="Lloc"
                    name="lugar"
                    value={convocatoria.lugar}
                    onChange={handleChange}
                    error={errors.lugar}
                    required
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <SelectField
                    label="Equip"
                    name="equipo"
                    value={convocatoria.equipo}
                    onChange={handleChange}
                    error={errors.equipo}
                    required
                    options={TEAM_OPTIONS}
                    className="pl-10"
                  />
                </div>

                <SelectField
                  label="Estat"
                  name="estado"
                  value={convocatoria.estado}
                  onChange={handleChange}
                  error={errors.estado}
                  required
                  options={STATUS_OPTIONS}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <InputField
                    label="Punt de trobada"
                    name="puntoencuentro"
                    value={convocatoria.puntoencuentro || ''}
                    onChange={handleChange}
                    error={errors.puntoencuentro}
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <InputField
                    label="Hora de trobada"
                    name="horaencuentro"
                    value={convocatoria.horaencuentro || ''}
                    onChange={handleChange}
                    error={errors.horaencuentro}
                    className="pl-10"
                  />
                </div>
              </div>

              <InputField
                label="Rival"
                name="rival"
                value={convocatoria.rival}
                onChange={handleChange}
                error={errors.rival}
                required
              />

              <TextareaField
                label="Notes addicionals"
                name="notas"
                value={convocatoria.notas || ''}
                onChange={handleChange}
                error={errors.notas}
                rows={3}
                className="text-sm sm:text-base"
                placeholder="Detalls addicionals de la convocatòria..."
              />

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
                <Link href="/dashboard/calendari" className="sm:order-first">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full sm:w-auto justify-center mt-3 sm:mt-0"
                  >
                    Cancel·lar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={submitting}
                  className="w-full sm:w-auto justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Desant...
                    </>
                  ) : (
                    'Desar Canvis'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
