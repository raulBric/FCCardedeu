import { supabase } from '@/lib/supabaseClient';
import { IPatrocinadorRepository } from '@/core/domain/repositories/IPatrocinadorRepository';
import { Patrocinador, CreatePatrocinadorDTO, UpdatePatrocinadorDTO } from '@/core/domain/models/Patrocinador';

/**
 * Implementación del repositorio de patrocinadores con Supabase
 */
export class SupabasePatrocinadorRepository implements IPatrocinadorRepository {
  private readonly table = 'patrocinadores';

  async getAll(limit = 50, page = 0): Promise<Patrocinador[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .order('id', { ascending: true })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<Patrocinador | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No encontrado
      throw error;
    }

    return data;
  }

  async create(patrocinador: CreatePatrocinadorDTO): Promise<Patrocinador> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(patrocinador)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, patrocinador: UpdatePatrocinadorDTO): Promise<Patrocinador> {
    const { data, error } = await supabase
      .from(this.table)
      .update(patrocinador)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
