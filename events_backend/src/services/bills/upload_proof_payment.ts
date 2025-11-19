import { SupabaseClient } from "@supabase/supabase-js";
import BillModel from "../../models/bills";
import BillsStorage from "../../storages/bills";

interface UploadProofPaymentResponse {
    success: boolean;
    data?: {
        bill: any;
        proof_url: string;
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class UploadProofPayment {

    private supabase_client: SupabaseClient;
    private billModel: BillModel;
    private billsStorage: BillsStorage;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.billModel = new BillModel(supabase_client);
        this.billsStorage = new BillsStorage(supabase_client);
    }

    async execute(bill_id: number, organization_id: string, file: Express.Multer.File): Promise<UploadProofPaymentResponse> {
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
                        message: 'You do not have permission to upload proof for this bill',
                        status: 403
                    }
                };
            }

            // Deletar comprovante antigo se existir
            if (existingBill.proof_payment_path) {
                try {
                    await this.billsStorage.deleteFile(existingBill.proof_payment_path);
                } catch (error) {
                    console.error('Error deleting old proof payment:', error);
                }
            }

            // Upload do novo comprovante
            const uploadResult = await this.billsStorage.uploadProofPayment(bill_id, file);

            // Atualizar bill com o path do comprovante
            const updatedBill = await this.billModel.patch(bill_id, {
                proof_payment_path: uploadResult.key
            });

            // Gerar URL assinada
            const signedUrl = await this.billsStorage.getSignedUrl(uploadResult.key);

            return {
                success: true,
                data: {
                    bill: updatedBill,
                    proof_url: signedUrl.signedUrl
                }
            };
        } catch (error: any) {
            console.error('Error on upload proof payment:', error);
            return {
                success: false,
                error: {
                    error: 'Error on upload proof payment',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default UploadProofPayment;
