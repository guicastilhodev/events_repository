import { SupabaseClient } from "@supabase/supabase-js";
import SubscriberModel from "../../models/subscribers";

interface CreateSubscriberResponse {
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

class CreateSubscriber {

    private supabase_client: SupabaseClient;
    private subscriberModel: SubscriberModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriberModel = new SubscriberModel(supabase_client);
    }

    async execute(organization_id: string, subscriberData: any): Promise<CreateSubscriberResponse> {
        try {
            // Validar campo obrigatório
            if (!subscriberData.name || subscriberData.name.trim() === '') {
                return {
                    success: false,
                    error: {
                        error: 'Validation error',
                        message: 'Name is required',
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

            const subscriber = await this.subscriberModel.insert({
                ...subscriberData,
                organization_id
            });

            return {
                success: true,
                data: {
                    subscriber
                }
            };
        } catch (error: any) {
            console.error('Error on create subscriber:', error);
            return {
                success: false,
                error: {
                    error: 'Error on create subscriber',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default CreateSubscriber;
