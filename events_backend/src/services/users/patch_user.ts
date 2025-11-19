import UserModel from "../../models/users";
import { SupabaseClient } from "@supabase/supabase-js";

interface PatchUserResponse {
    success: boolean;
    data?: {
        user: any;
    };
}

interface PatchUserData {
    id?: string;
    name?: string;
    phone?: string;
    role?: string;
}

class PatchUser {
    private supabase_client: SupabaseClient;
    private userModel: UserModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.userModel = new UserModel(supabase_client);
    }

    async execute(user_id: string, user_data: PatchUserData): Promise<PatchUserResponse> {
        const user = await this.userModel.patch(user_id, user_data);
        if (!user) {
            throw new Error('User not found');
        }
        return {
            success: true,
            data: { user: user }
        };
    }
}

export default PatchUser;