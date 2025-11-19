import { Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { ErrorResponse, SuccessResponse } from '../utils/response';
import ListBills from '../services/bills/list_bills';
import GetBill from '../services/bills/get_bill';
import UpdateBill from '../services/bills/update_bill';
import DeleteBill from '../services/bills/delete_bill';
import UploadProofPayment from '../services/bills/upload_proof_payment';
import GetProofPayment from '../services/bills/get_proof_payment';

class BillsController {

    constructor(private supabase_client: SupabaseClient, private req: Request, private res: Response) {
        this.supabase_client = supabase_client;
    }

    public async listBills() {
        const organization_id = this.req.state.organization_id;
        const listBills = new ListBills(this.supabase_client);
        const result = await listBills.execute(organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Lista de cobranças',
            data: result.data?.bills
        });
    }

    public async getBill() {
        const organization_id = this.req.state.organization_id;
        const bill_id = parseInt(this.req.params.id);

        if (isNaN(bill_id)) {
            return ErrorResponse(this.res, {
                status: 400,
                error: 'Invalid ID',
                message: 'Bill ID must be a number'
            });
        }

        const getBill = new GetBill(this.supabase_client);
        const result = await getBill.execute(bill_id, organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Cobrança encontrada',
            data: result.data?.bill
        });
    }

    public async updateBill() {
        const organization_id = this.req.state.organization_id;
        const bill_id = parseInt(this.req.params.id);

        if (isNaN(bill_id)) {
            return ErrorResponse(this.res, {
                status: 400,
                error: 'Invalid ID',
                message: 'Bill ID must be a number'
            });
        }

        const updateBill = new UpdateBill(this.supabase_client);
        const result = await updateBill.execute(bill_id, organization_id, this.req.body);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Cobrança atualizada com sucesso',
            data: result.data?.bill
        });
    }

    public async deleteBill() {
        const organization_id = this.req.state.organization_id;
        const bill_id = parseInt(this.req.params.id);

        if (isNaN(bill_id)) {
            return ErrorResponse(this.res, {
                status: 400,
                error: 'Invalid ID',
                message: 'Bill ID must be a number'
            });
        }

        const deleteBill = new DeleteBill(this.supabase_client);
        const result = await deleteBill.execute(bill_id, organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Cobrança excluída com sucesso',
            data: null
        });
    }

    public async uploadProofPayment() {
        const organization_id = this.req.state.organization_id;
        const bill_id = parseInt(this.req.params.id);

        if (isNaN(bill_id)) {
            return ErrorResponse(this.res, {
                status: 400,
                error: 'Invalid ID',
                message: 'Bill ID must be a number'
            });
        }

        if (!this.req.file) {
            return ErrorResponse(this.res, {
                status: 400,
                error: 'No file provided',
                message: 'Please upload a proof of payment file'
            });
        }

        const uploadProofPayment = new UploadProofPayment(this.supabase_client);
        const result = await uploadProofPayment.execute(bill_id, organization_id, this.req.file);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Comprovante de pagamento enviado com sucesso',
            data: result.data
        });
    }

    public async getProofPayment() {
        const organization_id = this.req.state.organization_id;
        const bill_id = parseInt(this.req.params.id);

        if (isNaN(bill_id)) {
            return ErrorResponse(this.res, {
                status: 400,
                error: 'Invalid ID',
                message: 'Bill ID must be a number'
            });
        }

        const getProofPayment = new GetProofPayment(this.supabase_client);
        const result = await getProofPayment.execute(bill_id, organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'URL do comprovante de pagamento',
            data: result.data
        });
    }
}

export default BillsController;
