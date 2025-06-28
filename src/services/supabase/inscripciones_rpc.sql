-- Archivo: inscripciones_rpc.sql
-- Este script define las funciones RPC necesarias para la gestión de inscripciones
-- que soluciona los problemas de persistencia de datos y visibilidad en el dashboard

-- Función para validar si la tabla inscripcions existe
CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Función para crear la tabla inscripcions con la estructura adecuada
CREATE OR REPLACE FUNCTION public.create_inscripcions_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Crear la tabla
  CREATE TABLE IF NOT EXISTS public.inscripcions (
    id SERIAL PRIMARY KEY,
    player_name TEXT NOT NULL,
    birth_date TEXT,
    player_dni TEXT,
    health_card TEXT,
    team TEXT,
    parent_name TEXT,
    contact_phone1 TEXT,
    contact_phone2 TEXT,
    alt_contact TEXT,
    email1 TEXT,
    email2 TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    school TEXT,
    shirt_size TEXT,
    siblings_in_club BOOLEAN DEFAULT FALSE,
    seasons_in_club TEXT,
    bank_account TEXT,
    comments TEXT,
    accept_terms BOOLEAN DEFAULT FALSE,
    payment_type TEXT,
    payment_amount NUMERIC(10,2),
    payment_session_id TEXT,
    payment_status TEXT DEFAULT 'pending',
    estado TEXT DEFAULT 'pendiente',
    inscripcion_source TEXT DEFAULT 'web',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by TEXT
  );
  
  -- Permisos RLS básicos
  ALTER TABLE public.inscripcions ENABLE ROW LEVEL SECURITY;
  
  -- Habilitar políticas RLS
  PERFORM ensure_inscripciones_access();
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creando tabla inscripcions: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Función para crear la política de acceso al dashboard
CREATE OR REPLACE FUNCTION public.ensure_inscripciones_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Eliminar políticas anteriores si existen
  DROP POLICY IF EXISTS dashboard_access ON public.inscripcions;
  DROP POLICY IF EXISTS allow_web_insert ON public.inscripcions;
  
  -- Crear política para permitir acceso desde el dashboard
  CREATE POLICY dashboard_access 
    ON public.inscripcions 
    FOR ALL
    USING (true);
    
  -- Política específica para inserciones desde la web
  CREATE POLICY allow_web_insert
    ON public.inscripcions
    FOR INSERT
    WITH CHECK (inscripcion_source = 'web');
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error configurando políticas RLS: %', SQLERRM;
END;
$$;

-- Función para insertar una inscripción, asegurando todos los campos
-- Primero eliminamos la función existente para evitar conflicto de tipos
DROP FUNCTION IF EXISTS public.insert_inscripcio(JSONB);

