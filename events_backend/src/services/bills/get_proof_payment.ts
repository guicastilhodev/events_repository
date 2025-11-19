import { SupabaseClient } from "@supabase/supabase-js";
import BillModel from "../../models/bills";
import BillsStorage from "../../storages/bills";

interface GetProofPaymentResponse {
    success: boolean;
    data?: {
        proof_url: string;
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class GetProofPayment {

    private supabase_client: SupabaseClient;
    private billModel: BillModel;
    private billsStorage: BillsStorage;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.billModel = new BillModel(supabase_client);
        this.billsStorage = new BillsStorage(supabase_client);
    }

    async execute(bill_id: number, organization_id: string): Promise<GetProofPaymentResponse> {
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
                        message: 'You do not have permission to access this bill',
                        status: 403
                    }
                };
            }

            if (!existingBill.proof_payment_path) {
                return {
                    success: false,
                    error: {
                        error: 'No proof found',
                        message: 'This bill does not have a proof of payment',
                        status: 404
                    }
                };
            }

            // Gerar URL assinada
            const signedUrl = await this.billsStorage.getSignedUrl(existingBill.proof_payment_path);

            return {
                success: true,
                data: {
                    proof_url: signedUrl.signedUrl
                }
            };
        } catch (error: any) {
            console.error('Error on get proof payment:', error);
            return {
                success: false,
                error: {
                    error: 'Error on get proof payment',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default GetProofPayment;
