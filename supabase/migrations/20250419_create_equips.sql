-- Crear tabla de equips
CREATE TABLE IF NOT EXISTS public.equips (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  categoria TEXT NOT NULL,
  temporada TEXT NOT NULL DEFAULT '2024-2025',
  entrenador TEXT,
  delegat TEXT,
  imatge_url TEXT,
  descripcio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.equips ENABLE ROW LEVEL SECURITY;

-- Políticas para acceso a la tabla de equips
-- Permitir lectura a todos
CREATE POLICY "Permitir lectura de equips a todos" ON public.equips
  FOR SELECT USING (true);

-- Permitir escritura, actualización y eliminación solo a usuarios autenticados
CREATE POLICY "Permitir escritura de equips solo a usuarios autenticados" ON public.equips
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización de equips solo a usuarios autenticados" ON public.equips
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir eliminación de equips solo a usuarios autenticados" ON public.equips
  FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_equips_updated_at
BEFORE UPDATE ON public.equips
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
