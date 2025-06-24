"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { createConvocatoria, ConvocatoriaInput } from '@/services/convocatorias';
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

export default function NuevaConvocatoriaPage() {
  const router = useRouter();

  // Estado del formulario
  const [formData, setFormData] = useState<ConvocatoriaInput>({
    titulo: "Primer Equip vs FC Barcelona",
    fecha: "2025-01-24",
    hora: "18:00",
    lugar: "Camp Municipal Cardedeu",
    equipo: "Primer Equip",
    rival: "FC Barcelona",
    estado: "borrador",
    puntoencuentro: "Camp Municipal Cardedeu",
    horaencuentro: "16:30",
    notas: "📅 24/01/2025\n\n📍 Camp Municipal Cardedeu\n\n🕒 Hora de convocatòria: 16:30\n\n⏳ Hora de partit: 18:00\n\nUbicación: https://maps.app.goo.gl/SXtLNq3HayLbXLKJ7"
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando se cambia el valor
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validación
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El títol és obligatori';
      isValid = false;
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La data és obligatòria';
      isValid = false;
    }

    if (!formData.hora) {
      newErrors.hora = "L'hora és obligatòria";
      isValid = false;
    }

    if (!formData.lugar.trim()) {
      newErrors.lugar = 'El lloc és obligatori';
      isValid = false;
    }

    if (!formData.equipo) {
      newErrors.equipo = "L'equip és obligatori";
      isValid = false;
    }

    if (!formData.estado) {
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
      await createConvocatoria(formData);
      toast.success("Convocatòria creada correctament");
      router.push('/dashboard/calendari');
    } catch (error) {
      console.error('Error al crear la convocatoria:', error);
      toast.error("No s'ha pogut crear la convocatòria");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full ml-0 md:ml-64 lg:ml-64 md:pr-4 lg:pr-6">
      <div className="px-2 py-4 w-full max-w-full overflow-x-auto">
        <div className="mb-6">
          <Link href="/dashboard/calendari" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tornar a convocatòries
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Nova Convocatòria</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <InputField
                label="Títol"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                error={errors.titulo}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <InputField
                    label="Data"
                    name="fecha"
                    type="date"
                    value={formData.fecha}
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
                    value={formData.hora}
                    onChange={handleChange}
                    error={errors.hora}
                    required
                    placeholder="18:00"
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
                    value={formData.lugar}
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
                    value={formData.equipo}
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
                  value={formData.estado}
                  onChange={handleChange}
                  error={errors.estado}
                  required
                  options={STATUS_OPTIONS}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Punt de trobada"
                  name="puntoencuentro"
                  value={formData.puntoencuentro || ''}
                  onChange={handleChange}
                  error={errors.puntoencuentro}
                />

                <InputField
                  label="Hora de trobada"
                  name="horaencuentro"
                  value={formData.horaencuentro || ''}
                  onChange={handleChange}
                  error={errors.horaencuentro}
                />
              </div>

              <InputField
                label="Rival"
                name="rival"
                value={formData.rival}
                onChange={handleChange}
                error={errors.rival}
                required
              />

              <TextareaField
                label="Notes addicionals"
                name="notas"
                value={formData.notas || ''}
                onChange={handleChange}
                error={errors.notas}
                rows={4}
                placeholder="Detalls addicionals de la convocatòria..."
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                <Link href="/dashboard/calendari" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancel·lar
                  </Button>
                </Link>
                <Button type="submit" variant="primary" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creant...
                    </>
                  ) : (
                    'Crear Convocatòria'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
