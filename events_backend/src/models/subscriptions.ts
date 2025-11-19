import { SupabaseClient } from "@supabase/supabase-js";

interface Subscription {
    id?: number;
    created_at?: Date;
    subscriber_id?: number | null;
    recurrence?: string | null;
    name?: string | null;
    description?: string | null;
    payer_name?: string | null;
    payer_email?: string | null;
    payer_phone?: string | null;
    payer_document?: string | null;
    payer_document_type?: string | null;
    billing_day?: number | null;
    total_amount?: string | null;
    integration_id?: string | null;
    email_bill?: boolean | null;
    whatsapp_bill?: boolean | null;
    organization_id?: string;
    duration?: number | null;
}

interface PatchSubscription {
    subscriber_id?: number | null;
    recurrence?: string | null;
    name?: string | null;
    description?: string | null;
    payer_name?: string | null;
    payer_email?: string | null;
    payer_phone?: string | null;
    payer_document?: string | null;
    payer_document_type?: string | null;
    billing_day?: number | null;
    total_amount?: string | null;
    integration_id?: string | null;
    email_bill?: boolean | null;
    whatsapp_bill?: boolean | null;
    duration?: number | null;
}

class SubscriptionModel {

    constructor(public supabase_client: SupabaseClient) {}

    async insert(subscription: Subscription): Promise<Subscription> {
        const { data, error } = await this.supabase_client.from('subscriptions').insert(subscription).select();
        if (error) {
            throw error;
        }
        return data?.[0] as Subscription;
    }

    async patch(subscription_id: number, subscription: PatchSubscription): Promise<Subscription> {
        const { data, error } = await this.supabase_client
            .from('subscriptions')
            .update(subscription)
            .eq('id', subscription_id)
            .select();

        if (error) {
            console.error('Error on patch subscription:', error);
            throw error;
        }
        return data?.[0] as Subscription;
    }

    async delete(subscription_id: number): Promise<void> {
        const { error } = await this.supabase_client.from('subscriptions').delete().eq('id', subscription_id);
        if (error) {
            throw error;
        }
    }

    async get(subscription_id: number): Promise<Subscription> {
        const { data, error } = await this.supabase_client
            .from('subscriptions')
            .select('*')
            .eq('id', subscription_id)
            .single();

        if (error) {
            throw error;
        }
        return data as Subscription;
    }

    async getSubscriptionsByOrganization(organization_id: string): Promise<Subscription[]> {
        const { data, error } = await this.supabase_client
            .from('subscriptions')
            .select('*')
            .eq('organization_id', organization_id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }
        return data as Subscription[];
    }
}

export default SubscriptionModel;