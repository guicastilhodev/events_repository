import PostModel from "../../models/posts";
import { SupabaseClient } from "@supabase/supabase-js";

interface DeletePostResponse {
    success: boolean;
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class DeletePostService {
    private supabase_client: SupabaseClient;
    private postModel: PostModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.postModel = new PostModel(supabase_client);
    }

    async execute(post_id: string): Promise<DeletePostResponse> {
        try {
            if (!post_id) {
                return {
                    success: false,
                    error: {
                        error: 'Missing post ID',
                        message: 'Post ID is required',
                        status: 400
                    }
                };
            }

            const post = await this.postModel.get(post_id);
            if (!post) {
                return {
                    success: false,
                    error: {
                        error: 'Post not found',
                        message: 'The specified post does not exist',
                        status: 404
                    }
                };
            }

            await this.postModel.delete(post_id);

            return {
                success: true
            };
        } catch (error: any) {
            console.error('Error on delete post:', error);

            if (error.code === 'PGRST116') {
                return {
                    success: false,
                    error: {
                        error: 'Post not found',
                        message: 'The specified post does not exist',
                        status: 404
                    }
                };
            }

            return {
                success: false,
                error: {
                    error: 'Error on delete post',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default DeletePostService;