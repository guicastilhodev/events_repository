import { supabaseAdmin } from '../../config/supabase';
import UserModel from '../../models/users';

interface SignupData {
  email: string;
  password: string;
  fullName?: string;
  metadata?: any;
}

interface SignupResponse {
  success: boolean;
  data?: {
    user: {
      id: string | undefined;
      email: string | undefined;
      full_name: string | undefined;
    };
    needsVerification: boolean;
  };
  error?: {
    error: string;
    message: string;
    status: number;
  };
}

export class SignupService {
  private signupData: SignupData;
  private userModel: UserModel;

  constructor(signupData: SignupData) {
    this.signupData = signupData;
    this.userModel = new UserModel(supabaseAdmin);
  }

  async execute(): Promise<SignupResponse> {
    try {
      const { email, password, fullName, metadata } = this.signupData;

      if (!email || !password) {
        return {
          success: false,
          error: {
            error: 'Dados obrigatórios',
            message: 'Email e senha são obrigatórios',
            status: 400
          }
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: {
            error: 'Senha inválida',
            message: 'A senha deve ter pelo menos 6 caracteres',
            status: 400
          }
        };
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        }
      });

      if (error) { 
        return { 
          success: false, 
          error: {
            error: 'Erro ao criar usuário', 
            message: error.message, 
            status: 400
          }
        } 
      } 
      
      // Criar usuário na tabela de usuários, se necessário
      const user = await this.userModel.insert({
        id: String(data.user?.id),
        name: fullName??'',
        email,
        additional_info: {},
        phone: metadata?.phone??'',
        role: 'user',
        permissions: ['user'],
        created_at: new Date(),
        profile_picture: null
      });

      if (!user.id) { return {success: false, error: {error: 'Erro ao criar usuário', message: 'Erro ao criar usuário', status: 400}} } 

      return {
        success: true,
        data: {
          user: {
            id: data.user?.id,
            email: data.user?.email,
            full_name: data.user?.user_metadata?.full_name
          },
          needsVerification: false
        }
      };
    } catch (error) {
      console.error('Erro no signup:', error);
      return {
        success: false,
        error: {
          error: 'Erro interno do servidor',
          message: 'Erro ao criar usuário',
          status: 500
        }
      };
    }
  }
}