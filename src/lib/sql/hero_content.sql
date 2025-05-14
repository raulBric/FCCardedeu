-- Crear tabla para contenido de la portada (hero)
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT,
  cta_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear políticas RLS para proteger la tabla
-- Solo los usuarios autenticados pueden ver el contenido del hero
CREATE POLICY "Contenido del hero visible para todos" 
  ON hero_content FOR SELECT USING (true);

-- Solo los usuarios autenticados pueden gestionar el contenido
CREATE POLICY "Solo usuarios autenticados pueden insertar" 
  ON hero_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo usuarios autenticados pueden actualizar" 
  ON hero_content FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo usuarios autenticados pueden eliminar" 
  ON hero_content FOR DELETE USING (auth.role() = 'authenticated');

-- Añadir comentarios a la tabla
COMMENT ON TABLE hero_content IS 'Contenido para la sección de portada (hero) de la página principal';
COMMENT ON COLUMN hero_content.id IS 'Identificador único del elemento';
COMMENT ON COLUMN hero_content.title IS 'Título principal del hero';
COMMENT ON COLUMN hero_content.subtitle IS 'Subtítulo o descripción complementaria';
COMMENT ON COLUMN hero_content.image_url IS 'URL de la imagen de fondo';
COMMENT ON COLUMN hero_content.cta_text IS 'Texto para el botón de llamada a la acción';
COMMENT ON COLUMN hero_content.cta_url IS 'URL a la que dirigirá el botón';
COMMENT ON COLUMN hero_content.active IS 'Indica si este elemento está activo para mostrarse';
COMMENT ON COLUMN hero_content.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN hero_content.updated_at IS 'Fecha de última actualización';

-- Disparador para actualizar la fecha de modificación automáticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON hero_content
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
