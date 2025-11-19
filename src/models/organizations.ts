import { SupabaseClient } from "@supabase/supabase-js";

interface Organization {
    id?: string;
    name?: string;
    cnpj?: string;
    additional_info?: any;
    created_at?: Date;
    updated_at?: Date;
    type?: string;
}

class OrganizationModel {

    constructor(public supabase_client: SupabaseClient) {}
    
    async insert(organization: Organization): Promise<Organization> {
        const { data, error } = await this.supabase_client.from('organizations').insert(organization).select();
        if (error) {
            throw error;
        }
        return data?.[0] as Organization;
    }

    async patch(organization_id: string, organization: Organization): Promise<Organization> {
        const { data, error } = await this.supabase_client.from('organizations').update(organization).eq('id', organization_id).select();
        if (error) {
            console.error('Error on patch user:', error);
            throw error;
        }
        return data?.[0] as Organization;
    }

    async delete(organization_id: string): Promise<void> {
        const { error } = await this.supabase_client.from('organizations').delete().eq('id', organization_id);
        if (error) {
            throw error;
        }
    }

    async get(organization_id: string): Promise<Organization> {
        const { data, error } = await this.supabase_client.from('organizations').select("*");
        if (error) {
            throw error;
        }
        return data?.[0] as Organization;
    }
}

export default OrganizationModel;