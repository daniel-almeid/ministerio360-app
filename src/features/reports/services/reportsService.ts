import { supabase } from "../../../lib/supabase";
import type { FinancialReportItem } from "../types/types";

async function getChurchId() {
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
        throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("church_id")
        .eq("id", auth.user.id)
        .single();

    if (error || !data?.church_id) {
        throw new Error("church_id não encontrado");
    }

    return data.church_id as string;
}

export async function fetchFinancialReport(month: string) {
    const churchId = await getChurchId();

    const [year, monthNum] = month.split("-");
    const start = new Date(Number(year), Number(monthNum) - 1, 1);
    const end = new Date(Number(year), Number(monthNum), 0, 23, 59, 59);

    const { data, error } = await supabase
        .from("transactions")
        .select("category, type, amount, created_at")
        .eq("church_id", churchId)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

    if (error) throw error;

    const grouped: Record<string, { income: number; expense: number }> = {};

    data?.forEach((t) => {
        const category = t.category || "Sem categoria";

        if (!grouped[category]) {
            grouped[category] = { income: 0, expense: 0 };
        }

        if (t.type === "entrada") grouped[category].income += Number(t.amount);
        if (t.type === "saida") grouped[category].expense += Number(t.amount);
    });

    return Object.entries(grouped).map(([category, values]) => ({
        category,
        income: values.income,
        expense: values.expense,
        balance: values.income - values.expense,
    })) as FinancialReportItem[];
}

export async function fetchMembersReport(month: string) {
    const churchId = await getChurchId();

    const [year, monthNum] = month.split("-");
    const start = new Date(Number(year), Number(monthNum) - 1, 1);
    const end = new Date(Number(year), Number(monthNum), 0, 23, 59, 59);

    const { data: members } = await supabase
        .from("members")
        .select("id")
        .eq("church_id", churchId)
        .eq("is_active", true);

    const { data: visitors } = await supabase
        .from("visitors")
        .select("id")
        .eq("church_id", churchId)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

    return {
        activeMembers: members?.length || 0,
        monthlyVisitors: visitors?.length || 0,
    };
}
