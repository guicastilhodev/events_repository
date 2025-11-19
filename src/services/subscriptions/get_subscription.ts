import { SupabaseClient } from "@supabase/supabase-js";
import SubscriptionModel from "../../models/subscriptions";

interface GetSubscriptionResponse {
    success: boolean;
    data?: {
        subscription: any;
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class GetSubscription {

    private supabase_client: SupabaseClient;
    private subscriptionModel: SubscriptionModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriptionModel = new SubscriptionModel(supabase_client);
    }

    async execute(subscription_id: number, organization_id: string): Promise<GetSubscriptionResponse> {
        try {
            const subscription = await this.subscriptionModel.get(subscription_id);

            if (!subscription) {
                return {
                    success: false,
                    error: {
                        error: 'Subscription not found',
                        message: 'The requested subscription does not exist',
                        status: 404
                    }
                };
            }

            // Verificar se a subscription pertence à organização do usuário
            if (subscription.organization_id !== organization_id) {
                return {
                    success: false,
                    error: {
                        error: 'Unauthorized',
                        message: 'You do not have permission to access this subscription',
                        status: 403
                    }
                };
            }

            return {
                success: true,
                data: {
                    subscription
                }
            };
        } catch (error: any) {
            console.error('Error on get subscription:', error);
            return {
                success: false,
                error: {
                    error: 'Error on get subscription',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default GetSubscription;
