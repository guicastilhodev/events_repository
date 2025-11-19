import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from 'crypto';

class BillsStorage {

    constructor(private supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
    }

    async uploadProofPayment(bill_id: number, file: Express.Multer.File) {
        const ext = (file.mimetype || '').split('/')[1] || 'bin';
        const filename = `${randomUUID()}.${ext}`;
        const path = `bills/${bill_id}/${filename}`;

        const { data, error } = await this.supabase_client.storage.from('bills').upload(path, file.buffer, {
            contentType: file.mimetype
        });
        if (error) {
            throw error;
        }
        return { key: path, ...data };
    }

    async getSignedUrl(path: string) {
        const { data, error } = await this.supabase_client.storage.from('bills').createSignedUrl(path, 60 * 60 * 24 * 30);
        if (error) {
            throw error;
        }
        return data;
    }

    async deleteFile(path: string) {
        const { error } = await this.supabase_client.storage.from('bills').remove([path]);
        if (error) {
            throw error;
        }
    }
}

export default BillsStorage;
