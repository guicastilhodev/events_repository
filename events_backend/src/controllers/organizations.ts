import { SupabaseClient } from "@supabase/supabase-js";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { Request, Response } from "express";
import GetMyOrganization from "../services/organizations/get_my_organization";
import UpdateMyOrganization from "../services/organizations/update_my_organization";

class OrganizationsController {
    constructor(private supabase_client: SupabaseClient, private req: Request, private res: Response) {
        this.supabase_client = supabase_client;
    }

    public async getMyOrganization() {
        const organization = await new GetMyOrganization(this.supabase_client).execute(this.req.state.organization_id);

        if (!organization.success) {
            return ErrorResponse(this.res, {
                status: organization.error!.status,
                error: organization.error!.error,
                message: organization.error!.message
            });
        }
        return SuccessResponse(this.res, {
            status: 200,
            message: 'Organization found',
            data: organization.data
        });
    }

    public async updateMyOrganization() {
        const organization = await new UpdateMyOrganization(this.supabase_client).execute(this.req.state.organization_id, this.req.body);
    
        if (!organization.success) {
            return ErrorResponse(this.res, {
                status: organization.error!.status,
                error: organization.error!.error,
                message: organization.error!.message
            });
        }

        return SuccessResponse(this.res, {
            status: 200,
            message: 'Organization updated',
            data: organization.data
        });
    }
}

export default OrganizationsController;