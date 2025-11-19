import { supabase } from '../../config/supabase';

interface RecoverPasswordData {
  email: string;
}

interface RecoverPasswordResponse {
  success: boolean;
  data?: {
    message: string;
    info: string;
  };
  error?: {
    error: string;
    message: string;
    status: number;
  };
}

export class RecoverPasswordService {
  private recoverData: RecoverPasswordData;

  constructor(recoverData: RecoverPasswordData) {
    this.recoverData = recoverData;
  }

  async execute(): Promise<RecoverPasswordResponse> {
    try {
      const { email } = this.recoverData;

      if (!email) {
        return {
          success: false,
          error: {
            error: 'Email obrigatório',
            message: 'Forneça o email para recuperação de senha',
            status: 400
          }
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
      });

      if (error) {
        return {
          success: false,
          error: {
            error: 'Erro ao enviar email',
            message: error.message,
            status: 400
          }
        };
      }

      return {
        success: true,
        data: {
          message: 'Email de recuperação enviado com sucesso',
          info: 'Verifique sua caixa de entrada e siga as instruções do email'
        }
      };
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return {
        success: false,
        error: {
          error: 'Erro interno do servidor',
          message: 'Erro ao enviar email de recuperação',
          status: 500
        }
      };
    }
  }
}