import { Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { ErrorResponse, SuccessResponse } from '../utils/response';
import GetEntity from '../services/entities/get_entity';
import GetEntitiesByOrganization from '../services/entities/get_entities_by_organization';
import CreateEntity from '../services/entities/create_entity';
import PatchEntity from '../services/entities/patch_entity';
import DeleteEntity from '../services/entities/delete_entity';
import UploadEntityProfilePicture from '../services/entities/upload_entity_profile_picture';
import GetEntityProfilePicture from '../services/entities/get_entity_profile_picture';

class EntitiesController {

    constructor(private supabase_client: SupabaseClient, private req: Request, private res: Response) {
        this.supabase_client = supabase_client;
    }

    public async getEntity() {
        const { entity_id } = this.req.params;
        const getEntity = new GetEntity(this.supabase_client);
        const result = await getEntity.execute(entity_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Entity encontrada com sucesso',
            data: result.data?.entity
        });
    }

    public async getEntitiesByOrganization() {
        const organization_id = this.req.state.organization_id;
        const getEntitiesByOrganization = new GetEntitiesByOrganization(this.supabase_client);
        const result = await getEntitiesByOrganization.execute(this.req.state.organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Entities encontradas com sucesso',
            data: result.data?.entities
        });
    }

    public async createEntity() {
        const organization_id = this.req.state?.organization_id || this.req.user?.user_metadata?.organization_id;

        if (!organization_id) {
            return ErrorResponse(this.res, {
                status: 400,
                error: "Missing organization_id",
                message: "User does not have an organization_id. Please contact support."
            });
        }

        const createEntity = new CreateEntity(this.supabase_client);
        const profilePictureFile = (this.req.files as any)?.profile_picture?.[0];

        const result = await createEntity.execute({
            name: this.req.body.name,
            description: this.req.body.description,
            additional_info: this.req.body.additional_info,
            organization_id: organization_id,
            profile_picture_file: profilePictureFile
        });

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 201,
            message: 'Entity criada com sucesso',
            data: result.data?.entity
        });
    }

    public async patchEntity() {
        const { entity_id } = this.req.params;
        const patchEntity = new PatchEntity(this.supabase_client);
        const profilePictureFile = (this.req.files as any)?.profile_picture?.[0];

        const result = await patchEntity.execute(entity_id, {
            ...this.req.body,
            profile_picture_file: profilePictureFile
        });

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: 400,
                error: "Error on patch entity",
                message: "If this problem persists, please contact support"
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Entity atualizada com sucesso',
            data: result.data?.entity
        });
    }

    public async deleteEntity() {
        const { entity_id } = this.req.params;
        const deleteEntity = new DeleteEntity(this.supabase_client);
        const result = await deleteEntity.execute(entity_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Entity deletada com sucesso'
        });
    }

    public async uploadProfilePicture() {
        const { entity_id } = this.req.params;

        if (!this.req.file) {
            return ErrorResponse(this.res, {
                status: 400,
                error: "No file provided",
                message: "Please provide a file to upload"
            });
        }

        const uploadEntityProfilePicture = new UploadEntityProfilePicture(this.supabase_client);
        const result = await uploadEntityProfilePicture.execute(entity_id, this.req.file);

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Profile picture uploaded successfully',
            data: result
        });
    }

    public async getProfilePicture() {
        const { entity_id } = this.req.params;
        const getEntityProfilePicture = new GetEntityProfilePicture(this.supabase_client);
        const result = await getEntityProfilePicture.execute(entity_id);

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Profile picture URL',
            data: { profile_picture_url: result }
        });
    }
}

export default EntitiesController;