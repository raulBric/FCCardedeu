"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, ChevronDown, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Escudo from "@/assets/Escudo.png";
import { SearchDialog } from "@/components/SearchDialog";

// ---------------- Constants -----------------
const SCROLL_THRESHOLD = 10;
const scrollOptions = { passive: true } as const;

// ---------------- Types ---------------------
const menuStructure: MenuStructureItem[] = [
  { name: "Inici", path: "/", type: "link" as const },
  {
    name: "Equips",
    type: "dropdown" as const,
    items: [
      { name: "Primer Equip", path: "/primer-equip" },
      { name: "Futbol Base", path: "/futbol-base" },
      { name: "Femení", path: "/femeni" },
    ],
  },
  {
    name: "Competició",
    type: "dropdown" as const,
    items: [
      { name: "Resultats", path: "/resultats" },
      { name: "Classificació", path: "/classificacio" },
      { name: "Convocatòries", path: "/convocatories" },
    ],
  },
  { name: "Notícies", path: "/noticies", type: "link" as const },
  {
    name: "Club",
    type: "dropdown" as const,
    items: [
      { name: "Comunitat", path: "/comunitat" },
      { name: "Junta Directiva", path: "/junta-directiva" },
    ],
  },
  {
    name: "Tràmits",
    type: "dropdown" as const,
    items: [
      { name: "Inscripció", path: "/inscripcio" },
      { name: "Pagaments", path: "/pagaments" },
    ],
  },
];

// Define proper types
type MenuItem = {
  name: string;
  path: string;
  isActive?: boolean;
};

type MenuStructureItem =
  | { name: string; path: string; type: "link" }
  | { name: string; type: "dropdown"; items: MenuItem[] };

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Controlador de scroll optimizado
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  // Efecto para el scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, scrollOptions);
    handleScroll(); // Establecer estado inicial
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Efecto para prefetch de rutas (solo una vez)
  useEffect(() => {
    router.prefetch('/');
    menuStructure.forEach(item => {
      if (item.type === 'link') {
        router.prefetch(item.path);
      } else if (item.items) {
        item.items.forEach(subItem => {
          router.prefetch(subItem.path);
        });
      }
    });
  }, [router]);

  // Efecto para bloquear scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  // Handle keyboard navigation with proper type
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      setIsMenuOpen(false);
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-club-primary transition-all duration-300 w-full",
        scrolled ? "shadow-md border-b border-black/10" : "",
      )}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full flex items-center justify-between h-20 px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="FC Cardedeu - Pàgina d'inici"
        >
          <img
            src={Escudo.src}
            alt="FC Cardedeu"
            width="100"
            height="100"
            className="object-contain w-32 h-32"
            fetchPriority="high"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {menuStructure.map((item) =>
            item.type === "link" ? (
              <Link
                key={item.name}
                href={item.path}
                prefetch={true}
                className="text-white font-medium px-3 py-2 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ) : (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white font-medium px-3 py-2 hover:bg-red-700"
                  >
                    {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="bg-red-800 border-white/20"
                >
                  {item.items?.map((subItem) => (
                    <DropdownMenuItem key={subItem.name} asChild>
                      <Link
                        href={subItem.path}
                        onClick={() => {
                          if (isNavigating) return;
                          setIsNavigating(true);
                        }}
                        className="px-2 py-1.5 text-sm text-white hover:text-white/90 hover:bg-red-800 rounded transition-colors focus:bg-red-800 focus:outline-none cursor-pointer"
                      >
                        {subItem.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Link
            href="https://www.instagram.com/fccardedeu/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-20 w-10 rounded-full bg-transparent text-white hover:bg-white/10 "
            aria-label="Instagram"
          >
            <Instagram className="h-6 w-6" />
          </Link>
          
          {/* Search Dialog */}
          <SearchDialog />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center h-8 w-8 rounded-full bg-transparent text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Tanca el menú" : "Obre el menú"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-10 w-10" />
            ) : (
              <Menu className="h-10 w-10" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 overflow-hidden"
          >
            <div className="container py-4 px-4">
              {/* <div className="relative max-w-md mx-auto">
                <Input
                  type="search"
                  placeholder="Cerca al web..."
                  className="pr-10 bg-red-700/50 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/30"
                  autoFocus={typeof window !== "undefined" && window.innerWidth >= 768}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-club-primary flex flex-col z-40"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Club Shield/Logo at the top center */}
            <div className="flex justify-center">
              <img
                src={Escudo.src}
                alt="FC Cardedeu"
                width="100"
                height="100"
                className="object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-white text-2xl font-bold text-center">
              FC Cardedeu
            </span>
            <button
              className="absolute top-6 right-6 flex items-center justify-center h-8 w-8 rounded-full bg-transparent text-white hover:bg-red-700"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Tanca el menú"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="overflow-y-auto flex-1 px-6 py-2">
              <ul className="space-y-6">
                {menuStructure.map((item) => (
                  <li key={item.name}>
                    {item.type === "link" ? (
                      <Link
                        href={item.path}
                        onClick={() => {
                          if (isNavigating) return;
                          setIsNavigating(true);
                          setIsMenuOpen(false);
                        }}
                        className="text-white text-2xl font-bold block py-2"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-white/70 text-lg font-medium">
                          {item.name}
                        </h3>
                        <ul className="pl-4 space-y-3 border-l border-white/20">
                          {item.items?.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.path}
                                className="text-white text-xl font-medium block py-1"
                                onClick={() => {
                                  if (isNavigating) return;
                                  setIsNavigating(true);
                                  setIsMenuOpen(false);
                                }}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
