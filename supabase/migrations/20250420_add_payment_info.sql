-- Añadir columna payment_info a inscripcions
ALTER TABLE public.inscripcions 
ADD COLUMN IF NOT EXISTS payment_info JSONB;

-- Crear función para añadir la columna desde RPC
CREATE OR REPLACE FUNCTION create_payment_info_column()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si la columna existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'inscripcions' 
    AND column_name = 'payment_info'
  ) THEN
    -- Añadir la columna
    ALTER TABLE public.inscripcions 
    ADD COLUMN payment_info JSONB;
  END IF;
END;
$$;

-- Mejorar la función de actualización de inscripciones para incluir payment_info
CREATE OR REPLACE FUNCTION actualizar_inscripcion(
  inscripcion_id INT, 
  nuevo_estado TEXT, 
  nuevo_processed BOOLEAN,
  nueva_payment_info JSONB DEFAULT NULL
)
RETURNS SETOF inscripcions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_inscripcion inscripcions;
BEGIN
  IF auth.role() = 'authenticated' OR auth.role() = 'anon' THEN
    -- Actualizar la inscripción
    IF nueva_payment_info IS NULL THEN
      UPDATE public.inscripcions 
      SET estado = nuevo_estado, 
          processed = nuevo_processed
      WHERE id = inscripcion_id
      RETURNING * INTO v_inscripcion;
    ELSE
      UPDATE public.inscripcions 
      SET estado = nuevo_estado, 
          processed = nuevo_processed,
          payment_info = nueva_payment_info
      WHERE id = inscripcion_id
      RETURNING * INTO v_inscripcion;
    END IF;
    
    -- Devolver el registro actualizado
    RETURN NEXT v_inscripcion;
  ELSE
    RAISE EXCEPTION 'No autorizado para actualizar inscripciones';
  END IF;
END;
$$;
