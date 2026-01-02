import { supabase } from "@/src/lib/supabase";
import { ScaleItem } from "../types/scales";

// LISTAR ESCALAS
export async function fetchScales(
    churchId: string
): Promise<ScaleItem[]> {
    const { data, error } = await supabase
        .from("scales")
        .select("id, date, event_name, responsible, ministries")
        .eq("church_id", churchId)
        .order("date", { ascending: true });

    if (error || !data) {
        return [];
    }

    return data.map((row: any) => ({
        id: row.id,
        date: row.date,
        event: row.event_name,
        responsible: row.responsible,
        ministries: row.ministries || [],
    }));
}

// DETALHES DA ESCALA
export async function fetchScaleDetails(scaleId: string, churchId: string) {
    const { data: scale } = await supabase
        .from("scales")
        .select("id, date, event_name, responsible")
        .eq("id", scaleId)
        .single();

    if (!scale) return null;

    const { data: assigns } = await supabase
        .from("scale_assignments")
        .select("ministry_id, member_id")
        .eq("scale_id", scaleId)
        .eq("church_id", churchId);

    if (!assigns?.length) {
        return { scale, grouped: {} };
    }

    const ministryIds = [...new Set(assigns.map(a => a.ministry_id))];
    const memberIds = [...new Set(assigns.map(a => a.member_id))];

    const { data: mins } = await supabase
        .from("ministries")
        .select("id, name")
        .in("id", ministryIds)
        .eq("church_id", churchId);

    const { data: mems } = await supabase
        .from("members")
        .select("id, name")
        .in("id", memberIds)
        .eq("church_id", churchId);

    const mapMin = new Map(mins?.map(m => [m.id, m.name]));
    const mapMem = new Map(mems?.map(m => [m.id, m.name]));

    const grouped: Record<string, string[]> = {};

    assigns.forEach(row => {
        const mName = mapMin.get(row.ministry_id);
        const uName = mapMem.get(row.member_id);
        if (!mName || !uName) return;
        if (!grouped[mName]) grouped[mName] = [];
        grouped[mName].push(uName);
    });

    return { scale, grouped };
}

// EXCLUIR ESCALA
export async function deleteScale(id: string) {
    return supabase.from("scales").delete().eq("id", id);
}
