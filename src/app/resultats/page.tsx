"use client"

import { useState } from "react"
import Image from "next/image"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO, addDays } from "date-fns"
import { ca } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Trophy } from "lucide-react"
import Header from "@/components/Header"
import { cn } from "@/lib/utils"

// Interfaz para los partidos
interface Partido {
  id: number
  local: string
  visitante: string
  categoria: string
  fecha: string
  hora: string
  campo: string
  resultado?: string
  jugado: boolean
  equipoLocal: boolean
}

export default function PartidosPage() {
  // Estados para la navegación y filtrados
  const [activeTab, setActiveTab] = useState("semana")
  const [categoria, setCategoria] = useState("tots")
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  
  // Fechas de la semana actual
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  })

  // Cambiar de semana
  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7))
  }

  const prevWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7))
  }
  
  // Función para cambiar la pestaña activa
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }
  
  // Función para cambiar la categoría
  const handleCategoriaChange = (value: string) => {
    setCategoria(value)
  }

  // Datos simulados de partidos (normalmente vendrían de una API)
  const partidos: Partido[] = [
    {
      id: 1,
      local: "FC Cardedeu",
      visitante: "CF Mollet",
      categoria: "Primer Equip",
      fecha: "2025-04-20", // Domingo
      hora: "12:00",
      campo: "Municipal Cardedeu",
      jugado: false,
      equipoLocal: true
    },
    {
      id: 2,
      local: "FC Cardedeu Juvenil A",
      visitante: "CE Europa",
      categoria: "Juvenil",
      fecha: "2025-04-20", // Domingo
      hora: "10:30",
      campo: "Municipal Cardedeu",
      jugado: false,
      equipoLocal: true
    },
    {
      id: 3,
      local: "UE Vic",
      visitante: "FC Cardedeu Infantil",
      categoria: "Infantil",
      fecha: "2025-04-19", // Sábado
      hora: "16:00",
      campo: "Hipòlit Planàs",
      jugado: false,
      equipoLocal: false
    },
    {
      id: 4,
      local: "FC Cardedeu", 
      visitante: "CE Sabadell",
      categoria: "Primer Equip",
      fecha: "2025-04-13", // Semana anterior
      hora: "12:00",
      campo: "Municipal Cardedeu",
      resultado: "2-1",
      jugado: true,
      equipoLocal: true
    },
    {
      id: 5,
      local: "FC Cardedeu Cadet",
      visitante: "UE Sant Andreu",
      categoria: "Cadet",
      fecha: "2025-04-21", // Lunes
      hora: "18:30",
      campo: "Municipal Cardedeu",
      jugado: false,
      equipoLocal: true
    },
    {
      id: 6,
      local: "CE Mataró",
      visitante: "FC Cardedeu Aleví",
      categoria: "Aleví",
      fecha: "2025-04-13", // Semana anterior
      hora: "11:00",
      campo: "Municipal Mataró",
      resultado: "2-3",
      jugado: true,
      equipoLocal: false
    }
  ]

  // Filtrar partidos por fecha y categoría
  const partidosDeLaSemana = partidos.filter(partido => {
    const fechaPartido = parseISO(partido.fecha)
    const enEstaSemana = fechaPartido >= currentWeekStart && 
                         fechaPartido <= endOfWeek(currentWeekStart, { weekStartsOn: 1 })
                         
    return enEstaSemana && (categoria === "tots" || partido.categoria.toLowerCase().includes(categoria.toLowerCase()))
  })

  // Últimos resultados
  const ultimosResultados = partidos
    .filter(p => p.jugado && (categoria === "tots" || p.categoria.toLowerCase().includes(categoria.toLowerCase())))
    .slice(0, 5)

  // Agrupar partidos por día
  const partidosPorDia = weekDays.map(day => {
    const fecha = format(day, "yyyy-MM-dd")
    return {
      date: day,
      partidos: partidosDeLaSemana.filter(p => p.fecha === fecha)
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-16">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Partits de la Setmana</h1>
              <p className="text-sm text-gray-600">Consulta els partits i resultats del club</p>
            </div>
            <div className="bg-red-700 text-white px-3 py-1 rounded-md text-xs sm:text-sm self-start sm:self-auto">
              Temporada 24/25
            </div>
          </div>

          {/* Tabs para alternar entre vista semanal y resultados */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="semana" className="text-base">Partits de la Setmana</TabsTrigger>
              <TabsTrigger value="resultados" className="text-base">Últims Resultats</TabsTrigger>
            </TabsList>
            
            {/* Filtros por categoría */}
            <div className="mb-6 bg-white p-3 rounded-lg shadow-sm border">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={categoria === "tots" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategoriaChange("tots")}
                >
                  Tots els equips
                </Badge>
                <Badge 
                  variant={categoria === "primer-equip" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategoriaChange("primer-equip")}
                >
                  1r Equip
                </Badge>
                <Badge 
                  variant={categoria === "juvenil" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategoriaChange("juvenil")}
                >
                  Juvenil
                </Badge>
                <Badge 
                  variant={categoria === "cadet" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategoriaChange("cadet")}
                >
                  Cadet
                </Badge>
                <Badge 
                  variant={categoria === "infantil" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategoriaChange("infantil")}
                >
                  Infantil
                </Badge>
                <Badge 
                  variant={categoria === "alevi" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategoriaChange("alevi")}
                >
                  Aleví
                </Badge>
              </div>
            </div>

            {/* Contenido de las pestañas */}
            <TabsContent value="semana" className="space-y-4">
              {/* Navegación de semanas */}
              <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border">
                <Button variant="outline" size="sm" onClick={prevWeek}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Setmana anterior
                </Button>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-5 w-5 text-red-700" />
                    <h3 className="font-medium">
                      {format(currentWeekStart, "d", { locale: ca })} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), "d MMMM", { locale: ca })}
                    </h3>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" onClick={nextWeek}>
                  Setmana següent <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {/* Partidos de la semana por día */}
              {partidosPorDia.some(day => day.partidos.length > 0) ? (
                <div className="space-y-6">
                  {partidosPorDia.map((day) => {
                    if (day.partidos.length === 0) return null
                    
                    return (
                      <div key={format(day.date, "yyyy-MM-dd")} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isToday(day.date) ? 'bg-red-700 text-white' : 'bg-gray-100'}`}>
                            {format(day.date, 'd', { locale: ca })}
                          </div>
                          <h3 className="font-semibold text-lg">
                            {format(day.date, 'EEEE', { locale: ca })}
                            {isToday(day.date) && <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded">Avui</span>}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {day.partidos.map((partido) => (
                            <PartidoCard key={partido.id} partido={partido} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                  <div className="mb-4">
                    <CalendarDays className="h-12 w-12 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No hi ha partits aquesta setmana</h3>
                  <p className="text-gray-500">Prova a canviar de setmana o de categoria</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resultados">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-red-700" /> Últims resultats
                  </h3>
                </div>
                
                {ultimosResultados.length > 0 ? (
                  <div className="divide-y">
                    {ultimosResultados.map((partido) => (
                      <div key={partido.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm text-gray-500">{partido.categoria}</div>
                          <div className="text-sm text-gray-500">
                            {format(parseISO(partido.fecha), "d MMMM", { locale: ca })}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-right pr-3">
                            <span className={partido.equipoLocal ? "font-semibold text-red-700" : ""}>
                              {partido.local}
                            </span>
                          </div>
                          
                          <div className="px-3 py-1 bg-gray-100 rounded-lg font-semibold">
                            {partido.resultado}
                          </div>
                          
                          <div className="flex-1 pl-3">
                            <span className={!partido.equipoLocal ? "font-semibold text-red-700" : ""}>
                              {partido.visitante}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
                          <MapPin className="h-3 w-3 mr-1" /> {partido.campo}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No hi ha resultats disponibles</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Banner de patrocinadores en el footer */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Patrocinadors del club</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white p-2 rounded-md border border-gray-200 flex items-center justify-center h-12"
                >
                  <img
                    src={`/placeholder.svg?height=30&width=80&text=LOGO ${i}`}
                    alt={`Patrocinador ${i}`}
                    width="80"
                    height="30"
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Componente para mostrar un partido
const PartidoCard = ({ partido }: { partido: Partido }) => {
  // Determine si es un partido del FC Cardedeu
  const esCardedeuLocal = partido.local.includes("FC Cardedeu")
  const esCardedeuVisitante = partido.visitante.includes("FC Cardedeu")

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gray-50 p-2 border-b flex justify-between items-center">
          <span className="text-xs font-medium bg-white text-gray-800 px-2 py-0.5 rounded">{partido.categoria}</span>
          {partido.jugado ? (
            <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded">Finalitzat</span>
          ) : (
            <span className="text-xs text-gray-500">{format(parseISO(partido.fecha), "EEE d MMM", { locale: ca })}</span>
          )}
        </div>

        <div className="p-3">
          <div className="flex justify-between items-center mb-3">
            <div className={cn(
              "flex-1 text-sm text-right pr-3",
              esCardedeuLocal && "font-semibold text-red-700"
            )}>
              {partido.local}
            </div>

            {partido.jugado ? (
              <div className="mx-2 px-3 py-1 bg-gray-100 rounded-lg font-bold text-base">{partido.resultado}</div>
            ) : (
              <div className="mx-2 text-xs text-gray-500">VS</div>
            )}

            <div className={cn(
              "flex-1 text-sm pl-3",
              esCardedeuVisitante && "font-semibold text-red-700"
            )}>
              {partido.visitante}
            </div>
          </div>

          <div className="flex flex-wrap text-xs text-gray-600 gap-y-1 gap-x-2 justify-center">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-gray-400" />
              {partido.hora}
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
              {partido.campo}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
