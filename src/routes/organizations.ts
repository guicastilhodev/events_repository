import { Router } from 'express';
import { authenticateToken } from '../middleware/authentication';
import OrganizationsController from '../controllers/organizations';

const router = Router();

router.get('/my', authenticateToken, (req, res) => {
  new OrganizationsController(req.state.supabase_client, req, res).getMyOrganization();
});

router.patch('/my', authenticateToken, (req, res) => {
  new OrganizationsController(req.state.supabase_client, req, res).updateMyOrganization();
});

export default router;