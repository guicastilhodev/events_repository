import { SupabaseClient } from "@supabase/supabase-js";

export interface TipoStatusAprovacao {
  id_tipo_status_aprovacao: number;
  nome_status_aprovacao: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PatchTipoStatusAprovacao {
  nome_status_aprovacao?: string;
}

class TipoStatusAprovacaoModel {
  constructor(public supabase_client: SupabaseClient) {}

  async insert(tipoStatus: TipoStatusAprovacao): Promise<TipoStatusAprovacao> {
    const { data, error } = await this.supabase_client
      .from('tipo_status_aprovacao')
      .insert(tipoStatus)
      .select()
      .single();
    if (error) throw error;
    return data as TipoStatusAprovacao;
  }

  async get(id: number): Promise<TipoStatusAprovacao> {
    const { data, error } = await this.supabase_client
      .from('tipo_status_aprovacao')
      .select('*')
      .eq('id_tipo_status_aprovacao', id)
      .single();
    if (error) throw error;
    return data as TipoStatusAprovacao;
  }

  async getAll(): Promise<TipoStatusAprovacao[]> {
    const { data, error } = await this.supabase_client
      .from('tipo_status_aprovacao')
      .select('*');
    if (error) throw error;
    return data as TipoStatusAprovacao[];
  }

  async patch(id: number, tipoStatus: PatchTipoStatusAprovacao): Promise<TipoStatusAprovacao> {
    const { data, error } = await this.supabase_client
      .from('tipo_status_aprovacao')
      .update(tipoStatus)
      .eq('id_tipo_status_aprovacao', id)
      .select()
      .single();
    if (error) throw error;
    return data as TipoStatusAprovacao;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase_client
      .from('tipo_status_aprovacao')
      .delete()
      .eq('id_tipo_status_aprovacao', id);
    if (error) throw error;
  }
}

export default TipoStatusAprovacaoModel;