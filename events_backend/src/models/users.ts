import { SupabaseClient } from "@supabase/supabase-js";

interface User {
    id: string;
    organization_id?: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    permissions: string[];
    additional_info: any;
    created_at: Date;
    profile_picture: string | null;
    [key: string]: any;
}

interface PatchUser {
    id?: string;
    name?: string;
    phone?: string;
    role?: string;
    profile_picture?: string;
}

class UserModel {

    constructor(public supabase_client: SupabaseClient) {}

    async insert(user: User): Promise<User> {
        const { data, error } = await this.supabase_client.from('users').insert(user).select();
        if (error) {
            throw error;
        }
        // `select()` returns an array of rows; retornar a primeira linha inserida
        return data?.[0] as User;
    }

    async patch(user_id: string, user: PatchUser): Promise<User> {
        const { data, error } = await this.supabase_client.from('users').update(user).eq('id', user_id).select();
        if (error) {
            console.error('Error on patch user:', error);
            throw error;
        }
        return data?.[0] as User;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase_client.from('users').delete().eq('id', id);
        if (error) {
            throw error;
        }
    }

    async get(id: string): Promise<User> {
        const { data, error } = await this.supabase_client.from('users').select().eq('id', id).single();
        if (error) {
            throw error;
        }
        return data as User;
    }

    async getUsersByOrganization(organization_id: string): Promise<User[]> {
        const { data, error } = await this.supabase_client.from('users').select().eq('organization_id', organization_id);
        if (error) {
            throw error;
        }
        return data as User[];
    }
}

export default UserModel;