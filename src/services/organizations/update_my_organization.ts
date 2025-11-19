import { SupabaseClient } from "@supabase/supabase-js";
import OrganizationModel from "../../models/organizations";


interface UpdateMyOrganizationResponse {
    success: boolean;
    data?: any;
    error?: {
        error: string;
        message: string;
        status: number;
    };
}
class UpdateMyOrganization {
    private supabase_client: SupabaseClient;
    private organizationModel: OrganizationModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.organizationModel = new OrganizationModel(supabase_client);
    }

    async execute(organization_id: string, organization_data: any): Promise<UpdateMyOrganizationResponse> {
        const organization = await this.organizationModel.patch(organization_id, organization_data);
        
        if (!organization) {
            return {
                success: false,
                error: {
                    error: 'Organization not found',
                    message: 'Organization not found',
                    status: 404
                }
            };
        }

        return {
            success: true,
            data: organization
        };
    }
}

export default UpdateMyOrganization;