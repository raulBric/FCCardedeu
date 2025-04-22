// Utilidades para la generación de slugs consistentes en la aplicación

/**
 * Genera un slug SEO-friendly a partir de un título y un ID
 * @param titulo - El título del artículo o elemento
 * @param id - El ID numérico del elemento (para garantizar unicidad)
 * @returns Un slug formateado para URLs amigables
 */
export function generarSlug(titulo: string, id: number): string {
  // Normalizar texto: convertir acentos y caracteres especiales a sus equivalentes ASCII
  const tituloNormalizado = titulo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .toLowerCase();
  
  // Convertir espacios y caracteres especiales a guiones, limitar caracteres permitidos
  const slugTexto = tituloNormalizado
    .replace(/[^a-z0-9\s-]/g, '') // Solo permitir letras, números, espacios y guiones
    .replace(/\s+/g, '-')         // Convertir espacios a guiones
    .replace(/-+/g, '-')          // Evitar guiones múltiples
    .replace(/^-+|-+$/g, '');     // Eliminar guiones al inicio o final
  
  // Limitar la longitud para que sea manejable (50 caracteres máximo para el título)
  const slugLimitado = slugTexto.slice(0, 50).replace(/-+$/g, '');
  
  // Formato final: [slug-del-titulo]-[id]
  return `${slugLimitado}-${id}`;
}

/**
 * Extrae el ID desde un slug generado con la función generarSlug
 * @param slug - El slug de la URL
 * @returns El ID numérico extraído del slug
 */
export function obtenerIdDesdeSlug(slug: string): number | null {
  try {
    // Extraer el último segmento después del último guión
    const idStr = slug.split('-').pop();
    if (idStr && /^\d+$/.test(idStr)) {
      return parseInt(idStr);
    }
    
    // Si no se encuentra un patrón válido, intentar buscar cualquier número
    const matches = slug.match(/\d+/);
    if (matches && matches.length > 0) {
      return parseInt(matches[0]);
    }
    
    return null;
  } catch (error) {
    console.error("Error al obtener ID desde slug:", error);
    return null;
  }
}
