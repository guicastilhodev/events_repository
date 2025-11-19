import { SupabaseClient } from "@supabase/supabase-js";
import EntityModel from "../../models/entities";
import GetEntityProfilePicture from "./get_entity_profile_picture";

interface GetEntitiesByOrganizationResponse {
    success: boolean;
    data?: {
        entities: any[];
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class GetEntitiesByOrganization {

    private supabase_client: SupabaseClient;
    private entityModel: EntityModel;
    private getEntityProfilePicture: GetEntityProfilePicture;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.entityModel = new EntityModel(supabase_client);
        this.getEntityProfilePicture = new GetEntityProfilePicture(supabase_client);
    }

    async execute(organization_id: string): Promise<GetEntitiesByOrganizationResponse> {
        try {
            const entities = await this.entityModel.getEntitiesByOrganization(organization_id);

            const entitiesWithProfilePictures = await Promise.all(
                entities.map(async (entity) => {
                    const profilePicture = entity.id
                        ? await this.getEntityProfilePicture.execute(entity.id)
                        : null;
                    return {
                        ...entity,
                        profile_picture: profilePicture
                    };
                })
            );

            return {
                success: true,
                data: {
                    entities: entitiesWithProfilePictures
                }
            };
        } catch (error: any) {
            console.error('Error on get entities by organization:', error);
            return {
                success: false,
                error: {
                    error: 'Error on get entities by organization',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default GetEntitiesByOrganization;