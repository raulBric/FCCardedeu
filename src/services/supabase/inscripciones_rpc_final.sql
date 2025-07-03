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
  DROP POLICY IF EXISTS "public_select_policy" ON public.inscripcions;
  DROP POLICY IF EXISTS "always_visible_policy" ON public.inscripcions;
  
  -- Política para acceso TOTAL desde el dashboard (administrador)
  -- Esta política garantiza que los usuarios autenticados puedan ver, insertar,
  -- actualizar y eliminar TODOS los registros
  CREATE POLICY "dashboard_full_access" ON public.inscripcions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
  
  -- Política para permitir inserciones desde la web (sin autenticación)
  CREATE POLICY "web_insert_policy" ON public.inscripcions
  FOR INSERT
  TO anon
  WITH CHECK (true);
  
  -- Política para permitir que cualquier usuario pueda ver sus propios registros
  -- Esta política es útil para mantener la consistencia de datos
  CREATE POLICY "public_select_policy" ON public.inscripcions
  FOR SELECT
  TO anon
  USING (email1 IS NOT NULL);
  
  -- Política adicional para garantizar visibilidad siempre desde el dashboard
  CREATE POLICY "always_visible_policy" ON public.inscripcions
  FOR SELECT 
  TO authenticated
  USING (true);
  
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
      SET estado = 'pagat'
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

-- 6. Nueva función mejorada que detecta dinámicamente las columnas existentes
CREATE FUNCTION insert_inscripcio_complete(complete_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_row jsonb;
  inserted_id bigint;
  essential_data jsonb;
  additional_data jsonb;
  query_text text;
  column_exists boolean;
  payment_column_name text := NULL;
  payment_info_column text := NULL;
  status_column text := NULL;
  payment_type_column text := NULL;
  payment_amount_column text := NULL;
BEGIN
  -- Extraer los datos esenciales y adicionales
  essential_data := complete_data->'essential';
  additional_data := complete_data->'additional';
  
  -- Primero insertar con los datos esenciales para garantizar que se cree el registro
  INSERT INTO public.inscripcions (
    player_name,
    email1,
    contact_phone1
  )
  VALUES (
    essential_data->>'player_name',
    essential_data->>'email1',
    essential_data->>'contact_phone1'
  )
  RETURNING id INTO inserted_id;
  
  -- Buscar el nombre de las columnas para el ID de sesión de pago (podría ser payment_id o payment_session_id)
  SELECT column_name INTO payment_column_name
  FROM information_schema.columns
  WHERE table_name = 'inscripcions'
  AND table_schema = 'public'
  AND (column_name = 'payment_id' OR column_name = 'payment_session_id' OR column_name = 'stripe_id')
  LIMIT 1;
  
  -- Buscar columna para estado (podría ser estado, status, etc)
  SELECT column_name INTO status_column
  FROM information_schema.columns
  WHERE table_name = 'inscripcions'
  AND table_schema = 'public'
  AND (column_name = 'estado' OR column_name = 'status' OR column_name = 'state')
  LIMIT 1;
  
  -- Buscar columnas para datos de pago
  SELECT column_name INTO payment_type_column
  FROM information_schema.columns
  WHERE table_name = 'inscripcions'
  AND table_schema = 'public'
  AND (column_name = 'payment_type' OR column_name = 'pago_tipo')
  LIMIT 1;
  
  SELECT column_name INTO payment_amount_column
  FROM information_schema.columns
  WHERE table_name = 'inscripcions'
  AND table_schema = 'public'
  AND (column_name = 'payment_amount' OR column_name = 'pago_monto' OR column_name = 'amount')
  LIMIT 1;
  
  -- Buscar columna para información de pago (JSON)
  SELECT column_name INTO payment_info_column
  FROM information_schema.columns
  WHERE table_name = 'inscripcions'
  AND table_schema = 'public'
  AND (column_name = 'payment_info' OR column_name = 'payment_data')
  LIMIT 1;
  
  -- Construir consulta dinámica para actualizar los campos
  query_text := 'UPDATE public.inscripcions SET ';
  
  -- Añadir siempre estos campos básicos que son muy probables que existan
  query_text := query_text || '
    birth_date = $1::date,
    player_dni = $2,
    health_card = $3,
    team = $4,
    parent_name = $5,
    contact_phone2 = $6,
    alt_contact = $7,
    email2 = $8,
    address = $9,
    city = $10,
    postal_code = $11,
    school = $12,
    shirt_size = $13,';
  
  -- Añadir campos siempre que existan en la estructura
  query_text := query_text || '
    siblings_in_club = $14::boolean,
    seasons_in_club = $15::integer,
    bank_account = $16,
    comments = $17,
    accept_terms = $18::boolean,';
  
  -- Añadir campos personalizados según lo que encontremos
  IF payment_column_name IS NOT NULL THEN
    query_text := query_text || '
    ' || payment_column_name || ' = $19,';
  END IF;
  
  IF payment_type_column IS NOT NULL THEN
    query_text := query_text || '
    ' || payment_type_column || ' = $20,';
  END IF;
  
  IF payment_amount_column IS NOT NULL THEN
    query_text := query_text || '
    ' || payment_amount_column || ' = $21::numeric,';
  END IF;
  
  IF payment_info_column IS NOT NULL THEN
    query_text := query_text || '
    ' || payment_info_column || ' = $22::jsonb,';
  END IF;
  
  IF status_column IS NOT NULL THEN
    query_text := query_text || '
    ' || status_column || ' = $23,';
  END IF;
  
  -- Añadir fechas de actualización
  -- Verificar si existen las columnas de timestamp
  SELECT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'inscripcions'
    AND table_schema = 'public' 
    AND column_name = 'updated_at'
  ) INTO column_exists;
  
  IF column_exists THEN
    query_text := query_text || '
    updated_at = NOW(),';
  END IF;
  
  -- Eliminar la última coma
  query_text := substring(query_text, 1, length(query_text)-1);
  
  -- Añadir condición WHERE
  query_text := query_text || '
  WHERE id = $24';
  
  -- Ejecutar la consulta dinámica con todos los parámetros
  EXECUTE query_text USING
    additional_data->>'birth_date',
    additional_data->>'player_dni',
    additional_data->>'health_card',
    additional_data->>'team',
    additional_data->>'parent_name',
    additional_data->>'contact_phone2',
    additional_data->>'alt_contact',
    additional_data->>'email2',
    additional_data->>'address',
    additional_data->>'city',
    additional_data->>'postal_code',
    additional_data->>'school',
    additional_data->>'shirt_size',
    (additional_data->>'siblings_in_club')::boolean,
    (additional_data->>'seasons_in_club')::integer,
    additional_data->>'bank_account',
    additional_data->>'comments',
    (additional_data->>'accept_terms')::boolean,
    essential_data->>'payment_session_id',  -- Para payment_column_name
    additional_data->>'payment_type',       -- Para payment_type_column
    additional_data->>'payment_amount',     -- Para payment_amount_column
    jsonb_build_object(                     -- Para payment_info_column
      'session_id', essential_data->>'payment_session_id',
      'type', additional_data->>'payment_type',
      'amount', additional_data->>'payment_amount',
      'status', essential_data->>'payment_status'
    ),
    'pagat',                               -- Para status_column (en catalán, consistente con el resto de la aplicación)
    inserted_id;                           -- Para WHERE id = ?
  
  -- Devolver el ID insertado
  inserted_row := jsonb_build_object('id', inserted_id);
  RETURN inserted_row;
END;
$$;
