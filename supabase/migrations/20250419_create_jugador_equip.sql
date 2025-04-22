-- Crear tabla de relación entre jugadores y equipos
CREATE TABLE IF NOT EXISTS public.jugador_equip (
  id SERIAL PRIMARY KEY,
  jugador_id INTEGER REFERENCES public.jugadors(id) ON DELETE SET NULL,
  equip_id INTEGER REFERENCES public.equips(id) ON DELETE CASCADE,
  dorsal TEXT,
  posicio TEXT,
  temporada TEXT NOT NULL DEFAULT '2024-2025',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(jugador_id, equip_id, temporada)
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.jugador_equip ENABLE ROW LEVEL SECURITY;

-- Políticas para acceso a la tabla de jugador_equip
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Permitir lectura de jugador_equip a usuarios autenticados" ON public.jugador_equip
  FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir escritura, actualización y eliminación solo a usuarios autenticados
CREATE POLICY "Permitir escritura de jugador_equip solo a usuarios autenticados" ON public.jugador_equip
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización de jugador_equip solo a usuarios autenticados" ON public.jugador_equip
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir eliminación de jugador_equip solo a usuarios autenticados" ON public.jugador_equip
  FOR DELETE USING (auth.role() = 'authenticated');

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_jugador_equip_jugador ON public.jugador_equip(jugador_id);
CREATE INDEX IF NOT EXISTS idx_jugador_equip_equip ON public.jugador_equip(equip_id);
CREATE INDEX IF NOT EXISTS idx_jugador_equip_temporada ON public.jugador_equip(temporada);
