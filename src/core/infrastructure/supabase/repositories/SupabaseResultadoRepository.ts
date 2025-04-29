import { SupabaseClient } from '../SupabaseClient';
import { ResultadoRepository } from '../../../domain/repositories/ResultadoRepository';
import { Resultado, CreateResultadoDTO, UpdateResultadoDTO } from '../../../domain/models/Resultado';
import { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

export class SupabaseResultadoRepository implements ResultadoRepository {
  private supabase: SupabaseClientType;

  constructor() {
    this.supabase = SupabaseClient.getInstance().getClient();
  }

  async getAll(limit = 50, page = 0): Promise<Resultado[]> {
    const { data, error } = await this.supabase
      .from('resultados')
      .select('*')
      .order('fecha', { ascending: false })
      .range(page * limit, page * limit + limit - 1);

    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<Resultado | null> {
    const { data, error } = await this.supabase
      .from('resultados')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(dto: CreateResultadoDTO): Promise<Resultado> {
    const { data, error } = await this.supabase
      .from('resultados')
      .insert([dto])
      .select();

    if (error) throw error;
    return data[0];
  }

  async update(id: number, dto: UpdateResultadoDTO): Promise<Resultado> {
    const { data, error } = await this.supabase
      .from('resultados')
      .update(dto)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('resultados')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
