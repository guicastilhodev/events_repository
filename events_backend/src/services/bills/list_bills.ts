import { SupabaseClient } from "@supabase/supabase-js";
import BillModel from "../../models/bills";

interface ListBillsResponse {
    success: boolean;
    data?: {
        bills: any[];
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class ListBills {

    private supabase_client: SupabaseClient;
    private billModel: BillModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.billModel = new BillModel(supabase_client);
    }

    async execute(organization_id: string): Promise<ListBillsResponse> {
        try {
            const bills = await this.billModel.getBillsByOrganization(organization_id);
            return {
                success: true,
                data: {
                    bills
                }
            };
        } catch (error: any) {
            console.error('Error on list bills:', error);
            return {
                success: false,
                error: {
                    error: 'Error on list bills',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default ListBills;
