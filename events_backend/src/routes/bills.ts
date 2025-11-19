import { Router } from 'express';
import { authenticateToken } from '../middleware/authentication';
import BillsController from '../controllers/bills';
import multer from 'multer';

const router = Router();

// Configuração do multer para upload de comprovantes
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit para PDFs/imagens
    }
});

// Listar todas as cobranças da organização
router.get('/', authenticateToken, (req, res) => {
  new BillsController(req.state.supabase_client, req, res).listBills();
});

// Obter uma cobrança específica
router.get('/:id', authenticateToken, (req, res) => {
  new BillsController(req.state.supabase_client, req, res).getBill();
});

// Atualizar cobrança
router.patch('/:id', authenticateToken, (req, res) => {
  new BillsController(req.state.supabase_client, req, res).updateBill();
});

// Deletar cobrança
router.delete('/:id', authenticateToken, (req, res) => {
  new BillsController(req.state.supabase_client, req, res).deleteBill();
});

// Upload de comprovante de pagamento
router.post('/:id/proof-payment', authenticateToken, upload.single('proof_payment'), (req, res) => {
  new BillsController(req.state.supabase_client, req, res).uploadProofPayment();
});

// Obter URL do comprovante de pagamento
router.get('/:id/proof-payment', authenticateToken, (req, res) => {
  new BillsController(req.state.supabase_client, req, res).getProofPayment();
});

export default router;
