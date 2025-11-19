import { Router } from 'express';
import { AuthController } from '../controllers/authentication';
import { authenticateToken } from '../middleware/authentication';

const router = Router();

router.post('/signup',(req, res) => {
  new AuthController(req, res).signup();
});

router.post('/signin', (req, res) => {
  new AuthController(req, res).signin();
});

router.post('/recovery', (req, res) => {
  new AuthController(req, res).recoverPassword();
});

router.post('/reset-password', (req, res) => {
  new AuthController(req, res).resetPassword();
});

router.post('/password', authenticateToken, (req, res) => {
  new AuthController(req, res).updatePassword();
});

router.get('/signout', authenticateToken, (req, res) => {
  new AuthController(req, res).signout();
});

router.get('/profile', authenticateToken, (req, res) => {
  new AuthController(req, res).getProfile();
});

export default router;
