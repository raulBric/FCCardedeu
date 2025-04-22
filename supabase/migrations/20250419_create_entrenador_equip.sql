-- Crear tabla de relación entre entrenadores y equipos
CREATE TABLE IF NOT EXISTS public.entrenador_equip (
  id SERIAL PRIMARY KEY,
  entrenador_id INTEGER REFERENCES public.entrenadors(id) ON DELETE SET NULL,
  equip_id INTEGER REFERENCES public.equips(id) ON DELETE CASCADE,
  rol TEXT NOT NULL CHECK (rol IN ('principal', 'segon', 'tercer', 'delegat')),
  temporada TEXT NOT NULL DEFAULT '2024-2025',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(entrenador_id, equip_id, temporada)
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.entrenador_equip ENABLE ROW LEVEL SECURITY;

-- Políticas para acceso a la tabla de entrenador_equip
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Permitir lectura de entrenador_equip a usuarios autenticados" ON public.entrenador_equip
  FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir escritura, actualización y eliminación solo a usuarios autenticados
CREATE POLICY "Permitir escritura de entrenador_equip solo a usuarios autenticados" ON public.entrenador_equip
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización de entrenador_equip solo a usuarios autenticados" ON public.entrenador_equip
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir eliminación de entrenador_equip solo a usuarios autenticados" ON public.entrenador_equip
  FOR DELETE USING (auth.role() = 'authenticated');

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_entrenador_equip_entrenador ON public.entrenador_equip(entrenador_id);
CREATE INDEX IF NOT EXISTS idx_entrenador_equip_equip ON public.entrenador_equip(equip_id);
CREATE INDEX IF NOT EXISTS idx_entrenador_equip_temporada ON public.entrenador_equip(temporada);
