"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Newspaper, 
  Trophy, 
  Users, 
  Calendar,
  Settings, 
  LogOut,
  UserRound,
  UserCog,
  ClipboardPenLine,
  ShieldIcon,
  History
} from "lucide-react";
import Escudo from "@/assets/Escudo.png";
import { supabase } from "@/lib/supabaseClient";

const navItems = [
  { 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    href: "/dashboard" 
  },
  { 
    label: "Inscripcions", 
    icon: ClipboardPenLine, 
    href: "/dashboard/inscripciones" 
  },
  { 
    label: "Jugadors", 
    icon: UserRound, 
    href: "/dashboard/jugadors" 
  },
  { 
    label: "Entrenadors", 
    icon: UserCog, 
    href: "/dashboard/entrenadors" 
  },
  { 
    label: "Equips", 
    icon: ShieldIcon, 
    href: "/dashboard/equips" 
  },
  { 
    label: "Resultats", 
    icon: Trophy, 
    href: "/dashboard/resultats" 
  },
  { 
    label: "Notícies", 
    icon: Newspaper, 
    href: "/dashboard/noticies" 
  },
  { 
    label: "Patrocinadors", 
    icon: Users, 
    href: "/dashboard/patrocinadors" 
  },
  { 
    label: "Calendari", 
    icon: Calendar, 
    href: "/dashboard/calendari" 
  },
  { 
    label: "Portada", 
    icon: Newspaper, 
    href: "/dashboard/portada" 
  },
  { 
    label: "Configuració", 
    icon: Settings, 
    href: "/dashboard/configuracio" 
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose = () => {} }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Mostrar mensaje mientras se cierra la sesión
      console.log("Cerrando sesión...");
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error al cerrar sesión:", error);
        alert(`Error al cerrar sesión: ${error.message}`);
        return;
      }
      
      // Limpiar cualquier estado local o cache si es necesario
      
      // Redireccionar a la página de login
      router.push("/my-club");
      router.refresh(); // Forzar refresh para asegurar que todo se actualiza
    } catch (err) {
      console.error("Error inesperado al cerrar sesión:", err);
      alert("Ha ocurrido un error al cerrar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <aside 
      id="dashboard-sidebar"
      className={`
        w-64 bg-red-700 text-white flex flex-col h-screen fixed left-0 top-0 z-40
        transition-all duration-300 ease-in-out shadow-lg
        ${isOpen !== undefined ? (isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0') : 'md:translate-x-0'}
      `}
    >
        <div className="p-6 flex items-center justify-center border-b border-red-600">
          <img
            src={Escudo.src}
            alt="FC Cardedeu"
            width="80"
            height="80"
            fetchPriority="high"
            className="drop-shadow-lg"
          />
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-3 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-red-600 text-white font-medium' 
                      : 'text-red-100 hover:bg-red-600/50'}
                  `}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-red-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-800 rounded-md hover:bg-red-900 transition"
          >
            <LogOut className="w-5 h-5" />
            Tancar sessió
          </button>
          
          <div className="mt-4 text-center text-sm text-red-200">
            <p>FC Cardedeu</p>
            <p>Admin Panel v1.0</p>
          </div>
        </div>
      </aside>
  );
}
