import { Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { ErrorResponse, SuccessResponse } from '../utils/response';
import ListSubscribers from '../services/subscribers/list_subscribers';
import GetSubscriber from '../services/subscribers/get_subscriber';
import CreateSubscriber from '../services/subscribers/create_subscriber';
import UpdateSubscriber from '../services/subscribers/update_subscriber';
import DeleteSubscriber from '../services/subscribers/delete_subscriber';

class SubscribersController {

    constructor(private supabase_client: SupabaseClient, private req: Request, private res: Response) {
        this.supabase_client = supabase_client;
    }

    public async listSubscribers() {
        const organization_id = this.req.state.organization_id;
        const listSubscribers = new ListSubscribers(this.supabase_client);
        const result = await listSubscribers.execute(organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Lista de assinantes',
            data: result.data?.subscribers
        });
    }

    public async getSubscriber() {
        const organization_id = this.req.state.organization_id;
        const subscriber_id = parseInt(this.req.params.id);

        if (isNaN(subscriber_id)) {
            return ErrorResponse(this.res, {
                status: 400,
                error: 'Invalid ID',
                message: 'Subscriber ID must be a number'
            });
        }

        const getSubscriber = new GetSubscriber(this.supabase_client);
        const result = await getSubscriber.execute(subscriber_id, organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Assinante encontrado',
            data: result.data?.subscriber
        });
    }

    public async createSubscriber() {
        const organization_id = this.req.state.organization_id;
        const createSubscriber = new CreateSubscriber(this.supabase_client);
        const result = await createSubscriber.execute(organization_id, this.req.body);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 201,
            message: 'Assinante criado com sucesso',
            data: result.data?.subscriber
        });
    }

    public async updateSubscriber() {
        const organization_id = this.req.state.organization_id;
        const subscriber_id = parseInt(this.req.params.id);

        if (isNaN(subscriber_id)) {
            return ErrorResponse(this.res, {
                status: 400,
                error: 'Invalid ID',
                message: 'Subscriber ID must be a number'
            });
        }

        const updateSubscriber = new UpdateSubscriber(this.supabase_client);
        const result = await updateSubscriber.execute(subscriber_id, organization_id, this.req.body);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Assinante atualizado com sucesso',
            data: result.data?.subscriber
        });
    }

    public async deleteSubscriber() {
        const organization_id = this.req.state.organization_id;
        const subscriber_id = parseInt(this.req.params.id);

        if (isNaN(subscriber_id)) {
            return ErrorResponse(this.res, {
                status: 400,
                error: 'Invalid ID',
                message: 'Subscriber ID must be a number'
            });
        }

        const deleteSubscriber = new DeleteSubscriber(this.supabase_client);
        const result = await deleteSubscriber.execute(subscriber_id, organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Assinante excluído com sucesso',
            data: null
        });
    }
}

export default SubscribersController;
