import UserModel from "../../models/users";
import ProfilesStorage from "../../storages/profiles";
import { SupabaseClient } from "@supabase/supabase-js";


class GetProfilePicture { 


    private profilesStorage: ProfilesStorage;
    private userModel: UserModel;

    constructor(private supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.profilesStorage = new ProfilesStorage(supabase_client);
        this.userModel = new UserModel(supabase_client);
    }

    async execute(user_id: string) {
        const user = await this.userModel.get(user_id);
        if (!user || !user.profile_picture) {
            return null;
        }
        const profilePicture = await this.profilesStorage.getSignedUrl(user.profile_picture as string);
        return profilePicture.signedUrl;
    }
}

export default GetProfilePicture;