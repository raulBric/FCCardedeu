"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  ShieldIcon
} from "lucide-react";
import Escudo from "@/assets/Escudo.png";

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

  const handleLogout = async () => {
    // Implementar lógica de cierre de sesión aquí
    alert("Tancant sessió...");
  };

  return (
    <aside 
      id="dashboard-sidebar"
      className={`
        w-64 bg-red-700 text-white flex flex-col h-screen fixed z-30
        transition-transform duration-300 ease-in-out
        ${isOpen !== undefined ? (isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0') : 'md:translate-x-0'}
      `}
    >
        <div className="p-6 flex items-center justify-center border-b border-red-600">
          <Image 
            src={Escudo} 
            alt="FC Cardedeu" 
            width={80} 
            height={80} 
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
