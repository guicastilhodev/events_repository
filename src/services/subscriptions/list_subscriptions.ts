import { SupabaseClient } from "@supabase/supabase-js";
import SubscriptionModel from "../../models/subscriptions";

interface ListSubscriptionsResponse {
    success: boolean;
    data?: {
        subscriptions: any[];
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class ListSubscriptions {

    private supabase_client: SupabaseClient;
    private subscriptionModel: SubscriptionModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriptionModel = new SubscriptionModel(supabase_client);
    }

    async execute(organization_id: string): Promise<ListSubscriptionsResponse> {
        try {
            const subscriptions = await this.subscriptionModel.getSubscriptionsByOrganization(organization_id);
            return {
                success: true,
                data: {
                    subscriptions
                }
            };
        } catch (error: any) {
            console.error('Error on list subscriptions:', error);
            return {
                success: false,
                error: {
                    error: 'Error on list subscriptions',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default ListSubscriptions;
