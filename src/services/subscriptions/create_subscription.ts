import { SupabaseClient } from "@supabase/supabase-js";
import SubscriptionModel from "../../models/subscriptions";
import GenerateBills from "../bills/generate_bills";

interface CreateSubscriptionResponse {
    success: boolean;
    data?: {
        subscription: any;
        bills?: any[];
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

class CreateSubscription {

    private supabase_client: SupabaseClient;
    private subscriptionModel: SubscriptionModel;
    private generateBills: GenerateBills;

    constructor(supabase_client: SupabaseClient) {
        this.supabase_client = supabase_client;
        this.subscriptionModel = new SubscriptionModel(supabase_client);
        this.generateBills = new GenerateBills(supabase_client);
    }

    async execute(organization_id: string, subscriptionData: any): Promise<CreateSubscriptionResponse> {
        try {
            // Validar campos obrigatórios
            if (!subscriptionData.total_amount || parseFloat(subscriptionData.total_amount) <= 0) {
                return {
                    success: false,
                    error: {
                        error: 'Validation error',
                        message: 'Total amount is required and must be greater than 0',
                        status: 400
                    }
                };
            }

            // Mapear campos do payload para o schema do banco
            const { periodicity, status, ...restData } = subscriptionData;

            const subscriptionToInsert = {
                ...restData,
                organization_id,
                recurrence: periodicity || subscriptionData.recurrence || null
            };

            const subscription = await this.subscriptionModel.insert(subscriptionToInsert);

            // Gerar bills automaticamente se billing_day, duration e recurrence forem fornecidos
            const recurrence = periodicity || subscriptionData.recurrence;
            if (subscriptionData.billing_day && subscriptionData.duration && recurrence) {
                const billsResult = await this.generateBills.execute({
                    subscription_id: subscription.id!,
                    organization_id,
                    total_amount: parseFloat(subscriptionData.total_amount),
                    billing_day: subscriptionData.billing_day,
                    duration: subscriptionData.duration,
                    recurrence: recurrence
                });

                if (!billsResult.success) {
                    console.error('Error generating bills:', billsResult.error);
                    // Retornar subscription mesmo se bills falharem
                    return {
                        success: true,
                        data: {
                            subscription,
                            bills: []
                        }
                    };
                }

                return {
                    success: true,
                    data: {
                        subscription,
                        bills: billsResult.data?.bills || []
                    }
                };
            }

            // Se não houver billing_day/duration, retornar subscription sem bills
            return {
                success: true,
                data: {
                    subscription,
                    bills: []
                }
            };
        } catch (error: any) {
            console.error('Error on create subscription:', error);
            return {
                success: false,
                error: {
                    error: 'Error on create subscription',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default CreateSubscription;
