-- Script para verificar la estructura actual de la tabla inscripcions
-- Ejecutar esto en la consola SQL de Supabase para ver las columnas actuales

SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public' AND table_name = 'inscripcions'
ORDER BY ordinal_position;

-- También veamos las políticas RLS actuales
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename = 'inscripcions';
