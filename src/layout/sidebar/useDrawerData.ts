import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function useDrawerData() {
    const [plan, setPlan] = useState<"free" | "standard" | "premium">("free");
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;

        if (!user) return;

        setUserId(user.id);

        const slug = user.app_metadata?.plan_slug;
        if (slug === "free" || slug === "standard" || slug === "premium") {
            setPlan(slug);
        }
    }

    return { plan, userId };
}
