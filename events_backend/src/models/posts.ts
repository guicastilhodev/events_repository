import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

interface Like {
    user_id: string;
    created_at: Date;
}

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: Date;
}

interface Post {
    id: string;
    organization_id: string;
    entity_id: string;
    category_name: string;
    content: string;
    likes: Like[];
    comments: Comment[];
    archived: boolean;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
    user_id: string;
}

interface CreatePost {
    organization_id: string;
    entity_id: string;
    category_name: string;
    content: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

interface PostFilters {
    organization_id?: string;
    entity_id?: string;
    category_name?: string;
    user_id?: string;
    archived?: boolean;
    deleted?: boolean;
    likes_min?: number;
    likes_max?: number;
    created_after?: Date;
    created_before?: Date;
}

interface PostListOptions {
    filters?: PostFilters;
    limit?: number;
    offset?: number;
    order_by?: 'created_at' | 'updated_at' | 'likes' | 'comments';
    order_direction?: 'asc' | 'desc';
}

class PostModel {
    constructor(public supabase_client: SupabaseClient) {}

    async insert(post: CreatePost): Promise<Post> {
        const postData = {
            ...post,
            id: randomUUID(),
            likes: [],
            comments: [],
            archived: false,
            deleted: false,
            created_at: new Date(),
            updated_at: new Date()
        };

        const { data, error } = await this.supabase_client
            .from('posts')
            .insert(postData)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as Post;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase_client
            .from('posts')
            .update({ deleted: true, updated_at: new Date() })
            .eq('id', id);

        if (error) {
            throw error;
        }
    }

    async list(options: PostListOptions = {}): Promise<{ posts: Post[]; total: number }> {
        const {
            filters = {},
            limit = 20,
            offset = 0,
            order_by = 'created_at',
            order_direction = 'desc'
        } = options;

        let query = this.supabase_client
            .from('posts')
            .select('*', { count: 'exact' })
            .eq('deleted', false);

        if (filters.organization_id) {
            query = query.eq('organization_id', filters.organization_id);
        }

        if (filters.entity_id) {
            query = query.eq('entity_id', filters.entity_id);
        }

        if (filters.category_name) {
            query = query.eq('category_name', filters.category_name);
        }

        if (filters.user_id) {
            query = query.eq('user_id', filters.user_id);
        }

        if (filters.archived !== undefined) {
            query = query.eq('archived', filters.archived);
        }

        if (filters.likes_min !== undefined) {
            query = query.gte('likes', filters.likes_min);
        }

        if (filters.likes_max !== undefined) {
            query = query.lte('likes', filters.likes_max);
        }

        if (filters.created_after) {
            query = query.gte('created_at', filters.created_after.toISOString());
        }

        if (filters.created_before) {
            query = query.lte('created_at', filters.created_before.toISOString());
        }

        query = query
            .order(order_by, { ascending: order_direction === 'asc' })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        return {
            posts: (data || []) as Post[],
            total: count || 0
        };
    }

    async get(id: string): Promise<Post> {
        const { data, error } = await this.supabase_client
            .from('posts')
            .select()
            .eq('id', id)
            .eq('deleted', false)
            .single();

        if (error) {
            throw error;
        }

        return data as Post;
    }

    async archive(id: string): Promise<Post> {
        const { data, error } = await this.supabase_client
            .from('posts')
            .update({ archived: true, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as Post;
    }

    async unarchive(id: string): Promise<Post> {
        const { data, error } = await this.supabase_client
            .from('posts')
            .update({ archived: false, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as Post;
    }

    async addLike(post_id: string, user_id: string): Promise<Post> {
        const post = await this.get(post_id);

        const existingLike = post.likes.find(like => like.user_id === user_id);
        if (existingLike) {
            throw new Error('User already liked this post');
        }

        const newLike: Like = {
            user_id,
            created_at: new Date()
        };

        const updatedLikes = [...post.likes, newLike];

        const { data, error } = await this.supabase_client
            .from('posts')
            .update({
                likes: updatedLikes,
                updated_at: new Date()
            })
            .eq('id', post_id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as Post;
    }

    async removeLike(post_id: string, user_id: string): Promise<Post> {
        const post = await this.get(post_id);

        const updatedLikes = post.likes.filter(like => like.user_id !== user_id);

        const { data, error } = await this.supabase_client
            .from('posts')
            .update({
                likes: updatedLikes,
                updated_at: new Date()
            })
            .eq('id', post_id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as Post;
    }

    async addComment(post_id: string, user_id: string, content: string): Promise<Post> {
        const post = await this.get(post_id);

        const newComment: Comment = {
            id: crypto.randomUUID(),
            user_id,
            content,
            created_at: new Date()
        };

        const updatedComments = [...post.comments, newComment];

        const { data, error } = await this.supabase_client
            .from('posts')
            .update({
                comments: updatedComments,
                updated_at: new Date()
            })
            .eq('id', post_id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as Post;
    }

    async removeComment(post_id: string, comment_id: string): Promise<Post> {
        const post = await this.get(post_id);

        const updatedComments = post.comments.filter(comment => comment.id !== comment_id);

        const { data, error } = await this.supabase_client
            .from('posts')
            .update({
                comments: updatedComments,
                updated_at: new Date()
            })
            .eq('id', post_id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as Post;
    }
}

export default PostModel;
export { Post, CreatePost, PostFilters, PostListOptions, Like, Comment };