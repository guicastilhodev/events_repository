import { SupabaseClient } from "@supabase/supabase-js";
import SubscriberModel from "../../models/subscribers";

interface DeleteSubscriberResponse {
    success: boolean;
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class DeleteSubscriber {

    private supabase_client: SupabaseClient;
    private subscriberModel: SubscriberModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriberModel = new SubscriberModel(supabase_client);
    }

    async execute(subscriber_id: number, organization_id: string): Promise<DeleteSubscriberResponse> {
        try {
            // Verificar se o subscriber existe e pertence à organização
            const existingSubscriber = await this.subscriberModel.get(subscriber_id);

            if (!existingSubscriber) {
                return {
                    success: false,
                    error: {
                        error: 'Subscriber not found',
                        message: 'The requested subscriber does not exist',
                        status: 404
                    }
                };
            }

            if (existingSubscriber.organization_id !== organization_id) {
                return {
                    success: false,
                    error: {
                        error: 'Unauthorized',
                        message: 'You do not have permission to delete this subscriber',
                        status: 403
                    }
                };
            }

            await this.subscriberModel.delete(subscriber_id);

            return {
                success: true
            };
        } catch (error: any) {
            console.error('Error on delete subscriber:', error);
            return {
                success: false,
                error: {
                    error: 'Error on delete subscriber',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default DeleteSubscriber;
