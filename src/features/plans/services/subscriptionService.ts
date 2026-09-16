import { supabase } from "../../../lib/supabase";

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://ministerio360.vercel.app";

export async function createCheckoutOrder(planSlug: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session?.access_token || !session.user?.email) {
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    const name =
        session.user.user_metadata?.church_name ||
        session.user.user_metadata?.name ||
        "Usuário";

    const res = await fetch(`${API_BASE_URL}/api/pagarme/create-checkout-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
            plan_slug: planSlug,
            email: session.user.email,
            name,
        }),
    });

    const json = await res.json();

    if (!res.ok || !json?.success || !json?.checkout_url) {
        throw new Error(json?.error || "Erro ao criar pedido de checkout.");
    }

    return json.checkout_url as string;
}