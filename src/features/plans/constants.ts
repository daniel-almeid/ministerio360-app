import { PlanDefinition } from "./types/plans";

export const PLAN_PRICES: Record<"free" | "standard" | "premium", number> = {
    free: 0,
    standard: 4990,
    premium: 8990,
};

export const PLANS: PlanDefinition[] = [
    {
        slug: "free",
        name: "Grátis",
        price: "R$ 0/mês",
        features: ["Dashboard", "Cadastro de membros", "Cadastro financeiro", "Relatórios simples"],
    },
    {
        slug: "standard",
        name: "Padrão",
        price: "R$ 49,90/mês",
        features: [
            "Dashboard",
            "Cadastro de membros",
            "Cadastro de visitantes",
            "Acompanhamento de visitantes",
            "Cadastro financeiro",
            "Relatórios simples",
        ],
    },
    {
        slug: "premium",
        name: "Premium+",
        price: "R$ 89,90/mês",
        features: [
            "Dashboard",
            "Cadastro de membros",
            "Cadastro de visitantes",
            "Acompanhamento de visitantes",
            "Cadastro financeiro",
            "Cadastro de ministérios",
            "Cadastro de eventos",
            "Cadastro de escalas",
            "Relatórios",
            "Suporte prioritário",
        ],
    },
];