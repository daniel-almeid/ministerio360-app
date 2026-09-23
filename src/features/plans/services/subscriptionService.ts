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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ plan_slug: planSlug, email: session.user.email, name }),
    });

    const json = await res.json();

    if (!res.ok || !json?.success || !json?.checkout_url) {
        throw new Error(json?.error || "Erro ao criar pedido de checkout.");
    }

    return json.checkout_url as string;
}

export type SubscribeWithCardInput = {
    planSlug: string;
    cardToken: string;
    document: string;
    phone: { area_code: string; number: string };
    address: { line_1: string; zip_code: string; city: string; state: string };
};

export async function createSubscription(input: SubscribeWithCardInput) {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session?.access_token || !session.user?.email) {
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    const name =
        session.user.user_metadata?.church_name ||
        session.user.user_metadata?.name ||
        "Usuário";

    const res = await fetch(`${API_BASE_URL}/api/pagarme/create-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            plan_slug: input.planSlug,
            card_token: input.cardToken,
            email: session.user.email,
            name,
            document: input.document,
            phone: input.phone,
            address: input.address,
        }),
    });

    const json = await res.json();

    if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao criar assinatura.");
    }

    return json;
}