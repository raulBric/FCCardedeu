import { Entrenador, EntrenadorDTO, EntrenadorEquip } from '../../../domain/models/Entrenador';
import { EntrenadorRepository } from '../../../domain/repositories/EntrenadorRepository';
import { SupabaseClient } from '../SupabaseClient';

export class SupabaseEntrenadorRepository implements EntrenadorRepository {
  private supabase: any;

  constructor() {
    this.supabase = SupabaseClient.getInstance().getClient();
  }

  async getAll(): Promise<Entrenador[]> {
    const { data, error } = await this.supabase
      .from('entrenadors')
      .select('*')
      .order('nom, cognom');

    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<Entrenador | null> {
    const { data, error } = await this.supabase
      .from('entrenadors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getByEquipo(equipoId: number, temporada?: string): Promise<Entrenador[]> {
    // Obtener IDs de entrenadores en el equipo para la temporada especificada
    const { data: entrenadorEquipData, error: entrenadorEquipError } = await this.supabase
      .from('entrenador_equip')
      .select('entrenador_id')
      .eq('equip_id', equipoId)
      .eq('temporada', temporada || '2024-2025');

    if (entrenadorEquipError) throw entrenadorEquipError;
    
    if (!entrenadorEquipData || entrenadorEquipData.length === 0) {
      return [];
    }
    
    // Extraer los IDs
    const entrenadorIds = entrenadorEquipData.map((ee: { entrenador_id: number }) => ee.entrenador_id);
    
    // Obtener los entrenadores
    const { data, error } = await this.supabase
      .from('entrenadors')
      .select('*')
      .in('id', entrenadorIds)
      .order('nom, cognom');

    if (error) throw error;
    return data || [];
  }

  async create(entrenador: EntrenadorDTO): Promise<Entrenador> {
    const { data, error } = await this.supabase
      .from('entrenadors')
      .insert([entrenador])
      .select();

    if (error) throw error;
    return data[0];
  }

  async update(id: number, entrenador: EntrenadorDTO): Promise<Entrenador> {
    const { data, error } = await this.supabase
      .from('entrenadors')
      .update(entrenador)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('entrenadors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async asignarEquipo(
    entrenadorId: number, 
    equipoId: number,
    rol: 'principal' | 'segon' | 'tercer' | 'delegat',
    temporada: string
  ): Promise<EntrenadorEquip> {
    // Verificar si ya existe la relación
    const { data: existing, error: existingError } = await this.supabase
      .from('entrenador_equip')
      .select('*')
      .eq('entrenador_id', entrenadorId)
      .eq('equip_id', equipoId)
      .eq('temporada', temporada)
      .maybeSingle();
    
    if (existingError) throw existingError;
    
    // Si ya existe, actualizar
    if (existing) {
      const { data, error } = await this.supabase
        .from('entrenador_equip')
        .update({ rol })
        .eq('id', existing.id)
        .select();
      
      if (error) throw error;
      return data[0];
    }
    
    // Si no existe, crear la relación
    const { data, error } = await this.supabase
      .from('entrenador_equip')
      .insert([{
        entrenador_id: entrenadorId,
        equip_id: equipoId,
        rol,
        temporada
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async removerDeEquipo(entrenadorId: number, equipoId: number, temporada: string): Promise<void> {
    const { error } = await this.supabase
      .from('entrenador_equip')
      .delete()
      .eq('entrenador_id', entrenadorId)
      .eq('equip_id', equipoId)
      .eq('temporada', temporada);
    
    if (error) throw error;
  }

  async getEquipos(entrenadorId: number): Promise<EntrenadorEquip[]> {
    const { data, error } = await this.supabase
      .from('entrenador_equip')
      .select(`
        *,
        equip:equip_id (
          id,
          nom,
          categoria,
          temporada
        )
      `)
      .eq('entrenador_id', entrenadorId)
      .order('temporada', { ascending: false });
    
    if (error) throw error;
    
    // Transformar resultados para incluir el nombre del equipo directamente
    const equiposConNombre = (data || []).map((item: EntrenadorEquip) => {
      return {
        ...item,
        equipo_nombre: item.equip?.nom || ''
      };
    });
    
    return equiposConNombre;
  }
}
