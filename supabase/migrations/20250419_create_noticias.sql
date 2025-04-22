-- Crear tabla de noticias
CREATE TABLE IF NOT EXISTS public.noticias (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  imagen_url TEXT,
  autor TEXT,
  categoria TEXT,
  destacada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

-- Políticas para acceso a la tabla de noticias
-- Permitir lectura a todos (incluso sin autenticación)
CREATE POLICY "Permitir lectura de noticias a todos" ON public.noticias
  FOR SELECT USING (true);

-- Permitir operaciones de escritura solo a usuarios autenticados
CREATE POLICY "Permitir escritura de noticias solo a usuarios autenticados" ON public.noticias
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización de noticias solo a usuarios autenticados" ON public.noticias
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir eliminación de noticias solo a usuarios autenticados" ON public.noticias
  FOR DELETE USING (auth.role() = 'authenticated');

-- Crear índice para mejorar búsqueda por fecha
CREATE INDEX IF NOT EXISTS noticias_fecha_idx ON public.noticias (fecha DESC);

-- Crear índice para búsquedas por categoría
CREATE INDEX IF NOT EXISTS noticias_categoria_idx ON public.noticias (categoria);

-- Crear índice para búsqueda de noticias destacadas
CREATE INDEX IF NOT EXISTS noticias_destacada_idx ON public.noticias (destacada);
