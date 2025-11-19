import { SupabaseClient } from "@supabase/supabase-js";

export interface Sindico {
  cpf: string;
  nome: string;
  senha: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PatchSindico {
  nome?: string;
  senha?: string;
}

class SindicoModel {
  constructor(public supabase_client: SupabaseClient) {}

  async insert(sindico: Sindico): Promise<Sindico> {
    const { data, error } = await this.supabase_client
      .from('sindico')
      .insert(sindico)
      .select()
      .single();
    if (error) throw error;
    return data as Sindico;
  }

  async get(cpf: string): Promise<Sindico> {
    const { data, error } = await this.supabase_client
      .from('sindico')
      .select('*')
      .eq('cpf', cpf)
      .single();
    if (error) throw error;
    return data as Sindico;
  }

  async patch(cpf: string, sindico: PatchSindico): Promise<Sindico> {
    const { data, error } = await this.supabase_client
      .from('sindico')
      .update(sindico)
      .eq('cpf', cpf)
      .select()
      .single();
    if (error) throw error;
    return data as Sindico;
  }

  async delete(cpf: string): Promise<void> {
    const { error } = await this.supabase_client
      .from('sindico')
      .delete()
      .eq('cpf', cpf);
    if (error) throw error;
  }
}

export default SindicoModel;