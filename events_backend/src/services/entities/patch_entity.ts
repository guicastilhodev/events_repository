import EntityModel from "../../models/entities";
import { SupabaseClient } from "@supabase/supabase-js";
import UploadEntityProfilePicture from "./upload_entity_profile_picture";

interface PatchEntityResponse {
    success: boolean;
    data?: {
        entity: any;
    };
}

interface PatchEntityData {
    id?: string;
    name?: string;
    description?: string;
    additional_info?: any;
    profile_picture_file?: Express.Multer.File;
}

class PatchEntity {
    private supabase_client: SupabaseClient;
    private entityModel: EntityModel;
    private uploadEntityProfilePicture: UploadEntityProfilePicture;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.entityModel = new EntityModel(supabase_client);
        this.uploadEntityProfilePicture = new UploadEntityProfilePicture(supabase_client);
    }

    async execute(entity_id: string, entity_data: PatchEntityData): Promise<PatchEntityResponse> {
        // Separa o arquivo do resto dos dados
        const { profile_picture_file, ...patchData } = entity_data;

        const entity = await this.entityModel.patch(entity_id, patchData);
        if (!entity) {
            throw new Error('Entity not found');
        }

        // Se foi enviado um arquivo de profile_picture, faz o upload
        if (profile_picture_file) {
            await this.uploadEntityProfilePicture.execute(entity_id, profile_picture_file);
        }

        return {
            success: true,
            data: { entity: entity }
        };
    }
}

export default PatchEntity;