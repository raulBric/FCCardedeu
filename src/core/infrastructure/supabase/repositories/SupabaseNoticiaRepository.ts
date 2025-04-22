import { SupabaseClient } from '../SupabaseClient';
import { NoticiaRepository } from '../../../domain/repositories/NoticiaRepository';
import { Noticia, CreateNoticiaDTO, UpdateNoticiaDTO } from '../../../domain/models/Noticia';

export class SupabaseNoticiaRepository implements NoticiaRepository {
  private supabase: any;

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
    const { data, error } = await this.supabase
      .from('noticias')
      .insert([dto])
      .select();

    if (error) throw error;
    return data[0];
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
    const { error } = await this.supabase
      .from('noticias')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
