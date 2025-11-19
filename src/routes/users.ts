import { Router } from 'express';
import { authenticateToken, optionalAuth } from '../middleware/authentication';
import UsersController from '../controllers/users';

const router = Router();

// Exemplo de rota protegida para usuários
router.get('/me', authenticateToken, async(req, res) => {
  new UsersController(req.state.supabase_client, req, res).getMe();
});

router.patch('/me', authenticateToken, async(req, res) => {
  new UsersController(req.state.supabase_client, req, res).patchUser();
});

router.post('/me/profile-picture', authenticateToken, async(req, res) => {
  new UsersController(req.state.supabase_client, req, res).uploadProfilePicture();
});

router.get('/me/profile-picture', authenticateToken, async(req, res) => {
  new UsersController(req.state.supabase_client, req, res).getProfilePicture();
});

export default router;