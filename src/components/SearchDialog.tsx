"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define interface for search results
interface SearchResult {
  id: number;
  type: "noticia" | "equipo" | "jugador";
  title: string;
  url: string;
}

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Simular búsqueda con un retraso
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      // Simular llamada a API
      // En un entorno real, aquí llamaríamos a un servicio de búsqueda
      setTimeout(() => {
        // Datos simulados para demostración
        const mockResults: SearchResult[] = [
          { id: 1, type: "noticia" as const, title: "Victoria del primer equipo", url: "/noticies/victoria-primer-equipo" },
          { id: 2, type: "equipo" as const, title: "Primer Equip", url: "/primer-equip" },
          { id: 3, type: "jugador" as const, title: "Marc García", url: "/jugadores/marc-garcia" },
        ].filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(mockResults);
        setLoading(false);
      }, 500);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full bg-transparent text-white hover:bg-white/10"
          aria-label="Cercar al lloc web"
        >
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Cerca al FC Cardedeu</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca notícies, equips, jugadors..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {loading && (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <a
                  key={result.id}
                  href={result.url}
                  className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {result.type === "noticia" && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                  {result.type === "equipo" && <div className="h-2 w-2 rounded-full bg-green-500"></div>}
                  {result.type === "jugador" && <div className="h-2 w-2 rounded-full bg-amber-500"></div>}
                  <div>
                    <p className="text-sm font-medium">{result.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{result.type}</p>
                  </div>
                </a>
              ))
            ) : searchQuery.length >= 3 && !loading ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No s&apos;han trobat resultats per &quot;{searchQuery}&quot;
              </p>
            ) : searchQuery.length > 0 && searchQuery.length < 3 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                Escriu al menys 3 caràcters per cercar
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
