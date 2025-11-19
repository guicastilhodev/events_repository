import { Router } from 'express';
import { authenticateToken } from '../middleware/authentication';
import SubscribersController from '../controllers/subscribers';

const router = Router();

// Listar todos os assinantes da organização
router.get('/', authenticateToken, (req, res) => {
  new SubscribersController(req.state.supabase_client, req, res).listSubscribers();
});

// Obter um assinante específico
router.get('/:id', authenticateToken, (req, res) => {
  new SubscribersController(req.state.supabase_client, req, res).getSubscriber();
});

// Criar novo assinante
router.post('/', authenticateToken, (req, res) => {
  new SubscribersController(req.state.supabase_client, req, res).createSubscriber();
});

// Atualizar assinante
router.patch('/:id', authenticateToken, (req, res) => {
  new SubscribersController(req.state.supabase_client, req, res).updateSubscriber();
});

// Deletar assinante
router.delete('/:id', authenticateToken, (req, res) => {
  new SubscribersController(req.state.supabase_client, req, res).deleteSubscriber();
});

export default router;
