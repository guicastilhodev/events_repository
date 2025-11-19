import { SupabaseClient } from "@supabase/supabase-js";
import UserModel from "../../models/users";
import GetProfilePicture from "./get_profile_picture";

interface MeResponse {
    success: boolean;
    data?: {
        user: any;
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class Me {
    
    private supabase_client: SupabaseClient;
    private userModel: UserModel;
    private getProfilePicture: GetProfilePicture;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.userModel = new UserModel(supabase_client);
        this.getProfilePicture = new GetProfilePicture(supabase_client);
    }

    async execute(user_id: string): Promise<MeResponse> {
        const user = await this.userModel.get(user_id);
        if (!user) {
            throw new Error('User not found');
        }
        const profilePicture = await this.getProfilePicture.execute(user_id);
        return {
            success: true,
            data: {
                user: {
                    ...user,
                    profile_picture: profilePicture
                }
            }
        };
    } catch (error: any) {
        console.error('Error on me:', error);
        return {
            success: false,
            error: {
                error: 'Error on me',
                message: error.message,
                status: 500
            }
        };
    }
}

export default Me;