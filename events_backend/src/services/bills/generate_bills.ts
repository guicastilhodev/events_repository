import { SupabaseClient } from "@supabase/supabase-js";
import BillModel from "../../models/bills";

interface GenerateBillsResponse {
    success: boolean;
    data?: {
        bills: any[];
    };
    error?: {
        error: string;
        message: string;
        status: number;
    };
}

interface GenerateBillsParams {
    subscription_id: number;
    organization_id: string;
    total_amount: number;
    billing_day: number;
    duration: number;  // em meses
    recurrence: 'monthly' | 'yearly';
}

class GenerateBills {

    private billModel: BillModel;

    constructor(supabase_client: SupabaseClient) {
        this.billModel = new BillModel(supabase_client);
    }

    async execute(params: GenerateBillsParams): Promise<GenerateBillsResponse> {
        try {
            const { subscription_id, organization_id, total_amount, billing_day, duration, recurrence } = params;

            const bills = [];
            const startDate = new Date();

            // Calcular número de bills baseado na recorrência
            let numberOfBills: number;
            let monthsInterval: number;

            if (recurrence === 'monthly') {
                numberOfBills = duration; // Se duração é 12 meses, gera 12 bills mensais
                monthsInterval = 1;
            } else { // yearly
                numberOfBills = Math.ceil(duration / 12); // Se duração é 12 meses, gera 1 bill anual
                monthsInterval = 12;
            }

            // Gerar bills
            for (let i = 0; i < numberOfBills; i++) {
                const dueDate = new Date(startDate);
                dueDate.setMonth(dueDate.getMonth() + (i * monthsInterval));
                dueDate.setDate(billing_day);

                // Se o billing_day for maior que o último dia do mês, usar último dia do mês
                const lastDayOfMonth = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0).getDate();
                if (billing_day > lastDayOfMonth) {
                    dueDate.setDate(lastDayOfMonth);
                }

                bills.push({
                    subscription_id,
                    organization_id,
                    total_amount,
                    status: 'pending' as const,
                    due_date: dueDate.toISOString().split('T')[0] // formato YYYY-MM-DD
                });
            }

            // Inserir bills no banco
            const createdBills = await this.billModel.insertMany(bills);

            return {
                success: true,
                data: {
                    bills: createdBills
                }
            };
        } catch (error: any) {
            console.error('Error on generate bills:', error);
            return {
                success: false,
                error: {
                    error: 'Error on generate bills',
                    message: error.message,
                    status: 500
                }
            };
        }
    }
}

export default GenerateBills;
