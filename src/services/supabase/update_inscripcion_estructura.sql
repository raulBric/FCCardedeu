-- Script para actualizar la estructura de la tabla inscripcions
-- Primero verificamos si la columna estado existe
DO $$
BEGIN
  -- Verificar si la columna estado ya existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'inscripcions' 
    AND column_name = 'estado'
  ) THEN
    -- Si no existe, la creamos con valor por defecto 'pendiente'
    EXECUTE 'ALTER TABLE public.inscripcions ADD COLUMN estado text NOT NULL DEFAULT ''pendiente''';
    RAISE NOTICE 'Columna estado añadida a la tabla inscripcions';
  ELSE
    RAISE NOTICE 'La columna estado ya existe en la tabla inscripcions';
  END IF;

  -- Verificar si la columna processed ya existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'inscripcions' 
    AND column_name = 'processed'
  ) THEN
    -- Si no existe, la creamos con valor por defecto false
    EXECUTE 'ALTER TABLE public.inscripcions ADD COLUMN processed boolean NOT NULL DEFAULT false';
    RAISE NOTICE 'Columna processed añadida a la tabla inscripcions';
  ELSE
    RAISE NOTICE 'La columna processed ya existe en la tabla inscripcions';
  END IF;

  -- Verificar si la columna payment_info ya existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'inscripcions' 
    AND column_name = 'payment_info'
  ) THEN
    -- Si no existe, la creamos como JSONB
    EXECUTE 'ALTER TABLE public.inscripcions ADD COLUMN payment_info jsonb';
    RAISE NOTICE 'Columna payment_info añadida a la tabla inscripcions';
  ELSE
    RAISE NOTICE 'La columna payment_info ya existe en la tabla inscripcions';
  END IF;
END $$;
