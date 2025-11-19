import { SupabaseClient } from "@supabase/supabase-js";

export interface TipoInscricaoStatus {
  id_tipo_inscricao_status: number;
  nome_status: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PatchTipoInscricaoStatus {
  nome_status?: string;
}

class TipoInscricaoStatusModel {
  constructor(public supabase_client: SupabaseClient) {}

  async insert(tipoStatus: TipoInscricaoStatus): Promise<TipoInscricaoStatus> {
    const { data, error } = await this.supabase_client
      .from('tipo_inscricao_status')
      .insert(tipoStatus)
      .select()
      .single();
    if (error) throw error;
    return data as TipoInscricaoStatus;
  }

  async get(id: number): Promise<TipoInscricaoStatus> {
    const { data, error } = await this.supabase_client
      .from('tipo_inscricao_status')
      .select('*')
      .eq('id_tipo_inscricao_status', id)
      .single();
    if (error) throw error;
    return data as TipoInscricaoStatus;
  }

  async getAll(): Promise<TipoInscricaoStatus[]> {
    const { data, error } = await this.supabase_client
      .from('tipo_inscricao_status')
      .select('*');
    if (error) throw error;
    return data as TipoInscricaoStatus[];
  }

  async patch(id: number, tipoStatus: PatchTipoInscricaoStatus): Promise<TipoInscricaoStatus> {
    const { data, error } = await this.supabase_client
      .from('tipo_inscricao_status')
      .update(tipoStatus)
      .eq('id_tipo_inscricao_status', id)
      .select()
      .single();
    if (error) throw error;
    return data as TipoInscricaoStatus;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase_client
      .from('tipo_inscricao_status')
      .delete()
      .eq('id_tipo_inscricao_status', id);
    if (error) throw error;
  }
}

export default TipoInscricaoStatusModel;