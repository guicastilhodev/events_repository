import EntitiesStorage from "../../storages/entities";
import EntityModel from "../../models/entities";

import { SupabaseClient } from "@supabase/supabase-js";

class UploadEntityProfilePicture {

    private entitiesStorage: EntitiesStorage;
    private entityModel: EntityModel;

    constructor(private supabase_client: SupabaseClient) {
        this.entitiesStorage = new EntitiesStorage(supabase_client);
        this.entityModel = new EntityModel(supabase_client);
        this.supabase_client = supabase_client;
    }

    async execute( entity_id: string, file: Express.Multer.File) {
        try {
            const profilePicture = await this.entitiesStorage.uploadProfilePicture(entity_id, file);
            await this.entityModel.patch(entity_id, { profile_picture: profilePicture.key });
            return profilePicture;
        } catch (error) {
            console.error('Error uploading entity profile picture:', error);
            throw error;
        }
    }
}

export default UploadEntityProfilePicture;