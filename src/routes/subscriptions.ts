import { Router } from 'express';
import { authenticateToken } from '../middleware/authentication';
import SubscriptionsController from '../controllers/subscriptions';

const router = Router();

// Listar todas as assinaturas da organização
router.get('/', authenticateToken, (req, res) => {
  new SubscriptionsController(req.state.supabase_client, req, res).listSubscriptions();
});

// Obter uma assinatura específica
router.get('/:id', authenticateToken, (req, res) => {
  new SubscriptionsController(req.state.supabase_client, req, res).getSubscription();
});

// Criar nova assinatura
router.post('/', authenticateToken, (req, res) => {
  new SubscriptionsController(req.state.supabase_client, req, res).createSubscription();
});

// Atualizar assinatura
router.patch('/:id', authenticateToken, (req, res) => {
  new SubscriptionsController(req.state.supabase_client, req, res).updateSubscription();
});

// Deletar assinatura
router.delete('/:id', authenticateToken, (req, res) => {
  new SubscriptionsController(req.state.supabase_client, req, res).deleteSubscription();
});

export default router;