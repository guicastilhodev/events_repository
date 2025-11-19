import { Router } from 'express';
import { authenticateToken } from '../middleware/authentication';
import { uploadSingle, uploadFields } from '../middleware/upload';
import EntitiesController from '../controllers/entities';

const router = Router();

router.get('/test', async (req, res) => {
  res.send('Hello World');
});

router.get('/', authenticateToken, async(req, res) => {
  new EntitiesController(req.state.supabase_client, req, res).getEntitiesByOrganization();
});

router.get('/:entity_id', authenticateToken, async(req, res) => {
  new EntitiesController(req.state.supabase_client, req, res).getEntity();
});

router.post('/', authenticateToken, uploadFields, async(req, res) => {
  new EntitiesController(req.state.supabase_client, req, res).createEntity();
});

router.patch('/:entity_id', authenticateToken, uploadFields, async(req, res) => {
  new EntitiesController(req.state.supabase_client, req, res).patchEntity();
});

router.delete('/:entity_id', authenticateToken, async(req, res) => {
  new EntitiesController(req.state.supabase_client, req, res).deleteEntity();
});

router.post('/:entity_id/profile-picture', authenticateToken, uploadSingle, async(req, res) => {
  new EntitiesController(req.state.supabase_client, req, res).uploadProfilePicture();
});

router.get('/:entity_id/profile-picture', authenticateToken, async(req, res) => {
  new EntitiesController(req.state.supabase_client, req, res).getProfilePicture();
});

export default router;