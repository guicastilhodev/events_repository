import { SupabaseClient } from "@supabase/supabase-js";
import BillModel from "../../models/bills";

interface GetBillResponse {
    success: boolean;
    data?: {
        bill: any;
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class GetBill {

    private supabase_client: SupabaseClient;
    private billModel: BillModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.billModel = new BillModel(supabase_client);
    }

    async execute(bill_id: number, organization_id: string): Promise<GetBillResponse> {
        try {
            const bill = await this.billModel.get(bill_id);

            if (!bill) {
                return {
                    success: false,
                    error: {
                        error: 'Bill not found',
                        message: 'The requested bill does not exist',
                        status: 404
                    }
                };
            }

            // Verificar se a bill pertence à organização do usuário
            if (bill.organization_id !== organization_id) {
                return {
                    success: false,
                    error: {
                        error: 'Unauthorized',
                        message: 'You do not have permission to access this bill',
                        status: 403
                    }
                };
            }

            return {
                success: true,
                data: {
                    bill
                }
            };
        } catch (error: any) {
            console.error('Error on get bill:', error);
            return {
                success: false,
                error: {
                    error: 'Error on get bill',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default GetBill;
