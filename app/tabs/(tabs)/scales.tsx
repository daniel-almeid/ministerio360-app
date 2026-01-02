import { useEffect, useState } from "react";
import { View } from "react-native";
import { supabase } from "@/src/lib/supabase";
import ScaleSection from "@/src/features/scales/scalesSection";
import Loading from "@/src/shared/ui/loading";
import { MinistryLite } from "@/src/features/scales/types/scales";

export default function ScalesScreen() {
    const [ministries, setMinistries] = useState<MinistryLite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMinistries();
    }, []);

    async function loadMinistries() {
        setLoading(true);

        const { data } = await supabase
            .from("ministries")
            .select("id, name")
            .order("name");

        setMinistries((data || []) as MinistryLite[]);
        setLoading(false);
    }

    if (loading) {
        return <Loading visible />;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScaleSection ministries={ministries} />
        </View>
    );
}
