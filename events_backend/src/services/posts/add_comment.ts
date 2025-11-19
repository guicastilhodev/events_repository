import PostModel from "../../models/posts";
import { SupabaseClient } from "@supabase/supabase-js";

interface AddCommentResponse {
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

interface AddCommentData {
    content: string;
}

class AddCommentService {
    private supabase_client: SupabaseClient;
    private postModel: PostModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.postModel = new PostModel(supabase_client);
    }

    async execute(post_id: string, user_id: string, comment_data: AddCommentData): Promise<AddCommentResponse> {
        try {
            if (!post_id || !user_id || !comment_data.content) {
                return {
                    success: false,
                    error: {
                        error: 'Missing required fields',
                        message: 'post_id, user_id and content are required',
                        status: 400
                    }
                };
            }

            if (comment_data.content.trim().length === 0) {
                return {
                    success: false,
                    error: {
                        error: 'Invalid content',
                        message: 'Comment content cannot be empty',
                        status: 400
                    }
                };
            }

            const post = await this.postModel.addComment(post_id, user_id, comment_data.content.trim());

            return {
                success: true,
                data: { post: post }
            };
        } catch (error: any) {
            console.error('Error on add comment:', error);

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
                    error: 'Error on add comment',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default AddCommentService;