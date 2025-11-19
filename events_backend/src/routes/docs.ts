import { Router } from 'express';
import DocsController from '../controllers/docs';

const router = Router();

router.get('/', async(req, res) => {
  new DocsController(req, res).getApiDocs();
});

router.get('/json', async(req, res) => {
  new DocsController(req, res).getApiDocsJson();
});

export default router;