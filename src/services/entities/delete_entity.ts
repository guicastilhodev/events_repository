import EntityModel from "../../models/entities";
import { SupabaseClient } from "@supabase/supabase-js";

interface DeleteEntityResponse {
    success: boolean;
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class DeleteEntity {
    private supabase_client: SupabaseClient;
    private entityModel: EntityModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.entityModel = new EntityModel(supabase_client);
    }

    async execute(entity_id: string): Promise<DeleteEntityResponse> {
        try {
            await this.entityModel.delete(entity_id);
            return {
                success: true
            };
        } catch (error: any) {
            console.error('Error on delete entity:', error);
            return {
                success: false,
                error: {
                    error: 'Error on delete entity',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default DeleteEntity;