-- Script SQL corregido para configurar funciones RPC en Supabase
-- Este script elimina primero todas las funciones para evitar conflictos de tipos

-- 1. Eliminar todas las funciones existentes
DROP FUNCTION IF EXISTS check_table_exists(text);
DROP FUNCTION IF EXISTS create_inscripcions_table();
DROP FUNCTION IF EXISTS ensure_inscripciones_access();
DROP FUNCTION IF EXISTS insert_inscripcio(jsonb);
DROP FUNCTION IF EXISTS insert_inscripcio_minimal(jsonb);
DROP FUNCTION IF EXISTS insert_inscripcio_complete(jsonb);

-- 2. Funciones de gestión de tabla
-- Función para verificar si la tabla existe
CREATE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = $1
  );
END;
$$;

-- Función para crear la tabla inscripcions si no existe
CREATE FUNCTION create_inscripcions_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si la tabla existe
  IF NOT (SELECT check_table_exists('inscripcions')) THEN
    -- Crear la tabla
    CREATE TABLE public.inscripcions (
      id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      player_name text NOT NULL,
      birth_date date,
      player_dni text,
      health_card text,
      team text,
      parent_name text,
      contact_phone1 text,
      contact_phone2 text,
      alt_contact text,
      email1 text NOT NULL,
      email2 text,
      address text,
      city text,
      postal_code text,
      school text,
      shirt_size text,
      siblings_in_club boolean DEFAULT false,
      seasons_in_club integer DEFAULT 0,
      bank_account text,
      comments text,
      accept_terms boolean DEFAULT false,
      payment_session_id text,
      payment_type text,
      payment_amount numeric(10,2),
      estado text DEFAULT 'pendiente',
      inscripcion_source text DEFAULT 'web',
      updated_at timestamp with time zone DEFAULT now(),
      created_at timestamp with time zone DEFAULT now()
    );

    -- Habilitar RLS
    ALTER TABLE public.inscripcions ENABLE ROW LEVEL SECURITY;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al crear tabla inscripcions: %', SQLERRM;
END;
$$;

-- 3. Función para configurar políticas de acceso
CREATE FUNCTION ensure_inscripciones_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Primero eliminamos políticas existentes para no tener duplicados
  DROP POLICY IF EXISTS "dashboard_full_access" ON public.inscripcions;
  DROP POLICY IF EXISTS "web_insert_policy" ON public.inscripcions;
  
  -- Política para acceso desde el dashboard (administrador)
  CREATE POLICY "dashboard_full_access" ON public.inscripcions
  FOR ALL
  TO authenticated
  USING (true);
  
  -- Política para permitir inserciones desde la web (sin autenticación)
  CREATE POLICY "web_insert_policy" ON public.inscripcions
  FOR INSERT
  TO anon
  WITH CHECK (true);
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al configurar políticas RLS: %', SQLERRM;
END;
$$;

-- 4. Función completa de inserción de inscripciones
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

-- 5. Función minimalista para insertar solo los datos esenciales
CREATE FUNCTION insert_inscripcio_minimal(min_data jsonb)
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
  
  -- Intentar actualizar campos adicionales si existen
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
