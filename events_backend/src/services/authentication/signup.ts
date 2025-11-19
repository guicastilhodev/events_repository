import { supabaseAdmin } from '../../config/supabase';
import MoradorModel from '../../models/morador';

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  cpf: string;
  apartamento: string;
  metadata?: any;
}

interface SignupResponse {
  success: boolean;
  data?: {
    user: {
      id: string | undefined;
      email: string | undefined;
      full_name: string | undefined;
      apartamento: string;
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
  private moradorModel: MoradorModel;

  constructor(signupData: SignupData) {
    this.signupData = signupData;
    this.moradorModel = new MoradorModel(supabaseAdmin);
  }

  async execute(): Promise<SignupResponse> {
    try {
      const { email, password, fullName, cpf, apartamento, metadata } = this.signupData;

      if (!email || !password || !fullName || !cpf || !apartamento) {
        return {
          success: false,
          error: {
            error: 'Dados obrigatórios',
            message: 'Email, senha, nome completo, CPF e apartamento são obrigatórios',
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

      // Verificar se CPF já existe
      try {
        const existingMorador = await this.moradorModel.get(cpf);
        if (existingMorador) {
          return {
            success: false,
            error: {
              error: 'CPF já cadastrado',
              message: 'Já existe um morador cadastrado com este CPF',
              status: 400
            }
          };
        }
      } catch (error) {
        // CPF não existe, pode prosseguir
      }

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          cpf: cpf,
          apartamento: apartamento
        }
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: {
            error: 'Erro ao criar usuário',
            message: authError?.message || 'Erro ao criar usuário na autenticação',
            status: 400
          }
        };
      }

      // Criar morador na tabela de moradores (sem senha)
      const morador = await this.moradorModel.insert({
        cpf,
        nome: fullName,
        apartamento: apartamento,
        created_at: new Date()
      });

      if (!morador.cpf) { 
        return {
          success: false, 
          error: {
            error: 'Erro ao criar morador', 
            message: 'Erro ao criar morador na base de dados', 
            status: 400
          }
        } 
      } 

      return {
        success: true,
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email,
            full_name: morador.nome,
            apartamento: morador.apartamento
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