import PostModel, { CreatePost } from "../../models/posts";
import { SupabaseClient } from "@supabase/supabase-js";

interface CreatePostResponse {
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

interface CreatePostData {
    entity_id: string;
    category_name: string;
    content: string;
    organization_id: string;
    user_id: string;
}

class CreatePostService {
    private supabase_client: SupabaseClient;
    private postModel: PostModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.postModel = new PostModel(supabase_client);
    }

    async execute(post_data: CreatePostData): Promise<CreatePostResponse> {
        try {
            if (!post_data.entity_id || !post_data.category_name || !post_data.content || !post_data.organization_id || !post_data.user_id) {
                return {
                    success: false,
                    error: {
                        error: 'Missing required fields',
                        message: 'entity_id, category_name, content, organization_id, and user_id are required',
                        status: 400
                    }
                };
            }

            const post_content = {
                entity_id: post_data.entity_id,
                category_name: post_data.category_name,
                content: post_data.content,
                organization_id: post_data.organization_id,
                user_id: post_data.user_id,
                updated_at: new Date(),
                created_at: new Date()
            }

            const post = await this.postModel.insert(post_content);

            return {
                success: true,
                data: { post: post }
            };
        } catch (error: any) {
            console.error('Error on create post:', error);
            return {
                success: false,
                error: {
                    error: 'Error on create post',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default CreatePostService;