CREATE FUNCTION public.insert_inscripcio(new_row JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_id INTEGER;
BEGIN
  INSERT INTO public.inscripcions (
    player_name,
    birth_date,
    player_dni,
    health_card,
    team,
    parent_name,
    contact_phone1,
    contact_phone2,
    alt_contact,
    email1,
    email2,
    address,
    city,
    postal_code,
    school,
    shirt_size,
    siblings_in_club,
    seasons_in_club,
    bank_account,
    comments,
    accept_terms,
    payment_type,
    payment_amount,
    payment_session_id,
    payment_status,
    estado,
    inscripcion_source,
    created_at,
    updated_at
  ) VALUES (
    new_row->>'player_name',
    new_row->>'birth_date',
    new_row->>'player_dni',
    new_row->>'health_card',
    new_row->>'team',
    new_row->>'parent_name',
    new_row->>'contact_phone1',
    new_row->>'contact_phone2',
    new_row->>'alt_contact',
    new_row->>'email1',
    new_row->>'email2',
    new_row->>'address',
    new_row->>'city',
    new_row->>'postal_code',
    new_row->>'school',
    new_row->>'shirt_size',
    (new_row->>'siblings_in_club')::boolean,
    new_row->>'seasons_in_club',
    new_row->>'bank_account',
    new_row->>'comments',
    (new_row->>'accept_terms')::boolean,
    new_row->>'payment_type',
    (new_row->>'payment_amount')::numeric,
    new_row->>'payment_session_id',
    COALESCE(new_row->>'payment_status', 'completed'),
    COALESCE(new_row->>'estado', 'pendiente'),
    COALESCE(new_row->>'inscripcion_source', 'web'),
    COALESCE((new_row->>'created_at')::timestamp with time zone, NOW()),
    COALESCE((new_row->>'updated_at')::timestamp with time zone, NOW())
  ) RETURNING id INTO inserted_id;
  
  RETURN inserted_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error al insertar inscripción: %', SQLERRM;
    RAISE EXCEPTION 'Error al insertar inscripción: %', SQLERRM;
END;
$$;

-- Eliminar todas las funciones existentes primero para evitar errores de tipo
DROP FUNCTION IF EXISTS insert_inscripcio(jsonb);

-- Función para insertar una nueva inscripción usando RPC para saltarse RLS
-- Esta función permite guardar datos desde el frontend sin autenticación
-- pero con la estructura esperada
CREATE FUNCTION insert_inscripcio(new_row jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_row jsonb;
  inserted_id bigint;
BEGIN
  -- Insertar fila y obtener ID
  INSERT INTO public.inscripcions (
    player_name, birth_date, player_dni, health_card,
    team, parent_name, contact_phone1, contact_phone2,
    alt_contact, email1, email2, address, city, 
    postal_code, school, shirt_size, siblings_in_club,
    seasons_in_club, bank_account, comments, accept_terms,
    payment_session_id, payment_type, payment_amount,
    estado, inscripcion_source, updated_at, created_at
  )
  VALUES (
    new_row->>'player_name',
    (new_row->>'birth_date')::date,
    new_row->>'player_dni',
    new_row->>'health_card',
    new_row->>'team',
    new_row->>'parent_name',
    new_row->>'contact_phone1',
    new_row->>'contact_phone2',
    new_row->>'alt_contact',
    new_row->>'email1',
    new_row->>'email2',
    new_row->>'address',
    new_row->>'city',
    new_row->>'postal_code',
    new_row->>'school',
    new_row->>'shirt_size',
    (new_row->>'siblings_in_club')::boolean,
    (new_row->>'seasons_in_club')::integer,
    new_row->>'bank_account',
    new_row->>'comments',
    (new_row->>'accept_terms')::boolean,
    new_row->>'payment_session_id',
    new_row->>'payment_type',
    (new_row->>'payment_amount')::numeric,
    COALESCE(new_row->>'estado', 'pendiente'),
    COALESCE(new_row->>'inscripcion_source', 'web'),
    COALESCE((new_row->>'updated_at')::timestamp, NOW()),
    COALESCE((new_row->>'created_at')::timestamp, NOW())
  )
  RETURNING id INTO inserted_id;
  
  -- Convertir a JSON y devolver
  inserted_row := jsonb_build_object('id', inserted_id);
  RETURN inserted_row;
END;
$$;

-- Función minimalista para insertar solo los datos esenciales
-- Usa nombres de columna genéricos y tiene menos campos requeridos
DROP FUNCTION IF EXISTS insert_inscripcio_minimal(min_data jsonb);
CREATE OR REPLACE FUNCTION insert_inscripcio_minimal(min_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_row jsonb;
  inserted_id bigint;
  column_exists boolean;
BEGIN
  -- Insertar solo los datos esenciales
  INSERT INTO public.inscripcions (player_name, email1, contact_phone1)
  VALUES (
    min_data->>'player_name',
    min_data->>'email1',
    min_data->>'contact_phone1'
  )
  RETURNING id INTO inserted_id;
  
  -- Intentar actualizar algunos campos adicionales con un bloque protegido
  BEGIN
    -- Verificar si existe la columna 'payment_session_id'
    SELECT EXISTS (
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'inscripcions' 
      AND column_name = 'payment_session_id'
    ) INTO column_exists;
    
    -- Si existe, actualizar esta columna
    IF column_exists THEN
      UPDATE public.inscripcions 
      SET payment_session_id = min_data->>'payment_session_id'
      WHERE id = inserted_id;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Ignorar errores al actualizar campos adicionales
    RAISE NOTICE 'Error al actualizar campos adicionales: %', SQLERRM;
  END;
  
  -- Intentar actualizar el estado
  BEGIN
    -- Verificar si existe la columna 'estado'
    SELECT EXISTS (
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'inscripcions' 
      AND column_name = 'estado'
    ) INTO column_exists;
    
    -- Si existe, actualizar esta columna
    IF column_exists THEN
      UPDATE public.inscripcions 
      SET estado = 'pendiente'
      WHERE id = inserted_id;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Ignorar errores
    RAISE NOTICE 'Error al actualizar estado: %', SQLERRM;
  END;
  
  -- Devolver el ID insertado
  inserted_row := jsonb_build_object('id', inserted_id);
  RETURN inserted_row;
END;
$$;
