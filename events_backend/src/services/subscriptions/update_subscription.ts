import { SupabaseClient } from "@supabase/supabase-js";
import SubscriptionModel from "../../models/subscriptions";
import CancelSubscriptionBills from "../bills/cancel_subscription_bills";

interface UpdateSubscriptionResponse {
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

class UpdateSubscription {

    private supabase_client: SupabaseClient;
    private subscriptionModel: SubscriptionModel;
    private cancelSubscriptionBills: CancelSubscriptionBills;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriptionModel = new SubscriptionModel(supabase_client);
        this.cancelSubscriptionBills = new CancelSubscriptionBills(supabase_client);
    }

    async execute(subscription_id: number, organization_id: string, subscriptionData: any): Promise<UpdateSubscriptionResponse> {
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
                        message: 'You do not have permission to update this subscription',
                        status: 403
                    }
                };
            }

            // Validar total_amount se fornecido
            if (subscriptionData.total_amount !== undefined && parseFloat(subscriptionData.total_amount) <= 0) {
                return {
                    success: false,
                    error: {
                        error: 'Validation error',
                        message: 'Total amount must be greater than 0',
                        status: 400
                    }
                };
            }

            const subscription = await this.subscriptionModel.patch(subscription_id, subscriptionData);

            return {
                success: true,
                data: {
                    subscription
                }
            };
        } catch (error: any) {
            console.error('Error on update subscription:', error);
            return {
                success: false,
                error: {
                    error: 'Error on update subscription',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default UpdateSubscription;
