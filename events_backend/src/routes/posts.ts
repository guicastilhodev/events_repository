import { Router } from 'express';
import { authenticateToken } from '../middleware/authentication';
import PostsController from '../controllers/posts';

const router = Router();

router.get('/', authenticateToken, async(req, res) => {
  new PostsController(req.state.supabase_client, req, res).listPosts();
});

router.get('/all', authenticateToken, async(req, res) => {
  new PostsController(req.state.supabase_client, req, res).listAllPosts();
});

router.post('/', authenticateToken, async(req, res) => {
  new PostsController(req.state.supabase_client, req, res).createPost();
});

router.delete('/:post_id', authenticateToken, async(req, res) => {
  new PostsController(req.state.supabase_client, req, res).deletePost();
});

router.post('/:post_id/like', authenticateToken, async(req, res) => {
  new PostsController(req.state.supabase_client, req, res).likePost();
});

router.delete('/:post_id/like', authenticateToken, async(req, res) => {
  new PostsController(req.state.supabase_client, req, res).unlikePost();
});

router.post('/:post_id/comments', authenticateToken, async(req, res) => {
  new PostsController(req.state.supabase_client, req, res).addComment();
});

router.delete('/:post_id/comments/:comment_id', authenticateToken, async(req, res) => {
  new PostsController(req.state.supabase_client, req, res).removeComment();
});

export default router;