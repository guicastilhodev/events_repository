import { SupabaseClient } from "@supabase/supabase-js";
import SubscriptionModel from "../../models/subscriptions";

interface DeleteSubscriptionResponse {
    success: boolean;
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class DeleteSubscription {

    private supabase_client: SupabaseClient;
    private subscriptionModel: SubscriptionModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriptionModel = new SubscriptionModel(supabase_client);
    }

    async execute(subscription_id: number, organization_id: string): Promise<DeleteSubscriptionResponse> {
        try {
            // Verificar se a subscription existe e pertence à organização
            const existingSubscription = await this.subscriptionModel.get(subscription_id);

            if (!existingSubscription) {
                return {
                    success: false,
                    error: {
                        error: 'Subscription not found',
                        message: 'The requested subscription does not exist',
                        status: 404
                    }
                };
            }

            if (existingSubscription.organization_id !== organization_id) {
                return {
                    success: false,
                    error: {
                        error: 'Unauthorized',
                        message: 'You do not have permission to delete this subscription',
                        status: 403
                    }
                };
            }

            await this.subscriptionModel.delete(subscription_id);

            return {
                success: true
            };
        } catch (error: any) {
            console.error('Error on delete subscription:', error);
            return {
                success: false,
                error: {
                    error: 'Error on delete subscription',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default DeleteSubscription;
