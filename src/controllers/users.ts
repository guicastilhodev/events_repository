import { Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { ErrorResponse, SuccessResponse } from '../utils/response';
import Me from '../services/users/me';
import PatchUser from '../services/users/patch_user';
import UploadProfilePicture from '../services/users/upload_profile_picture';
import GetProfilePicture from '../services/users/get_profile_picture';


class UsersController {

    constructor(private supabase_client: SupabaseClient, private req: Request, private res: Response) {
        this.supabase_client = supabase_client;
    }

    public async getMe() {
        const user = this.req.user;
        const me = new Me(this.supabase_client);
        const result = await me.execute(user.id);
        
        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Informações do usuário autenticado',
            data: result.data?.user
        });
    }

    public async patchUser() {
        const user = this.req.user;
        const patchUser = new PatchUser(this.supabase_client);
        const result = await patchUser.execute(user.id, this.req.body);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: 400,
                error: "Error on patch user",
                message: "If this problem persists, please contact support"
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Usuário atualizado com sucesso',
            data: result.data?.user
        });
    }

    public async uploadProfilePicture() {
        const user = this.req.user;
        const uploadProfilePicture = new UploadProfilePicture(this.supabase_client);
        const result = await uploadProfilePicture.execute(user.id, this.req.body);
    }

    public async getProfilePicture() {
        const user = this.req.user;
        const getProfilePicture = new GetProfilePicture(this.supabase_client);
        const result = await getProfilePicture.execute(user.id);
    }
}

export default UsersController;