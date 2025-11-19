import { SupabaseClient } from "@supabase/supabase-js";
import OrganizationModel from "../../models/organizations";


interface Organization {
    id: string;
    name: string;
    cnpj: string;
    additional_info: any;
    created_at: Date;
    updated_at: Date;
    type?: string;
}

interface GetMyOrganizationResponse {
    success: boolean;
    data?: Organization;
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class GetMyOrganization {
    private supabase_client: SupabaseClient;
    private organizationModel: OrganizationModel;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.organizationModel = new OrganizationModel(supabase_client);
    }

    async execute(organization_id: string): Promise<GetMyOrganizationResponse> {
        const organization = await this.organizationModel.get(organization_id);

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
            data:  organization as Organization
        };
    }
}

export default GetMyOrganization;