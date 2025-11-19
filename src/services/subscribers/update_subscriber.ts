import { SupabaseClient } from "@supabase/supabase-js";
import SubscriberModel from "../../models/subscribers";

interface UpdateSubscriberResponse {
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

class UpdateSubscriber {

    private supabase_client: SupabaseClient;
    private subscriberModel: SubscriberModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriberModel = new SubscriberModel(supabase_client);
    }

    async execute(subscriber_id: number, organization_id: string, subscriberData: any): Promise<UpdateSubscriberResponse> {
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
                        message: 'You do not have permission to update this subscriber',
                        status: 403
                    }
                };
            }

            // Validar name se fornecido
            if (subscriberData.name !== undefined && subscriberData.name.trim() === '') {
                return {
                    success: false,
                    error: {
                        error: 'Validation error',
                        message: 'Name cannot be empty',
                        status: 400
                    }
                };
            }

            // Validar type se fornecido
            if (subscriberData.type && !['business', 'personal'].includes(subscriberData.type)) {
                return {
                    success: false,
                    error: {
                        error: 'Validation error',
                        message: 'Type must be either "business" or "personal"',
                        status: 400
                    }
                };
            }

            const subscriber = await this.subscriberModel.patch(subscriber_id, subscriberData);

            return {
                success: true,
                data: {
                    subscriber
                }
            };
        } catch (error: any) {
            console.error('Error on update subscriber:', error);
            return {
                success: false,
                error: {
                    error: 'Error on update subscriber',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default UpdateSubscriber;
