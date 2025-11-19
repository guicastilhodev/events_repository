import { Request, Response } from 'express';
import { SignupService } from '../services/authentication/signup';
import { SigninService } from '../services/authentication/signin';
import { UpdatePasswordService } from '../services/authentication/password_change';
import { RecoverPasswordService } from '../services/authentication/password_recovery';
import { ResetPasswordService } from '../services/authentication/reset_password';
import { SignoutService } from '../services/authentication/signout';
import { GetProfileService } from '../services/authentication/profile';
import { ErrorResponse, SuccessResponse } from '../utils/response';

export class AuthController {

  constructor( private req: Request, private res: Response) {}

  // Cadastro de usuário
  async signup() {
    const { email, password, fullName, cpf, apartamento, metadata } = this.req.body;

    const signupService = new SignupService({ email, password, fullName, cpf, apartamento, metadata });
    const result = await signupService.execute();

    if (!result.success) {
      return ErrorResponse(this.res, {
        status: result.error!.status,
        error: "Error on create user",
        message: "If this problem persists, please contact support"
      });
    }

    return SuccessResponse(this.res, {
      status: 201,
      message: 'Morador criado com sucesso',
      data: {
        user: result.data!.user,
        needsVerification: result.data!.needsVerification
      }
    });
  }

  // Login de usuário
  async signin(){
    
    const { email, password } = this.req.body;

    const signinService = new SigninService({ email, password });
    const result = await signinService.execute();

    if (!result.success) {
      return ErrorResponse(this.res, {
        status: result.error!.status,
        error: result.error!.error,
        message: result.error!.message
      });
    }

    // Configurar cookie com o token
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none' || 'lax',
      domain: process.env.COOKIE_DOMAIN || "localhost",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    };

    this.res.cookie('sgo_access_token', result.data!.session.access_token, cookieOptions);

    return SuccessResponse(this.res, {
      status: 200,
      message: 'Login realizado com sucesso',
      data: {
        user: result.data!.user,
        access_token: result.data!.session.access_token,
        //refresh_token: result.data!.session.refresh_token, #TODO: Verify if we need to send refresh token
        //expires_at: result.data!.session.expires_at #TODO: Verify if we need to send expires at
      }
    });
  }

  // Redefinir senha (quando logado)
  async updatePassword(){
    const { currentPassword, newPassword } = this.req.body;
    const user = this.req.user;

    const updatePasswordService = new UpdatePasswordService({ user, currentPassword, newPassword });
    const result = await updatePasswordService.execute();

    if (!result.success) {
      return ErrorResponse(this.res, {
        status: result.error!.status,
        error: result.error!.error,
        message: result.error!.message
      });
    }

    return SuccessResponse(this.res, {
      status: 200,
      message: result.data!.message
    });
  }

  // Recuperar senha (enviar email de reset)
  async recoverPassword(){
    const { email } = this.req.body;

    const recoverPasswordService = new RecoverPasswordService({ email });
    const result = await recoverPasswordService.execute();

    if (!result.success) {
      return ErrorResponse(this.res, {
        status: result.error!.status,
        error: result.error!.error,
        message: result.error!.message
      });
    }

    return SuccessResponse(this.res, {
      status: 200,
      message: result.data!.message,
      data: {
        info: result.data!.info
      }
    });
  }

  // Logout
  async signout(){
    //const signoutService = new SignoutService();
    //const result = await signoutService.execute();
    const result = {
      success: true,
      data: {
        message: 'Logout realizado com sucesso'
      }
    };

    const cookies = this.req.headers.cookie;
    for (const cookie of Object.keys(cookies || {}) ||   []) {
      const [key, value] = cookie.trim().split('=');
      console.log(key, value);
      if (key === 'sgo_access_token') {
        this.res.clearCookie(key, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none' || 'lax',
          domain: process.env.COOKIE_DOMAIN || undefined
        });
      }
    } 
    
    this.res.clearCookie('sgo_access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none' || 'lax',
      domain: process.env.COOKIE_DOMAIN || undefined
    });

    /*if (!result.success) {
      return ErrorResponse(this.res, {
        status: result.error!.status,
        error: result.error!.error,
        message: result.error!.message
      });
    }*/

    return SuccessResponse(this.res, {
      status: 200,
      message: result.data!.message
    });
  }

  // Obter informações do usuário autenticado
  async getProfile(){
    const user = this.req.user;

    const getProfileService = new GetProfileService({ user });
    const result = await getProfileService.execute();

    if (!result.success) {
      return ErrorResponse(this.res, {
        status: result.error!.status,
        error: result.error!.error,
        message: result.error!.message
      });
    }

    return SuccessResponse(this.res, {
      status: 200,
      message: 'Perfil obtido com sucesso',
      data: result.data
    });
  }

  // Redefinir senha com token de recuperação
  async resetPassword(){
    const { accessToken, newPassword } = this.req.body;

    const resetPasswordService = new ResetPasswordService({ accessToken, newPassword });
    const result = await resetPasswordService.execute();

    if (!result.success) {
      return ErrorResponse(this.res, {
        status: result.error!.status,
        error: result.error!.error,
        message: result.error!.message
      });
    }

    return SuccessResponse(this.res, {
      status: 200,
      message: result.data!.message
    });
  }
}

