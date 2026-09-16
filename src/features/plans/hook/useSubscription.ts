import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { PLANS, PLAN_PRICES } from "../constants";
import type { PlanSlug } from "../types/plans";

type ChurchProfileRow = {
    plan_slug: PlanSlug;
    subscription_active: boolean;
    plan_expires_at: string | null;
};

export function useSubscription() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ChurchProfileRow | null>(null);

    const load = useCallback(async () => {
        setLoading(true);

        const { data } = await supabase.auth.getUser();
        const churchId = data.user?.app_metadata?.church_id as string | undefined;

        if (!churchId) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const { data: row } = await supabase
            .from("church_profiles")
            .select("plan_slug, subscription_active, plan_expires_at")
            .eq("id", churchId)
            .single<ChurchProfileRow>();

        setProfile(row ?? null);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const planSlug = (profile?.plan_slug ?? "free") as PlanSlug;
    const currentPlan = PLANS.find((p) => p.slug === planSlug)!;
    const price = (PLAN_PRICES[planSlug] ?? 0) / 100;
    const isActive = profile?.subscription_active ?? false;
    const hasPaidPlan = planSlug !== "free";

    const expiresOn = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null;
    const formattedExpiresOn = expiresOn ? expiresOn.toLocaleDateString("pt-BR") : null;

    const now = new Date();
    let progressPercent = 0;
    let formattedNextPayment: string | null = null;
    let formattedLastPayment: string | null = null;

    if (expiresOn) {
        const start = new Date(expiresOn);
        start.setDate(start.getDate() - 30);

        const total = expiresOn.getTime() - start.getTime();
        const used = now.getTime() - start.getTime();

        progressPercent = Math.round(Math.min(100, Math.max(0, (used / total) * 100)));
        formattedNextPayment = expiresOn.toLocaleDateString("pt-BR");
        formattedLastPayment = start.toLocaleDateString("pt-BR");
    }

    return {
        loading,
        planSlug,
        currentPlan,
        price,
        isActive,
        formattedExpiresOn,
        formattedLastPayment,
        formattedNextPayment,
        progressPercent,
        hasPaidPlan,
        reload: load,
    };
}