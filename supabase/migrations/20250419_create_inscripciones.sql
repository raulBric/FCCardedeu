-- Crear tabla de inscripcions
CREATE TABLE IF NOT EXISTS public.inscripcions (
  id SERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  player_dni TEXT NOT NULL,
  health_card TEXT,
  team TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  contact_phone1 TEXT NOT NULL,
  contact_phone2 TEXT,
  alt_contact TEXT,
  email1 TEXT NOT NULL,
  email2 TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  school TEXT,
  shirt_size TEXT,
  siblings_in_club TEXT,
  seasons_in_club TEXT,
  bank_account TEXT,
  comments TEXT,
  site_access TEXT,
  accept_terms BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'rechazada')),
  temporada TEXT NOT NULL DEFAULT '2024-2025',
  processed BOOLEAN NOT NULL DEFAULT FALSE
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.inscripcions ENABLE ROW LEVEL SECURITY;

-- Políticas para acceso a la tabla de inscripcions
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Permitir lectura de inscripcions a usuarios autenticados" ON public.inscripcions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir operaciones de escritura a todos (para formulario público)
CREATE POLICY "Permitir escritura de inscripcions a todos" ON public.inscripcions
  FOR INSERT WITH CHECK (true);

-- Permitir actualización y eliminación solo a usuarios autenticados
CREATE POLICY "Permitir actualización de inscripcions solo a usuarios autenticados" ON public.inscripcions
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Permitir eliminación solo a usuarios autenticados
CREATE POLICY "Permitir eliminación de inscripcions solo a usuarios autenticados" ON public.inscripcions
  FOR DELETE USING (auth.role() = 'authenticated');
  
-- Crear una función RPC para actualizar el estado de inscripciones (salta las restricciones RLS)
CREATE OR REPLACE FUNCTION actualizar_estado_inscripcion(inscripcion_id INT, nuevo_estado TEXT, valor_processed BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.role() = 'authenticated' THEN
    UPDATE public.inscripcions 
    SET estado = nuevo_estado, processed = valor_processed
    WHERE id = inscripcion_id;
  ELSE
    RAISE EXCEPTION 'No autorizado: Solo usuarios autenticados pueden actualizar inscripciones';
  END IF;
END;
$$;

-- Crear función para crear tabla inscripcions desde aplicación
CREATE OR REPLACE FUNCTION create_inscripcions_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si la tabla existe
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename = 'inscripcions') THEN
    -- Crear la tabla
    CREATE TABLE public.inscripcions (
      id SERIAL PRIMARY KEY,
      player_name TEXT NOT NULL,
      birth_date DATE NOT NULL,
      player_dni TEXT NOT NULL,
      health_card TEXT,
      team TEXT NOT NULL,
      parent_name TEXT NOT NULL,
      contact_phone1 TEXT NOT NULL,
      contact_phone2 TEXT,
      alt_contact TEXT,
      email1 TEXT NOT NULL,
      email2 TEXT,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      school TEXT,
      shirt_size TEXT,
      siblings_in_club TEXT,
      seasons_in_club TEXT,
      bank_account TEXT,
      comments TEXT,
      site_access TEXT,
      accept_terms BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'rechazada')),
      temporada TEXT NOT NULL DEFAULT '2024-2025',
      processed BOOLEAN NOT NULL DEFAULT FALSE
    );

    -- Configurar RLS (Row Level Security)
    ALTER TABLE public.inscripcions ENABLE ROW LEVEL SECURITY;

    -- Políticas para acceso a la tabla de inscripcions
    CREATE POLICY "Permitir lectura de inscripcions a usuarios autenticados" ON public.inscripcions
      FOR SELECT USING (auth.role() = 'authenticated');

    CREATE POLICY "Permitir escritura de inscripcions a todos" ON public.inscripcions
      FOR INSERT WITH CHECK (true);

    CREATE POLICY "Permitir actualización de inscripcions solo a usuarios autenticados" ON public.inscripcions
      FOR UPDATE USING (auth.role() = 'authenticated');

    CREATE POLICY "Permitir eliminación de inscripcions solo a usuarios autenticados" ON public.inscripcions
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END;
$$;
