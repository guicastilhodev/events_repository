import { Router } from 'express';
import { AuthController } from '../controllers/authentication';
import { authenticateToken } from '../middleware/authentication';

const router = Router();

// Middleware para lidar com preflight OPTIONS
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

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
