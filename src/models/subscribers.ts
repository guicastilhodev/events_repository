import { SupabaseClient } from "@supabase/supabase-js";

interface Subscriber {
    id?: number;
    created_at?: Date;
    updated_at?: Date;
    organization_id?: string;
    name: string;
    business_name?: string | null;
    business_identification?: string | null;
    phone?: string | null;
    email?: string | null;
    type?: string | null;
    personal_identification?: string | null;
    zipcode?: string | null;
    city?: string | null;
    state?: string | null;
    street?: string | null;
    address_complement?: string | null;
}

interface PatchSubscriber {
    name?: string;
    business_name?: string | null;
    business_identification?: string | null;
    phone?: string | null;
    email?: string | null;
    type?: string | null;
    personal_identification?: string | null;
    zipcode?: string | null;
    city?: string | null;
    state?: string | null;
    street?: string | null;
    address_complement?: string | null;
    updated_at?: Date;
}

class SubscriberModel {

    constructor(public supabase_client: SupabaseClient) {}

    async insert(subscriber: Subscriber): Promise<Subscriber> {
        const { data, error } = await this.supabase_client.from('subscribers').insert(subscriber).select();
        if (error) {
            throw error;
        }
        return data?.[0] as Subscriber;
    }

    async patch(subscriber_id: number, subscriber: PatchSubscriber): Promise<Subscriber> {
        const updateData = {
            ...subscriber,
            updated_at: new Date()
        };

        const { data, error } = await this.supabase_client
            .from('subscribers')
            .update(updateData)
            .eq('id', subscriber_id)
            .select();

        if (error) {
            console.error('Error on patch subscriber:', error);
            throw error;
        }
        return data?.[0] as Subscriber;
    }

    async delete(id: number): Promise<void> {
        const { error } = await this.supabase_client.from('subscribers').delete().eq('id', id);
        if (error) {
            throw error;
        }
    }

    async get(id: number): Promise<Subscriber> {
        const { data, error } = await this.supabase_client.from('subscribers').select().eq('id', id).single();
        if (error) {
            throw error;
        }
        return data as Subscriber;
    }

    async getSubscribersByOrganization(organization_id: string): Promise<Subscriber[]> {
        const { data, error } = await this.supabase_client
            .from('subscribers')
            .select()
            .eq('organization_id', organization_id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }
        return data as Subscriber[];
    }
}

export default SubscriberModel;
