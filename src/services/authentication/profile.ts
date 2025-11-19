interface GetProfileData {
  user: any;
}

interface GetProfileResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      full_name: string | undefined;
      avatar_url: string | undefined;
      created_at: string;
      last_sign_in_at: string | undefined;
    };
  };
  error?: {
    error: string;
    message: string;
    status: number;
  };
}

export class GetProfileService {
  private profileData: GetProfileData;

  constructor(profileData: GetProfileData) {
    this.profileData = profileData;
  }

  async execute(): Promise<GetProfileResponse> {
    try {
      const { user } = this.profileData;

      if (!user) {
        return {
          success: false,
          error: {
            error: 'Não autenticado',
            message: 'Faça login para acessar o perfil',
            status: 401
          }
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at
          }
        }
      };
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      return {
        success: false,
        error: {
          error: 'Erro interno do servidor',
          message: 'Erro ao obter informações do perfil',
          status: 500
        }
      };
    }
  }
}