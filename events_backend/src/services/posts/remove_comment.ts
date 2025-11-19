import PostModel from "../../models/posts";
import { SupabaseClient } from "@supabase/supabase-js";

interface RemoveCommentResponse {
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

class RemoveCommentService {
    private supabase_client: SupabaseClient;
    private postModel: PostModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.postModel = new PostModel(supabase_client);
    }

    async execute(post_id: string, comment_id: string, user_id: string): Promise<RemoveCommentResponse> {
        try {
            if (!post_id || !comment_id) {
                return {
                    success: false,
                    error: {
                        error: 'Missing required fields',
                        message: 'post_id and comment_id are required',
                        status: 400
                    }
                };
            }

            const post = await this.postModel.get(post_id);
            const comment = post.comments.find(c => c.id === comment_id);

            if (!comment) {
                return {
                    success: false,
                    error: {
                        error: 'Comment not found',
                        message: 'The specified comment does not exist',
                        status: 404
                    }
                };
            }

            if (comment.user_id !== user_id) {
                return {
                    success: false,
                    error: {
                        error: 'Unauthorized',
                        message: 'You can only delete your own comments',
                        status: 403
                    }
                };
            }

            const updatedPost = await this.postModel.removeComment(post_id, comment_id);

            return {
                success: true,
                data: { post: updatedPost }
            };
        } catch (error: any) {
            console.error('Error on remove comment:', error);

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
                    error: 'Error on remove comment',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default RemoveCommentService;