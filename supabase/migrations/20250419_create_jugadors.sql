-- Crear tabla de jugadors
CREATE TABLE IF NOT EXISTS public.jugadors (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  cognoms TEXT NOT NULL,
  data_naixement DATE,
  dni_nie TEXT,
  catsalut TEXT,
  telefon TEXT,
  telefon_emergencia TEXT,
  email TEXT,
  direccio TEXT,
  codi_postal TEXT,
  poblacio TEXT,
  categoria TEXT,
  posicio TEXT,
  observacions_mediques TEXT,
  observacions TEXT,
  imatge_url TEXT,
  estat TEXT DEFAULT 'actiu' CHECK (estat IN ('actiu', 'inactiu', 'baixa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.jugadors ENABLE ROW LEVEL SECURITY;

-- Políticas para acceso a la tabla de jugadors
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Permitir lectura de jugadors a usuarios autenticados" ON public.jugadors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir escritura, actualización y eliminación solo a usuarios autenticados
CREATE POLICY "Permitir escritura de jugadors solo a usuarios autenticados" ON public.jugadors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización de jugadors solo a usuarios autenticados" ON public.jugadors
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir eliminación de jugadors solo a usuarios autenticados" ON public.jugadors
  FOR DELETE USING (auth.role() = 'authenticated');

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_jugadors_nom_cognoms ON public.jugadors(nom, cognoms);
CREATE INDEX IF NOT EXISTS idx_jugadors_categoria ON public.jugadors(categoria);
CREATE INDEX IF NOT EXISTS idx_jugadors_estat ON public.jugadors(estat);
