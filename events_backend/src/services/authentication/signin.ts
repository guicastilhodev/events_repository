import { supabase } from '../../config/supabase';

interface SigninData {
  email: string;
  password: string;
}

interface SigninResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      full_name: string | undefined;
    };
    session: {
      access_token: string;
      refresh_token: string;
      expires_at: number | undefined;
    };
  };
  error?: {
    error: string;
    message: string;
    status: number;
  };
}

export class SigninService {
  private signinData: SigninData;

  constructor(signinData: SigninData) {
    this.signinData = signinData;
  }

  async execute(): Promise<SigninResponse> {
    try {
      const { email, password } = this.signinData;

      if (!email || !password) {
        return {
          success: false,
          error: {
            error: 'Dados obrigat�rios',
            message: 'Email e senha s�o obrigat�rios',
            status: 400
          }
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return {
          success: false,
          error: {
            error: 'Credenciais inv�lidas',
            message: error.message,
            status: 401
          }
        };
      }

      if (!data.session) {
        return {
          success: false,
          error: {
            error: 'Erro na autenticação',
            message: 'Não foi possível criar sessão',
            status: 401
          }
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name
          },
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at
          }
        }
      };
    } catch (error) {
      console.error('Erro no signin:', error);
      return {
        success: false,
        error: {
          error: 'Erro interno do servidor',
          message: 'Erro ao fazer login',
          status: 500
        }
      };
    }
  }
}