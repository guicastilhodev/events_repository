import { SupabaseClient } from "@supabase/supabase-js";
import EntityModel from "../../models/entities";
import GetEntityProfilePicture from "./get_entity_profile_picture";

interface GetEntityResponse {
    success: boolean;
    data?: {
        entity: any;
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class GetEntity {

    private supabase_client: SupabaseClient;
    private entityModel: EntityModel;
    private getEntityProfilePicture: GetEntityProfilePicture;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.entityModel = new EntityModel(supabase_client);
        this.getEntityProfilePicture = new GetEntityProfilePicture(supabase_client);
    }

    async execute(entity_id: string): Promise<GetEntityResponse> {
        try {
            const entity = await this.entityModel.get(entity_id);
            if (!entity) {
                throw new Error('Entity not found');
            }
            const profilePicture = await this.getEntityProfilePicture.execute(entity_id);
            return {
                success: true,
                data: {
                    entity: {
                        ...entity,
                        profile_picture: profilePicture
                    }
                }
            };
        } catch (error: any) {
            console.error('Error on get entity:', error);
            return {
                success: false,
                error: {
                    error: 'Error on get entity',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default GetEntity;