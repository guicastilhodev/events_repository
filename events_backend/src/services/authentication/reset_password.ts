import { supabaseAdmin } from '../../config/supabase';

interface ResetPasswordData {
  accessToken: string;
  newPassword: string;
}

interface ResetPasswordResponse {
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

export class ResetPasswordService {
  private resetData: ResetPasswordData;

  constructor(resetData: ResetPasswordData) {
    this.resetData = resetData;
  }

  async execute(): Promise<ResetPasswordResponse> {
    try {
      const { accessToken, newPassword } = this.resetData;

      if (!accessToken || !newPassword) {
        return {
          success: false,
          error: {
            error: 'Dados obrigatórios',
            message: 'Token de acesso e nova senha são obrigatórios',
            status: 400
          }
        };
      }

      if (newPassword.length < 6) {
        return {
          success: false,
          error: {
            error: 'Senha inválida',
            message: 'A nova senha deve ter pelo menos 6 caracteres',
            status: 400
          }
        };
      }

      // Verificar e decodificar o token para obter o ID do usuário
      let userId: string;
      try {
        const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
        userId = payload.sub;

        if (!userId) {
          throw new Error('Token inválido');
        }
      } catch (error) {
        return {
          success: false,
          error: {
            error: 'Token inválido',
            message: 'Token de recuperação malformado ou inválido',
            status: 400
          }
        };
      }

      // Usar Admin API para atualizar a senha diretamente
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: {
            error: 'Erro ao redefinir senha',
            message: error.message,
            status: 400
          }
        };
      }

      return {
        success: true,
        data: {
          message: 'Senha redefinida com sucesso'
        }
      };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return {
        success: false,
        error: {
          error: 'Erro interno do servidor',
          message: 'Erro ao redefinir senha',
          status: 500
        }
      };
    }
  }
}