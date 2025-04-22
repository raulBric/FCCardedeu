"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

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
        <header className="bg-white shadow-sm px-4 sm:px-6 py-4 sticky top-0 z-10 flex items-center">
          <div className="md:hidden w-8"></div> {/* Espacio para compensar el botón en móvil */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
            {description && <p className="text-sm sm:text-base text-gray-600 mt-1">{description}</p>}
          </div>
        </header>
        
        <main className="p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
