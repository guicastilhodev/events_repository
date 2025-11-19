import { supabase } from '../../config/supabase';

interface UpdatePasswordData {
  user: any;
  currentPassword: string;
  newPassword: string;
}

interface UpdatePasswordResponse {
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

export class UpdatePasswordService {
  private updateData: UpdatePasswordData;

  constructor(updateData: UpdatePasswordData) {
    this.updateData = updateData;
  }

  async execute(): Promise<UpdatePasswordResponse> {
    try {
      const { user, currentPassword, newPassword } = this.updateData;

      if (!user) {
        return {
          success: false,
          error: {
            error: 'Não autenticado',
            message: 'Faça login para alterar a senha',
            status: 401
          }
        };
      }

      if (!currentPassword || !newPassword) {
        return {
          success: false,
          error: {
            error: 'Dados obrigatórios',
            message: 'Senha atual e nova senha são obrigatórias',
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

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (loginError) {
        return {
          success: false,
          error: {
            error: 'Senha atual incorreta',
            message: 'A senha atual fornecida está incorreta',
            status: 400
          }
        };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: {
            error: 'Erro ao atualizar senha',
            message: error.message,
            status: 400
          }
        };
      }

      return {
        success: true,
        data: {
          message: 'Senha atualizada com sucesso'
        }
      };
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return {
        success: false,
        error: {
          error: 'Erro interno do servidor',
          message: 'Erro ao atualizar senha',
          status: 500
        }
      };
    }
  }
}