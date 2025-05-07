"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, X, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/lib/supabaseClient";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function DashboardLayout({ 
  children, 
  title, 
  description 
}: DashboardLayoutProps) {
  // Estado para controlar la apertura/cierre del sidebar en móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState<{
    email: string | null;
    lastSignIn: string | null;
  }>({ email: null, lastSignIn: null });
  
  // Asegurarse de que se ejecuta solo en el cliente
  const isClient = typeof window !== 'undefined';
  
  // Detectar si es móvil al cargar y cuando cambia el tamaño de la ventana
  // Detectar si es móvil solo en el cliente
  useEffect(() => {
    if (!isClient) return;
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px es el breakpoint 'md' en Tailwind
    };
    
    // Comprobar inicialmente
    checkIfMobile();
    
    // Comprobar cuando cambia el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar cuando se desmonta
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isClient]);
  
  // Obtener datos del usuario autenticado
  useEffect(() => {
    async function getUserData() {
      try {
        // Obtener la sesión actual
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al obtener la sesión:', error.message);
          return;
        }
        
        if (session?.user) {
          const email = session.user.email || 'Usuario';
          
          // Depuración - Ver todos los datos disponibles del usuario
          console.log('Datos de usuario disponibles:', session.user);
          
          // Intentar obtener la fecha de última conexión de varias fuentes posibles
          let lastSignIn = null;
          
          // Verificar cada posible propiedad donde podría estar la fecha
          if (session.user.last_sign_in_at) {
            lastSignIn = session.user.last_sign_in_at;
            console.log('Usando last_sign_in_at:', lastSignIn);
          } else if (session.user.updated_at) {
            lastSignIn = session.user.updated_at;
            console.log('Usando updated_at:', lastSignIn);
          } else if (session.user.created_at) {
            lastSignIn = session.user.created_at;
            console.log('Usando created_at:', lastSignIn);
          } else if (session.expires_at) {
            // Fallback - usar la fecha de expiración de la sesión actual
            const expiryTimestamp = session.expires_at * 1000; // Convertir a milisegundos
            const expiryDate = new Date(expiryTimestamp);
            // Restar el tiempo de vida de la sesión (aproximadamente 1 hora)
            expiryDate.setHours(expiryDate.getHours() - 1);
            lastSignIn = expiryDate.toISOString();
            console.log('Usando tiempo calculado de la sesión:', lastSignIn);
          }
          
          // Si todo falla, usar la fecha actual
          if (!lastSignIn) {
            lastSignIn = new Date().toISOString();
            console.log('Usando fecha actual como fallback');
          }
          
          setUserData({
            email,
            lastSignIn
          });
        }
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        // Si hay un error, al menos mostrar la fecha actual
        setUserData(prev => ({
          ...prev,
          lastSignIn: new Date().toISOString()
        }));
      }
    }
    
    getUserData();
  }, []);
  
  // Cerrar automáticamente el sidebar en modo móvil cuando se hace clic fuera
  // Manejar clic fuera del sidebar para cerrarlo
  useEffect(() => {
    if (!isClient) return;
    
    function handleClickOutside(event: MouseEvent) {
      try {
        const sidebar = document.getElementById('dashboard-sidebar');
        const toggleButton = document.getElementById('sidebar-toggle');
        
        if (sidebar && toggleButton && 
            !sidebar.contains(event.target as Node) && 
            !toggleButton.contains(event.target as Node) && 
            sidebarOpen && isMobile) {
          setSidebarOpen(false);
        }
      } catch (error) {
        console.error("Error handling click outside sidebar:", error);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile, isClient]);
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Overlay para cerrar el sidebar en móvil */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Botón de toggle para móvil */}
      <button 
        id="sidebar-toggle"
        className="md:hidden fixed top-4 left-4 z-40 bg-red-600 text-white p-2 rounded-md shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
        <header className="bg-white shadow-sm px-4 sm:px-6 py-4 sticky top-0 z-10 flex justify-between">
          <div className="flex items-center">
            <div className="md:hidden w-8"></div> {/* Espacio para compensar el botón en móvil */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
              {description && <p className="text-sm sm:text-base text-gray-600 mt-1">{description}</p>}
            </div>
          </div>
          
          {/* Información del usuario - Diseño mejorado */}
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <User className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex flex-col">
              <div className="font-medium text-gray-800">
                {userData.email || 'Usuario'}
              </div>
              {userData.lastSignIn ? (
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-red-500" />
                  Conectado: {format(new Date(userData.lastSignIn), 'dd/MM/yyyy HH:mm', { locale: es })}
                </div>
              ) : (
                <div className="text-xs text-gray-500">
                  Fecha de conexión no disponible
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
