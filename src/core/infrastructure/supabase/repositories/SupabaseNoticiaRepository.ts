import { SupabaseClient } from '../SupabaseClient';
import { NoticiaRepository } from '../../../domain/repositories/NoticiaRepository';
import { Noticia, CreateNoticiaDTO, UpdateNoticiaDTO } from '../../../domain/models/Noticia';
import { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

export class SupabaseNoticiaRepository implements NoticiaRepository {
  private supabase: SupabaseClientType;

  constructor() {
    this.supabase = SupabaseClient.getInstance().getClient();
  }

  async getAll(limit = 50, page = 0): Promise<Noticia[]> {
    const { data, error } = await this.supabase
      .from('noticias')
      .select('*')
      .order('fecha', { ascending: false })
      .range(page * limit, page * limit + limit - 1);

    if (error) throw error;
    return data || [];
  }

  async getDestacadas(limit = 4): Promise<Noticia[]> {
    const { data, error } = await this.supabase
      .from('noticias')
      .select('*')
      .eq('destacada', true)
      .order('fecha', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<Noticia | null> {
    const { data, error } = await this.supabase
      .from('noticias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(dto: CreateNoticiaDTO): Promise<Noticia> {
    // Eliminar claves con undefined o null para evitar errores 400
    const cleanDto: Record<string, unknown> = {};
    Object.entries(dto).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        cleanDto[k] = v;
      }
    });

    const { data, error } = await this.supabase
      .from('noticias')
      .insert([cleanDto])
      .select()
      .single();

    if (error) throw error;
    return data as Noticia;
  }

  async update(id: number, dto: UpdateNoticiaDTO): Promise<Noticia> {
    const { data, error } = await this.supabase
      .from('noticias')
      .update(dto)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async delete(id: number): Promise<void> {
    // 1. Obtener la URL de la imagen antes de eliminar la fila
    const { data: noticia, error: fetchError } = await this.supabase
      .from('noticias')
      .select('imagen_url')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // 2. Eliminar la fila de la tabla
    const { error: deleteError } = await this.supabase
      .from('noticias')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // 3. Si existe imagen asociada, eliminarla del bucket 'noticies'
    if (noticia?.imagen_url) {
      try {
        const match = noticia.imagen_url.match(/\/object\/public\/noticies\/(.+)$/);
        const pathInBucket = match?.[1];

        if (pathInBucket) {
          const { error: storageError } = await this.supabase.storage
            .from('noticies')
            .remove([pathInBucket]);

          if (storageError) {
            // Loggear, pero no lanzar excepción para no bloquear el flujo
            console.error('Error al eliminar la imagen del storage:', storageError.message);
          }
        }
      } catch (err) {
        console.error('Ocurrió un error al intentar borrar la imagen asociada:', err);
      }
    }
  }
}
