import { supabase } from "@/src/lib/supabase";
import { ScaleItem } from "../types/scales";

export async function fetchScales(churchId: string): Promise<ScaleItem[]> {
    const { data, error } = await supabase
        .from("scales")
        .select("id, date, event_name, responsible, ministries")
        .eq("church_id", churchId)
        .order("date");

    if (error) return [];

    return (
        data?.map((row: any) => ({
            id: row.id,
            date: row.date,
            event: row.event_name,
            responsible: row.responsible,
            ministries: row.ministries || [],
        })) ?? []
    );
}

export async function fetchScaleDetails(scaleId: string) {
    const { data: scale, error: scaleError } = await supabase
        .from("scales")
        .select("id, date, event_name, responsible")
        .eq("id", scaleId)
        .single();

    if (scaleError || !scale) return null;

    const { data: assignments } = await supabase
        .from("scale_assignments")
        .select("ministry_id, member_id")
        .eq("scale_id", scaleId);

    if (!assignments || assignments.length === 0) {
        return {
            scale,
            grouped: {},
        };
    }

    const ministryIds = [...new Set(assignments.map((a) => a.ministry_id))];
    const memberIds = [...new Set(assignments.map((a) => a.member_id))];

    const { data: ministries } = await supabase
        .from("ministries")
        .select("id, name")
        .in("id", ministryIds);

    const { data: members } = await supabase
        .from("members")
        .select("id, name")
        .in("id", memberIds);

    const ministryMap = new Map(ministries?.map((m) => [m.id, m.name]));
    const memberMap = new Map(members?.map((m) => [m.id, m.name]));

    const grouped: Record<string, string[]> = {};

    assignments.forEach((row) => {
        const ministryName = ministryMap.get(row.ministry_id);
        const memberName = memberMap.get(row.member_id);

        if (!ministryName || !memberName) return;

        if (!grouped[ministryName]) grouped[ministryName] = [];
        grouped[ministryName].push(memberName);
    });

    return {
        scale,
        grouped,
    };
}

export async function deleteScale(id: string) {
    return supabase.from("scales").delete().eq("id", id);
}
