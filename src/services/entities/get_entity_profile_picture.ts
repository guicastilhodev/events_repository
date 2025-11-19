import EntitiesStorage from "../../storages/entities";
import EntityModel from "../../models/entities";

import { SupabaseClient } from "@supabase/supabase-js";

class GetEntityProfilePicture {

    private entitiesStorage: EntitiesStorage;
    private entityModel: EntityModel;

    constructor(private supabase_client: SupabaseClient) {
        this.entitiesStorage = new EntitiesStorage(supabase_client);
        this.entityModel = new EntityModel(supabase_client);
        this.supabase_client = supabase_client;
    }

    async execute(entity_id: string) {
        try {
            const entity = await this.entityModel.get(entity_id);
            if (!entity || !entity.profile_picture) {
                return null;
            }
            const signedUrl = await this.entitiesStorage.getSignedUrl(entity.profile_picture);
            return signedUrl.signedUrl;
        } catch (error) {
            console.error('Error getting entity profile picture:', error);
            return null;
        }
    }
}

export default GetEntityProfilePicture;