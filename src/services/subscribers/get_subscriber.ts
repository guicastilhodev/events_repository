import { SupabaseClient } from "@supabase/supabase-js";
import SubscriberModel from "../../models/subscribers";

interface GetSubscriberResponse {
    success: boolean;
    data?: {
        subscriber: any;
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class GetSubscriber {

    private supabase_client: SupabaseClient;
    private subscriberModel: SubscriberModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriberModel = new SubscriberModel(supabase_client);
    }

    async execute(subscriber_id: number, organization_id: string): Promise<GetSubscriberResponse> {
        try {
            const subscriber = await this.subscriberModel.get(subscriber_id);

            if (!subscriber) {
                return {
                    success: false,
                    error: {
                        error: 'Subscriber not found',
                        message: 'The requested subscriber does not exist',
                        status: 404
                    }
                };
            }

            // Verificar se o subscriber pertence à organização do usuário
            if (subscriber.organization_id !== organization_id) {
                return {
                    success: false,
                    error: {
                        error: 'Unauthorized',
                        message: 'You do not have permission to access this subscriber',
                        status: 403
                    }
                };
            }

            return {
                success: true,
                data: {
                    subscriber
                }
            };
        } catch (error: any) {
            console.error('Error on get subscriber:', error);
            return {
                success: false,
                error: {
                    error: 'Error on get subscriber',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default GetSubscriber;
