import PostModel from "../../models/posts";
import { SupabaseClient } from "@supabase/supabase-js";

interface LikePostResponse {
    success: boolean;
    data?: {
        post: any;
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class LikePostService {
    private supabase_client: SupabaseClient;
    private postModel: PostModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.postModel = new PostModel(supabase_client);
    }

    async execute(post_id: string, user_id: string): Promise<LikePostResponse> {
        try {
            if (!post_id || !user_id) {
                return {
                    success: false,
                    error: {
                        error: 'Missing required fields',
                        message: 'post_id and user_id are required',
                        status: 400
                    }
                };
            }

            const post = await this.postModel.addLike(post_id, user_id);

            return {
                success: true,
                data: { post: post }
            };
        } catch (error: any) {
            console.error('Error on like post:', error);

            if (error.message === 'User already liked this post') {
                return {
                    success: false,
                    error: {
                        error: 'Already liked',
                        message: 'User already liked this post',
                        status: 400
                    }
                };
            }

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
                    error: 'Error on like post',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default LikePostService;