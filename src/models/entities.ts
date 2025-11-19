import { SupabaseClient } from "@supabase/supabase-js";

interface Entity {
    id?: string;
    created_at?: Date;
    name: string;
    description: string | null;
    profile_picture: string | null;
    organization_id: string;
    additional_info: any;
    [key: string]: any;
}

interface PatchEntity {
    id?: string;
    name?: string;
    description?: string;
    profile_picture?: string;
    additional_info?: any;
}

class EntityModel {

    constructor(public supabase_client: SupabaseClient) {}

    async insert(entity: Entity): Promise<Entity> {
        const { data, error } = await this.supabase_client.from('entities').insert(entity).select();
        if (error) {
            throw error;
        }
        return data?.[0] as Entity;
    }

    async patch(entity_id: string, entity: PatchEntity): Promise<Entity> {
        const { data, error } = await this.supabase_client.from('entities').update(entity).eq('id', entity_id).select();
        if (error) {
            console.error('Error on patch entity:', error);
            throw error;
        }
        return data?.[0] as Entity;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase_client.from('entities').delete().eq('id', id);
        if (error) {
            throw error;
        }
    }

    async get(id: string): Promise<Entity> {
        const { data, error } = await this.supabase_client.from('entities').select().eq('id', id).single();
        if (error) {
            throw error;
        }
        return data as Entity;
    }

    async getEntitiesByOrganization(organization_id: string): Promise<Entity[]> {
        const { data, error } = await this.supabase_client.from('entities').select().eq('organization_id', organization_id);
        if (error) {
            throw error;
        }
        return data as Entity[];
    }
}

export default EntityModel;