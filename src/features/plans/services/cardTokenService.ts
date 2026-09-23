const PAGARME_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAGARME_PUBLIC_KEY!;

type CardInput = {
    number: string;
    holderName: string;
    expMonth: string;
    expYear: string;
    cvv: string;
};

export async function tokenizeCard(card: CardInput) {
    const res = await fetch(
        `https://api.pagar.me/core/v5/tokens?appId=${PAGARME_PUBLIC_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "card",
                card: {
                    number: card.number.replace(/\s/g, ""),
                    holder_name: card.holderName,
                    exp_month: card.expMonth,
                    exp_year: card.expYear,
                    cvv: card.cvv,
                },
            }),
        }
    );

    const json = await res.json();

    if (!res.ok || !json?.id) {
        throw new Error(json?.message || "Cartão inválido. Verifique os dados e tente novamente.");
    }

    return json.id as string;
}