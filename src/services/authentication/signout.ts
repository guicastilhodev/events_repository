import { supabase } from '../../config/supabase';

interface SignoutResponse {
  success: boolean;
  data?: {
    message: string;
  };
  error?: {
    error: string;
    message: string;
    status: number;
  };
}

export class SignoutService {
  constructor() {}

  async execute(): Promise<SignoutResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Erro no logout do Supabase:', error);
      }

      return {
        success: true,
        data: {
          message: 'Logout realizado com sucesso'
        }
      };
    } catch (error) {
      console.error('Erro no signout:', error);
      return {
        success: false,
        error: {
          error: 'Erro interno do servidor',
          message: 'Erro ao fazer logout',
          status: 500
        }
      };
    }
  }
}