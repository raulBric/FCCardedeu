"use client";

import { useState } from "react";
import { Settings, Save, RefreshCw, Shield, Globe, Mail, Database, BellRing } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/dashboard/FormComponents";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

// Interfaz para las configuraciones del sistema
interface SystemConfig {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  contactEmail: string;
  privacyPolicyUrl: string;
  cookieNoticeDays: number;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  backupFrequency: string;
}

export default function ConfiguracionPage() {
  // Estados para la página de configuración
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // Estado para las configuraciones
  const [config, setConfig] = useState<SystemConfig>({
    siteName: "FC Cardedeu",
    siteDescription: "Web oficial del Futbol Club Cardedeu",
    maintenanceMode: false,
    contactEmail: "info@fccardedeu.org",
    privacyPolicyUrl: "/politica-privacidad",
    cookieNoticeDays: 30,
    allowRegistrations: true,
    emailNotifications: true,
    backupFrequency: "diario"
  });

  // Función para manejar cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setConfig({
      ...config,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    });
  };

  // Función para guardar configuraciones
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Simulación de guardado en Supabase (esto sería reemplazado por una llamada real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí iría el código real para guardar en Supabase
      // const { error } = await supabase
      //   .from('configuracion')
      //   .upsert({ id: 1, ...config });
      
      // if (error) throw error;
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      alert("Ha ocurrido un error al guardar la configuración");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout title="Configuración del sistema" description="Administra las configuraciones generales del sitio web">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Configuración del sistema</h2>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          iconLeft={isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>

      {saveSuccess && (
        <div className="mb-4 bg-green-50 text-green-700 p-3 rounded border border-green-200">
          ✓ Los cambios se han guardado correctamente
        </div>
      )}

      {/* Pestañas de navegación */}
      <div className="flex flex-wrap border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === "general" ? "border-b-2 border-red-500 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("general")}
        >
          <Settings className="h-4 w-4 inline mr-1" />
          General
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === "privacidad" ? "border-b-2 border-red-500 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("privacidad")}
        >
          <Shield className="h-4 w-4 inline mr-1" />
          Privacidad
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === "notificaciones" ? "border-b-2 border-red-500 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("notificaciones")}
        >
          <BellRing className="h-4 w-4 inline mr-1" />
          Notificaciones
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === "sistema" ? "border-b-2 border-red-500 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("sistema")}
        >
          <Database className="h-4 w-4 inline mr-1" />
          Sistema
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="space-y-6">
        {/* Pestaña General */}
        {activeTab === "general" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-red-500" />
                Configuración general
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del sitio</label>
                <input
                  type="text"
                  name="siteName"
                  value={config.siteName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Descripción del sitio</label>
                <textarea
                  name="siteDescription"
                  value={config.siteDescription}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={config.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="maintenanceMode" className="text-sm">
                  Activar modo mantenimiento
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pestaña Privacidad */}
        {activeTab === "privacidad" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-red-500" />
                Privacidad y cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL de política de privacidad</label>
                <input
                  type="text"
                  name="privacyPolicyUrl"
                  value={config.privacyPolicyUrl}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Duración del aviso de cookies (días)</label>
                <input
                  type="number"
                  name="cookieNoticeDays"
                  value={config.cookieNoticeDays}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowRegistrations"
                  name="allowRegistrations"
                  checked={config.allowRegistrations}
                  onChange={handleChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="allowRegistrations" className="text-sm">
                  Permitir nuevos registros de usuarios
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pestaña Notificaciones */}
        {activeTab === "notificaciones" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-red-500" />
                Configuración de notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email de contacto</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={config.contactEmail}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={config.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="emailNotifications" className="text-sm">
                  Activar notificaciones por email
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pestaña Sistema */}
        {activeTab === "sistema" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-red-500" />
                Configuración del sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Frecuencia de copias de seguridad</label>
                <select
                  name="backupFrequency"
                  value={config.backupFrequency}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <RefreshCw className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Las copias de seguridad se almacenan en Supabase y se retienen durante 30 días.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
