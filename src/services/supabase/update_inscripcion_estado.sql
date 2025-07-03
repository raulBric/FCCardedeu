    -- Función RPC para actualizar el estado de una inscripción
    CREATE OR REPLACE FUNCTION update_inscripcion_estado(
    p_id int8, 
    p_estado text, 
    p_processed boolean,
    p_payment_info jsonb
    )
    RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
    updated_row jsonb;
    BEGIN
    -- Actualizar el estado de la inscripción
    UPDATE public.inscripcions 
    SET 
        estado = p_estado,
        processed = p_processed,
        payment_info = p_payment_info,
        updated_at = NOW()
    WHERE id = p_id;
    
    -- Verificar si se actualizó correctamente
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la inscripción con id %', p_id;
    END IF;
    
    -- Obtener la fila actualizada
    SELECT jsonb_build_object(
        'id', id,
        'estado', estado,
        'processed', processed,
        'payment_info', payment_info,
        'updated_at', updated_at
    ) INTO updated_row
    FROM public.inscripcions
    WHERE id = p_id;
    
    RETURN updated_row;
    EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
        'error', SQLERRM,
        'error_detail', SQLSTATE
        );
    END;
    $$;

    -- Otorgar permisos de ejecución a los usuarios autenticados
    GRANT EXECUTE ON FUNCTION update_inscripcion_estado TO authenticated;
