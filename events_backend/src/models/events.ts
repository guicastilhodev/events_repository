import { SupabaseClient } from "@supabase/supabase-js";

export interface Evento {
  id_evento?: number;
  titulo: string;
  descricao: string;
  vagas: number;
  local: string;
  data_inicio: Date;
  data_fim: Date;
  status_aprovacao: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface PatchEvento {
  titulo?: string;
  descricao?: string;
  vagas?: number;
  local?: string;
  data_inicio?: Date;
  data_fim?: Date;
  status_aprovacao?: number;
}

class EventoModel {
  constructor(public supabase_client: SupabaseClient) {}

  async insert(evento: Evento): Promise<Evento> {
    const { data, error } = await this.supabase_client
      .from('evento')
      .insert(evento)
      .select()
      .single();
    if (error) throw error;
    return data as Evento;
  }

  async get(id: number): Promise<Evento> {
    const { data, error } = await this.supabase_client
      .from('evento')
      .select('*')
      .eq('id_evento', id)
      .single();
    if (error) throw error;
    return data as Evento;
  }

  async getAll(): Promise<Evento[]> {
    const { data, error } = await this.supabase_client
      .from('evento')
      .select('*')
      .order('data_inicio', { ascending: true });
    if (error) throw error;
    return data as Evento[];
  }

  async getByStatus(status: number): Promise<Evento[]> {
    const { data, error } = await this.supabase_client
      .from('evento')
      .select('*')
      .eq('status_aprovacao', status)
      .order('data_inicio', { ascending: true });
    if (error) throw error;
    return data as Evento[];
  }

  async patch(id: number, evento: PatchEvento): Promise<Evento> {
    const { data, error } = await this.supabase_client
      .from('evento')
      .update(evento)
      .eq('id_evento', id)
      .select()
      .single();
    if (error) throw error;
    return data as Evento;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase_client
      .from('evento')
      .delete()
      .eq('id_evento', id);
    if (error) throw error;
  }
}

export default EventoModel;
