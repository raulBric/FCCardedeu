import { Jugador, JugadorDTO, JugadorEquip } from '../../../domain/models/Jugador';
import { JugadorRepository } from '../../../domain/repositories/JugadorRepository';
import { SupabaseClient } from '../SupabaseClient';

export class SupabaseJugadorRepository implements JugadorRepository {
  private supabase: any;

  constructor() {
    this.supabase = SupabaseClient.getInstance().getClient();
  }

  async getAll(): Promise<Jugador[]> {
    const { data, error } = await this.supabase
      .from('jugadors')
      .select('*')
      .order('nom, cognoms');

    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<Jugador | null> {
    const { data, error } = await this.supabase
      .from('jugadors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getByEquipo(equipoId: number, temporada?: string): Promise<Jugador[]> {
    // Obtener IDs de jugadores en el equipo para la temporada especificada
    const { data: jugadorEquipData, error: jugadorEquipError } = await this.supabase
      .from('jugador_equip')
      .select('jugador_id')
      .eq('equip_id', equipoId)
      .eq('temporada', temporada || '2024-2025');

    if (jugadorEquipError) throw jugadorEquipError;
    
    if (!jugadorEquipData || jugadorEquipData.length === 0) {
      return [];
    }
    
    // Extraer los IDs
    const jugadorIds = jugadorEquipData.map(je => je.jugador_id);
    
    // Obtener los jugadores
    const { data, error } = await this.supabase
      .from('jugadors')
      .select('*')
      .in('id', jugadorIds)
      .order('nom, cognoms');

    if (error) throw error;
    return data || [];
  }

  async create(jugador: JugadorDTO): Promise<Jugador> {
    const { data, error } = await this.supabase
      .from('jugadors')
      .insert([jugador])
      .select();

    if (error) throw error;
    return data[0];
  }

  async update(id: number, jugador: JugadorDTO): Promise<Jugador> {
    const { data, error } = await this.supabase
      .from('jugadors')
      .update(jugador)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('jugadors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async asignarEquipo(
    jugadorId: number, 
    equipoId: number, 
    temporada: string, 
    dorsal?: string, 
    posicio?: string
  ): Promise<JugadorEquip> {
    // Verificar si ya existe la relación
    const { data: existing, error: existingError } = await this.supabase
      .from('jugador_equip')
      .select('*')
      .eq('jugador_id', jugadorId)
      .eq('equip_id', equipoId)
      .eq('temporada', temporada)
      .maybeSingle();
    
    if (existingError) throw existingError;
    
    // Si ya existe, actualizar
    if (existing) {
      const updateData: any = {};
      if (dorsal) updateData.dorsal = dorsal;
      if (posicio) updateData.posicio = posicio;
      
      // Solo actualizar si hay algo que cambiar
      if (Object.keys(updateData).length > 0) {
        const { data, error } = await this.supabase
          .from('jugador_equip')
          .update(updateData)
          .eq('id', existing.id)
          .select();
        
        if (error) throw error;
        return data[0];
      }
      
      return existing;
    }
    
    // Si no existe, crear la relación
    const { data, error } = await this.supabase
      .from('jugador_equip')
      .insert([{
        jugador_id: jugadorId,
        equip_id: equipoId,
        temporada,
        dorsal,
        posicio
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async removerDeEquipo(jugadorId: number, equipoId: number, temporada: string): Promise<void> {
    const { error } = await this.supabase
      .from('jugador_equip')
      .delete()
      .eq('jugador_id', jugadorId)
      .eq('equip_id', equipoId)
      .eq('temporada', temporada);
    
    if (error) throw error;
  }

  async getEquipos(jugadorId: number): Promise<JugadorEquip[]> {
    const { data, error } = await this.supabase
      .from('jugador_equip')
      .select(`
        *,
        equip:equip_id (
          id,
          nom,
          categoria,
          temporada
        )
      `)
      .eq('jugador_id', jugadorId)
      .order('temporada', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}
