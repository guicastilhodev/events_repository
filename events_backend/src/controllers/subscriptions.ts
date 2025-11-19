import { Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { ErrorResponse, SuccessResponse } from '../utils/response';
import ListSubscriptions from '../services/subscriptions/list_subscriptions';
import GetSubscription from '../services/subscriptions/get_subscription';
import CreateSubscription from '../services/subscriptions/create_subscription';
import UpdateSubscription from '../services/subscriptions/update_subscription';
import DeleteSubscription from '../services/subscriptions/delete_subscription';

class SubscriptionsController {

    constructor(private supabase_client: SupabaseClient, private req: Request, private res: Response) {
        this.supabase_client = supabase_client;
    }

    public async listSubscriptions() {
        const listSubscriptions = new ListSubscriptions(this.supabase_client);
        const result = await listSubscriptions.execute(this.req.state.organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Lista de assinaturas',
            data: result.data?.subscriptions
        });
    }

    public async getSubscription() {
        const subscription_id = parseInt(this.req.params.id);

        const getSubscription = new GetSubscription(this.supabase_client);
        const result = await getSubscription.execute(subscription_id, this.req.state.organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Assinatura encontrada',
            data: result.data?.subscription
        });
    }

    public async createSubscription() {
        const createSubscription = new CreateSubscription(this.supabase_client);
        const result = await createSubscription.execute(this.req.state.organization_id, this.req.body);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 201,
            message: 'Assinatura criada com sucesso',
            data: result.data?.subscription
        });
    }

    public async updateSubscription() {
        const subscription_id = parseInt(this.req.params.id);

        const updateSubscription = new UpdateSubscription(this.supabase_client);
        const result = await updateSubscription.execute(subscription_id, this.req.state.organization_id, this.req.body);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Assinatura atualizada com sucesso',
            data: result.data?.subscription
        });
    }

    public async deleteSubscription() {
        const subscription_id = parseInt(this.req.params.id);

        const deleteSubscription = new DeleteSubscription(this.supabase_client);
        const result = await deleteSubscription.execute(subscription_id, this.req.state.organization_id);

        if (!result.success) {
            return ErrorResponse(this.res, {
                status: result.error!.status,
                error: result.error!.error,
                message: result.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Assinatura excluída com sucesso',
            data: null
        });
    }
}

export default SubscriptionsController;