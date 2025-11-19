import { SupabaseClient } from "@supabase/supabase-js";

export interface Morador {
  cpf: string;
  nome: string;
  senha: string;
  apartamento: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PatchMorador {
  nome?: string;
  senha?: string;
  apartamento?: string;
}

class MoradorModel {
  constructor(public supabase_client: SupabaseClient) {}

  async insert(morador: Morador): Promise<Morador> {
    const { data, error } = await this.supabase_client
      .from('morador')
      .insert(morador)
      .select()
      .single();
    if (error) throw error;
    return data as Morador;
  }

  async get(cpf: string): Promise<Morador> {
    const { data, error } = await this.supabase_client
      .from('morador')
      .select('*')
      .eq('cpf', cpf)
      .single();
    if (error) throw error;
    return data as Morador;
  }

  async getByApartamento(apartamento: string): Promise<Morador[]> {
    const { data, error } = await this.supabase_client
      .from('morador')
      .select('*')
      .eq('apartamento', apartamento);
    if (error) throw error;
    return data as Morador[];
  }

  async patch(cpf: string, morador: PatchMorador): Promise<Morador> {
    const { data, error } = await this.supabase_client
      .from('morador')
      .update(morador)
      .eq('cpf', cpf)
      .select()
      .single();
    if (error) throw error;
    return data as Morador;
  }

  async delete(cpf: string): Promise<void> {
    const { error } = await this.supabase_client
      .from('morador')
      .delete()
      .eq('cpf', cpf);
    if (error) throw error;
  }
}

export default MoradorModel;