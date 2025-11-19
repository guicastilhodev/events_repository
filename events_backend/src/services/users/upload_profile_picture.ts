import ProfilesStorage from "../../storages/profiles";
import UserModel from "../../models/users";

import { SupabaseClient } from "@supabase/supabase-js";

class UploadProfilePicture { 

    private profilesStorage: ProfilesStorage;
    private userModel: UserModel;
    
    constructor(private supabase_client: SupabaseClient) {
        this.profilesStorage = new ProfilesStorage(supabase_client);
        this.userModel = new UserModel(supabase_client);
        this.supabase_client = supabase_client;
    }

    async execute(user_id: string, file: Express.Multer.File) {
        const profilePicture = await this.profilesStorage.uploadProfilePicture(user_id, file);
        await this.userModel.patch(user_id, { profile_picture: profilePicture.key });
        return profilePicture;
    }
}

export default UploadProfilePicture;