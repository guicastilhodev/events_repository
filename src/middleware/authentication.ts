import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { createClient } from '@supabase/supabase-js';

// Estender o tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      state?: any;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Tentar obter token do header Authorization
    const authHeader = req.headers.authorization;
    let token: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove "Bearer "
    }

    // Se não encontrou no header, tentar obter do cookie
    const cookies = req.headers.cookie?.split(';');

    for (const cookie of cookies || []) {
      const [key, value] = cookie.trim().split('=');
      if (key === 'sgo_access_token') {
        token = value;
      }
    }
    
    if (!token && req.cookies?.sgo_access_token) {
      token = req.cookies.sgo_access_token;
    }

    if (!token) {
      res.status(401).json({
        error: 'Access token not provided',
        message: 'Access token not provided, please provide a valid access token',
        status: 401
      });
      return;
    }

    // Verificar o token com o Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        error: 'Invalid or expired token',
        message: 'Invalid or expired token, please login again',
        status: 401
      });
      return;
    }

    // Adicionar usuário ao request
    const supabase_client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Inicializar req.state se não existir
    if (!req.state) {
      req.state = {};
    }

    req.state.supabase_client = supabase_client;
    req.state.user = user;
    req.state.organization_id = user.user_metadata?.organization_id ?? null;
    req.state.access_token = token;
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error verifying authentication',
      status: 500
    });
  }
};

// Middleware opcional - permite rotas com ou sem autenticação
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token && req.cookies?.sgo_access_token) {
      token = req.cookies.sgo_access_token;
    }

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Em caso de erro, continua sem autenticação
    next();
  }
};

