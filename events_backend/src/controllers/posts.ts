import { Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { ErrorResponse, SuccessResponse } from '../utils/response';
import CreatePostService from '../services/posts/create_post';
import DeletePostService from '../services/posts/delete_post';
import ListPostsService from '../services/posts/list_posts';
import LikePostService from '../services/posts/like_post';
import UnlikePostService from '../services/posts/unlike_post';
import AddCommentService from '../services/posts/add_comment';
import RemoveCommentService from '../services/posts/remove_comment';
import axios from 'axios';

// Função utilitária para remover tags HTML
function stripHtmlTags(html: string): string {
    // Remove tags HTML e decodifica entidades HTML básicas
    return html
        .replace(/<[^>]*>/g, '') // Remove todas as tags HTML
        .replace(/&nbsp;/g, ' ') // Substitui &nbsp; por espaço
        .replace(/&amp;/g, '&')  // Substitui &amp; por &
        .replace(/&lt;/g, '<')   // Substitui &lt; por <
        .replace(/&gt;/g, '>')   // Substitui &gt; por >
        .replace(/&quot;/g, '"') // Substitui &quot; por "
        .replace(/&#39;/g, "'")  // Substitui &#39; por '
        .replace(/\s+/g, ' ')    // Remove espaços múltiplos
        .trim();                 // Remove espaços no início e fim
}

class PostsController {

    constructor(private supabase_client: SupabaseClient, private req: Request, private res: Response) {
        this.supabase_client = supabase_client;
    }

    public async createPost() {
        const body = this.req.body;
        const user = this.req.user;
        const createPostService = new CreatePostService(this.supabase_client);

        const result = await createPostService.execute({
            entity_id: this.req.body.entity_id,
            category_name: this.req.body.category_name,
            content: this.req.body.content,
            organization_id: this.req.state.organization_id,
            user_id: user.id
        });

        if( body.whatsapp_broadcast){
            await axios.post(`https://external-projects-n8n.pgrdwy.easypanel.host/webhook/e401602b-724f-4da1-942a-b8a5a7ddf4de`, {
                message: body.content.replaceAll("<br>", "\n"),
                to: body.whatsapp_broadcast
            });
        }

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 201,
            message: 'Post criado com sucesso',
            data: result.data?.post
        });
    }

    public async deletePost() {
        const { post_id } = this.req.params;
        const deletePostService = new DeletePostService(this.supabase_client);

        const result = await deletePostService.execute(post_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Post deletado com sucesso'
        });
    }

    public async listPosts() {
        const user = this.req.user;
        const listPostsService = new ListPostsService(this.supabase_client);

        const params = {
            ...this.req.query,
            organization_id: user.organization_id
        };

        const result = await listPostsService.execute(params);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Posts listados com sucesso',
            data: result.data
        });
    }

    public async listAllPosts() {
        const listPostsService = new ListPostsService(this.supabase_client);

        const result = await listPostsService.execute(this.req.query);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Posts listados com sucesso',
            data: result.data
        });
    }

    public async likePost() {
        const { post_id } = this.req.params;
        const user = this.req.user;
        const likePostService = new LikePostService(this.supabase_client);

        const result = await likePostService.execute(post_id, user.id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Post curtido com sucesso',
            data: result.data?.post
        });
    }

    public async unlikePost() {
        const { post_id } = this.req.params;
        const user = this.req.user;
        const unlikePostService = new UnlikePostService(this.supabase_client);

        const result = await unlikePostService.execute(post_id, user.id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Like removido com sucesso',
            data: result.data?.post
        });
    }

    public async addComment() {
        const { post_id } = this.req.params;
        const user = this.req.user;
        const addCommentService = new AddCommentService(this.supabase_client);

        const result = await addCommentService.execute(post_id, user.id, this.req.body);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 201,
            message: 'Comentário adicionado com sucesso',
            data: result.data?.post
        });
    }

    public async removeComment() {
        const { post_id, comment_id } = this.req.params;
        const user = this.req.user;
        const removeCommentService = new RemoveCommentService(this.supabase_client);

        const result = await removeCommentService.execute(post_id, comment_id, user.id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Comentário removido com sucesso',
            data: result.data?.post
        });
    }
}

export default PostsController;