import EntityModel from "../../models/entities";
import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import UploadEntityProfilePicture from "./upload_entity_profile_picture";

interface CreateEntityResponse {
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

interface CreateEntityData {
    name: string;
    description?: string;
    organization_id: string;
    additional_info?: any;
    profile_picture_file?: Express.Multer.File;
}

class CreateEntity {
    private supabase_client: SupabaseClient;
    private entityModel: EntityModel;
    private uploadEntityProfilePicture: UploadEntityProfilePicture;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.entityModel = new EntityModel(supabase_client);
        this.uploadEntityProfilePicture = new UploadEntityProfilePicture(supabase_client);
    }

    async execute(entity_data: CreateEntityData): Promise<CreateEntityResponse> {
        try {
            const entity = await this.entityModel.insert({
                created_at: new Date(),
                profile_picture: null,
                name: entity_data.name,
                organization_id: entity_data.organization_id,
                description: entity_data.description ?? null,
                additional_info: entity_data.additional_info ?? null
            });

            // Se foi enviado um arquivo de profile_picture, faz o upload
            if (entity_data.profile_picture_file && entity.id) {
                await this.uploadEntityProfilePicture.execute(entity.id, entity_data.profile_picture_file);
            }

            return {
                success: true,
                data: { entity: entity }
            };
        } catch (error: any) {
            console.error('Error on create entity:', error);
            return {
                success: false,
                error: {
                    error: 'Error on create entity',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default CreateEntity;