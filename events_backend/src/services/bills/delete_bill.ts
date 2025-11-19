import { SupabaseClient } from "@supabase/supabase-js";
import BillModel from "../../models/bills";
import BillsStorage from "../../storages/bills";

interface DeleteBillResponse {
    success: boolean;
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class DeleteBill {

    private supabase_client: SupabaseClient;
    private billModel: BillModel;
    private billsStorage: BillsStorage;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.billModel = new BillModel(supabase_client);
        this.billsStorage = new BillsStorage(supabase_client);
    }

    async execute(bill_id: number, organization_id: string): Promise<DeleteBillResponse> {
        try {
            // Verificar se a bill existe e pertence à organização
            const existingBill = await this.billModel.get(bill_id);

            if (!existingBill) {
                return {
                    success: false,
                    error: {
                        error: 'Bill not found',
                        message: 'The requested bill does not exist',
                        status: 404
                    }
                };
            }

            if (existingBill.organization_id !== organization_id) {
                return {
                    success: false,
                    error: {
                        error: 'Unauthorized',
                        message: 'You do not have permission to delete this bill',
                        status: 403
                    }
                };
            }

            // Deletar comprovante de pagamento se existir
            if (existingBill.proof_payment_path) {
                try {
                    await this.billsStorage.deleteFile(existingBill.proof_payment_path);
                } catch (error) {
                    console.error('Error deleting proof payment file:', error);
                }
            }

            await this.billModel.delete(bill_id);

            return {
                success: true
            };
        } catch (error: any) {
            console.error('Error on delete bill:', error);
            return {
                success: false,
                error: {
                    error: 'Error on delete bill',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default DeleteBill;
