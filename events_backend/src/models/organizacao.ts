import { SupabaseClient } from "@supabase/supabase-js";

export interface Organizacao {
  cpf_organizador: string;
  id_evento: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface PatchOrganizacao {
  id_evento?: number;
}

class OrganizacaoModel {
  constructor(public supabase_client: SupabaseClient) {}

  async insert(organizacao: Organizacao): Promise<Organizacao> {
    const { data, error } = await this.supabase_client
      .from('organizacao')
      .insert(organizacao)
      .select()
      .single();
    if (error) throw error;
    return data as Organizacao;
  }

  async get(cpf_organizador: string): Promise<Organizacao[]> {
    const { data, error } = await this.supabase_client
      .from('organizacao')
      .select('*')
      .eq('cpf_organizador', cpf_organizador);
    if (error) throw error;
    return data as Organizacao[];
  }

  async getByEvento(id_evento: number): Promise<Organizacao[]> {
    const { data, error } = await this.supabase_client
      .from('organizacao')
      .select('*')
      .eq('id_evento', id_evento);
    if (error) throw error;
    return data as Organizacao[];
  }

  async delete(cpf_organizador: string, id_evento: number): Promise<void> {
    const { error } = await this.supabase_client
      .from('organizacao')
      .delete()
      .eq('cpf_organizador', cpf_organizador)
      .eq('id_evento', id_evento);
    if (error) throw error;
  }
}

export default OrganizacaoModel;