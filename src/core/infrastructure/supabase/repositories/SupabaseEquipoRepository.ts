import { Equipo, EquipoDTO } from '../../../domain/models/Equipo';
import { EquipoRepository } from '../../../domain/repositories/EquipoRepository';
import { SupabaseClient } from '../SupabaseClient';
import { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

export class SupabaseEquipoRepository implements EquipoRepository {
  private supabase: SupabaseClientType;

  constructor() {
    this.supabase = SupabaseClient.getInstance().getClient();
  }

  async getAll(): Promise<Equipo[]> {
    const { data, error } = await this.supabase
      .from('equips')
      .select('*')
      .order('nom');

    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<Equipo | null> {
    const { data, error } = await this.supabase
      .from('equips')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getByTemporada(temporada: string): Promise<Equipo[]> {
    const { data, error } = await this.supabase
      .from('equips')
      .select('*')
      .eq('temporada', temporada)
      .order('categoria');

    if (error) throw error;
    return data || [];
  }

  async create(equipo: EquipoDTO): Promise<Equipo> {
    const { data, error } = await this.supabase
      .from('equips')
      .insert([equipo])
      .select();

    if (error) throw error;
    return data[0];
  }

  async update(id: number, equipo: EquipoDTO): Promise<Equipo> {
    const { data, error } = await this.supabase
      .from('equips')
      .update(equipo)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('equips')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
