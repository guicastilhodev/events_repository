import PostModel, { PostFilters, PostListOptions } from "../../models/posts";
import { SupabaseClient } from "@supabase/supabase-js";
import EntityModel from "../../models/entities";
import GetEntityProfilePicture from "../entities/get_entity_profile_picture";

interface ListPostsResponse {
    success: boolean;
    data?: {
        posts: any[];
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

interface ListPostsParams {
    organization_id?: string;
    entity_id?: string;
    category_name?: string;
    user_id?: string;
    archived?: string;
    likes_min?: string;
    likes_max?: string;
    created_after?: string;
    created_before?: string;
    page?: string;
    per_page?: string;
    order_by?: 'created_at' | 'updated_at' | 'likes' | 'comments';
    order_direction?: 'asc' | 'desc';
}

class ListPostsService {
    private supabase_client: SupabaseClient;
    private postModel: PostModel;
    private entityModel: EntityModel;
    private getEntityProfilePicture: GetEntityProfilePicture;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.postModel = new PostModel(supabase_client);
        this.entityModel = new EntityModel(supabase_client);
        this.getEntityProfilePicture = new GetEntityProfilePicture(supabase_client);
    }

    async execute(params: ListPostsParams): Promise<ListPostsResponse> {
        try {
            const page = parseInt(params.page || '1');
            const per_page = Math.min(parseInt(params.per_page || '20'), 100); // Max 100 items per page
            const offset = (page - 1) * per_page;

            const filters: PostFilters = {};

            if (params.organization_id) {
                filters.organization_id = params.organization_id;
            }

            if (params.entity_id) {
                filters.entity_id = params.entity_id;
            }

            if (params.category_name) {
                filters.category_name = params.category_name;
            }

            if (params.user_id) {
                filters.user_id = params.user_id;
            }

            if (params.archived !== undefined) {
                filters.archived = params.archived === 'true';
            }

            if (params.likes_min) {
                const likes_min = parseInt(params.likes_min);
                if (!isNaN(likes_min)) {
                    filters.likes_min = likes_min;
                }
            }

            if (params.likes_max) {
                const likes_max = parseInt(params.likes_max);
                if (!isNaN(likes_max)) {
                    filters.likes_max = likes_max;
                }
            }

            if (params.created_after) {
                const created_after = new Date(params.created_after);
                if (!isNaN(created_after.getTime())) {
                    filters.created_after = created_after;
                }
            }

            if (params.created_before) {
                const created_before = new Date(params.created_before);
                if (!isNaN(created_before.getTime())) {
                    filters.created_before = created_before;
                }
            }

            const options: PostListOptions = {
                filters,
                limit: per_page,
                offset,
                order_by: params.order_by || 'created_at',
                order_direction: params.order_direction || 'desc'
            };

            const result = await this.postModel.list(options);
            const total_pages = Math.ceil(result.total / per_page);

            // Enriquecer posts com dados da entity
            const enrichedPosts = await Promise.all(
                result.posts.map(async (post) => {
                    if (!post.entity_id) {
                        return post;
                    }

                    try {
                        const entity = await this.entityModel.get(post.entity_id);
                        const profilePictureUrl = entity.profile_picture
                            ? await this.getEntityProfilePicture.execute(post.entity_id)
                            : null;

                        return {
                            ...post,
                            entity: {
                                id: entity.id,
                                name: entity.name,
                                profile_picture_url: profilePictureUrl
                            }
                        };
                    } catch (error) {
                        console.error(`Error fetching entity data for entity_id: ${post.entity_id}`, error);
                        return {
                            ...post,
                            entity: {
                                id: post.entity_id,
                                name: 'Entity não encontrada',
                                profile_picture_url: null
                            }
                        };
                    }
                })
            );

            return {
                success: true,
                data: {
                    posts: enrichedPosts,
                    total: result.total,
                    page,
                    per_page,
                    total_pages
                }
            };
        } catch (error: any) {
            console.error('Error on list posts:', error);
            return {
                success: false,
                error: {
                    error: 'Error on list posts',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default ListPostsService;