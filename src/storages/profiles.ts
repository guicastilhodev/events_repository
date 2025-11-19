import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from 'crypto';

class ProfilesStorage { 

    constructor(private supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
    }

    async uploadProfilePicture(user_id: string, file: Express.Multer.File) {
        const ext = (file.mimetype || '').split('/')[1] || 'bin';
        const filename = `${randomUUID()}.${ext}`;
        const path = `${user_id}/${filename}`;

        const { data, error } = await this.supabase_client.storage.from('profiles').upload(path, file.buffer, {
            contentType: file.mimetype
        });
        if (error) {
            throw error;
        }
        return { key: path, ...data };
    }

    async getSignedUrl(path: string) {
        const { data, error } = await this.supabase_client.storage.from('profiles').createSignedUrl(path, 60 * 60 * 24 * 30);
        if (error) {
            throw error;
        }
        return data;
    }
}

export default ProfilesStorage;