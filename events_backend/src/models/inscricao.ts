import { SupabaseClient } from "@supabase/supabase-js";

export interface Inscricao {
  cpf_morador: string;
  id_evento: number;
  status: number;
  data_inscricao: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface PatchInscricao {
  status?: number;
}

class InscricaoModel {
  constructor(public supabase_client: SupabaseClient) {}

  async insert(inscricao: Inscricao): Promise<Inscricao> {
    const { data, error } = await this.supabase_client
      .from('inscricao')
      .insert(inscricao)
      .select()
      .single();
    if (error) throw error;
    return data as Inscricao;
  }

  async get(cpf_morador: string, id_evento: number): Promise<Inscricao> {
    const { data, error } = await this.supabase_client
      .from('inscricao')
      .select('*')
      .eq('cpf_morador', cpf_morador)
      .eq('id_evento', id_evento)
      .single();
    if (error) throw error;
    return data as Inscricao;
  }

  async getByEvento(id_evento: number): Promise<Inscricao[]> {
    const { data, error } = await this.supabase_client
      .from('inscricao')
      .select('*')
      .eq('id_evento', id_evento);
    if (error) throw error;
    return data as Inscricao[];
  }

  async getByMorador(cpf_morador: string): Promise<Inscricao[]> {
    const { data, error } = await this.supabase_client
      .from('inscricao')
      .select('*')
      .eq('cpf_morador', cpf_morador);
    if (error) throw error;
    return data as Inscricao[];
  }

  async patch(cpf_morador: string, id_evento: number, inscricao: PatchInscricao): Promise<Inscricao> {
    const { data, error } = await this.supabase_client
      .from('inscricao')
      .update(inscricao)
      .eq('cpf_morador', cpf_morador)
      .eq('id_evento', id_evento)
      .select()
      .single();
    if (error) throw error;
    return data as Inscricao;
  }

  async delete(cpf_morador: string, id_evento: number): Promise<void> {
    const { error } = await this.supabase_client
      .from('inscricao')
      .delete()
      .eq('cpf_morador', cpf_morador)
      .eq('id_evento', id_evento);
    if (error) throw error;
  }
}

export default InscricaoModel;