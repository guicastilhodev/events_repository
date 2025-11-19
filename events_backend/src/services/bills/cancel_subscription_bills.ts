import { SupabaseClient } from "@supabase/supabase-js";
import BillModel from "../../models/bills";

interface CancelSubscriptionBillsResponse {
    success: boolean;
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class CancelSubscriptionBills {

    private billModel: BillModel;

    constructor(supabase_client: SupabaseClient) {
        this.billModel = new BillModel(supabase_client);
    }

    async execute(subscription_id: number): Promise<CancelSubscriptionBillsResponse> {
        try {
            await this.billModel.cancelPendingBillsBySubscription(subscription_id);

            return {
                success: true
            };
        } catch (error: any) {
            console.error('Error on cancel subscription bills:', error);
            return {
                success: false,
                error: {
                    error: 'Error on cancel subscription bills',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default CancelSubscriptionBills;
