import { SupabaseClient } from "@supabase/supabase-js";
import BillModel from "../../models/bills";

interface UpdateBillResponse {
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

class UpdateBill {

    private supabase_client: SupabaseClient;
    private billModel: BillModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.billModel = new BillModel(supabase_client);
    }

    async execute(bill_id: number, organization_id: string, billData: any): Promise<UpdateBillResponse> {
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
                        message: 'You do not have permission to update this bill',
                        status: 403
                    }
                };
            }

            // Validar total_amount se fornecido
            if (billData.total_amount !== undefined && billData.total_amount <= 0) {
                return {
                    success: false,
                    error: {
                        error: 'Validation error',
                        message: 'Total amount must be greater than 0',
                        status: 400
                    }
                };
            }

            // Validar status se fornecido
            const validStatuses = ['pending', 'paid', 'overdue', 'cancelled'];
            if (billData.status && !validStatuses.includes(billData.status)) {
                return {
                    success: false,
                    error: {
                        error: 'Validation error',
                        message: 'Status must be one of: pending, paid, overdue, cancelled',
                        status: 400
                    }
                };
            }

            // Se status for 'paid', adicionar confirmed_at
            if (billData.status === 'paid' && !billData.confirmed_at) {
                billData.confirmed_at = new Date();
            }

            // Se status for 'cancelled', adicionar cancelled_at
            if (billData.status === 'cancelled' && !billData.cancelled_at) {
                billData.cancelled_at = new Date();
            }

            const bill = await this.billModel.patch(bill_id, billData);

            return {
                success: true,
                data: {
                    bill
                }
            };
        } catch (error: any) {
            console.error('Error on update bill:', error);
            return {
                success: false,
                error: {
                    error: 'Error on update bill',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default UpdateBill;
