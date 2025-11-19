import { SupabaseClient } from "@supabase/supabase-js";

interface Bill {
    id?: number;
    created_at?: Date;
    subscription_id?: number | null;
    organization_id?: string | null;
    total_amount?: number | null;
    status?: string | null;
    due_date?: string | null;
    confirmed_at?: Date | null;
    cancelled_at?: Date | null;
    proof_payment_path?: string | null;
}

interface PatchBill {
    total_amount?: number | null;
    status?: string | null;
    due_date?: string | null;
    confirmed_at?: Date | null;
    cancelled_at?: Date | null;
    proof_payment_path?: string | null;
}

class BillModel {

    constructor(public supabase_client: SupabaseClient) {}

    async insert(bill: Bill): Promise<Bill> {
        const { data, error } = await this.supabase_client.from('bills').insert(bill).select();
        if (error) {
            throw error;
        }
        return data?.[0] as Bill;
    }

    async insertMany(bills: Bill[]): Promise<Bill[]> {
        const { data, error } = await this.supabase_client.from('bills').insert(bills).select();
        if (error) {
            throw error;
        }
        return data as Bill[];
    }

    async patch(bill_id: number, bill: PatchBill): Promise<Bill> {
        const { data, error } = await this.supabase_client
            .from('bills')
            .update(bill)
            .eq('id', bill_id)
            .select();

        if (error) {
            console.error('Error on patch bill:', error);
            throw error;
        }
        return data?.[0] as Bill;
    }

    async delete(bill_id: number): Promise<void> {
        const { error } = await this.supabase_client.from('bills').delete().eq('id', bill_id);
        if (error) {
            throw error;
        }
    }

    async get(bill_id: number): Promise<Bill> {
        const { data, error } = await this.supabase_client
            .from('bills')
            .select('*, subscriptions(*, subscribers(*))')
            .eq('id', bill_id)
            .single();

        if (error) {
            throw error;
        }
        return data as Bill;
    }

    async getBillsByOrganization(organization_id: string): Promise<Bill[]> {
        const { data, error } = await this.supabase_client
            .from('bills')
            .select('*, subscriptions(*, subscribers(*))')
            .eq('organization_id', organization_id)
            .order('due_date', { ascending: true });

        if (error) {
            throw error;
        }
        return data as Bill[];
    }

    async getBillsBySubscription(subscription_id: number): Promise<Bill[]> {
        const { data, error } = await this.supabase_client
            .from('bills')
            .select('*')
            .eq('subscription_id', subscription_id)
            .order('due_date', { ascending: true });

        if (error) {
            throw error;
        }
        return data as Bill[];
    }

    async cancelPendingBillsBySubscription(subscription_id: number): Promise<void> {
        const now = new Date();
        const { error } = await this.supabase_client
            .from('bills')
            .update({
                status: 'cancelled',
                cancelled_at: now
            })
            .eq('subscription_id', subscription_id)
            .in('status', ['pending', 'overdue']);

        if (error) {
            throw error;
        }
    }
}

export default BillModel;
