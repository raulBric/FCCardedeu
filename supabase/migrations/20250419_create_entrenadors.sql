-- Crear tabla de entrenadors
CREATE TABLE IF NOT EXISTS public.entrenadors (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  cognom TEXT NOT NULL,
  tipus TEXT NOT NULL, -- "principal", "segon", "tercer", "delegat"
  telefon TEXT,
  email TEXT,
  titulacio TEXT,
  observacions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.entrenadors ENABLE ROW LEVEL SECURITY;

-- Políticas para acceso a la tabla de entrenadors
-- Permitir lectura a todos
CREATE POLICY "Permitir lectura de entrenadors a todos" ON public.entrenadors
  FOR SELECT USING (true);

-- Permitir escritura, actualización y eliminación solo a usuarios autenticados
CREATE POLICY "Permitir escritura de entrenadors solo a usuarios autenticados" ON public.entrenadors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización de entrenadors solo a usuarios autenticados" ON public.entrenadors
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir eliminación de entrenadors solo a usuarios autenticados" ON public.entrenadors
  FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger para actualizar el campo updated_at
CREATE TRIGGER update_entrenadors_updated_at
BEFORE UPDATE ON public.entrenadors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
