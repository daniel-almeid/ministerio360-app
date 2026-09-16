export type PlanSlug = "free" | "standard" | "premium";

export type PlanDefinition = {
    slug: PlanSlug;
    name: string;
    price: string;
    features: string[];
};