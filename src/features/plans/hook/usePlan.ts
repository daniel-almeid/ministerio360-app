import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import type { PlanSlug } from "../types/plans";

export function usePlan() {
    const [loading, setLoading] = useState(true);
    const [currentPlan, setCurrentPlan] = useState<PlanSlug>("free");
    const [active, setActive] = useState(false);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);

        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;

        const slug = (user?.app_metadata?.plan_slug ?? "free") as PlanSlug;
        const subscriptionActive = user?.app_metadata?.subscription_active ?? false;

        setCurrentPlan(slug);
        setActive(subscriptionActive);
        setLoading(false);
    }

    return { loading, currentPlan, active, refresh: load };
}