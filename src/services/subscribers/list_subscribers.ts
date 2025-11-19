import { SupabaseClient } from "@supabase/supabase-js";
import SubscriberModel from "../../models/subscribers";

interface ListSubscribersResponse {
    success: boolean;
    data?: {
        subscribers: any[];
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class ListSubscribers {

    private supabase_client: SupabaseClient;
    private subscriberModel: SubscriberModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriberModel = new SubscriberModel(supabase_client);
    }

    async execute(organization_id: string): Promise<ListSubscribersResponse> {
        try {
            const subscribers = await this.subscriberModel.getSubscribersByOrganization(organization_id);
            return {
                success: true,
                data: {
                    subscribers
                }
            };
        } catch (error: any) {
            console.error('Error on list subscribers:', error);
            return {
                success: false,
                error: {
                    error: 'Error on list subscribers',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default ListSubscribers;
