import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { fetchScales, deleteScale } from "../services/scalesService";
import { ScaleItem } from "../types/scales";
import {
    notifyError,
    notifyLoading,
    notifySuccess,
} from "../../../shared/ui/toast";

function groupByDate(scales: ScaleItem[]) {
    const map: Record<string, ScaleItem[]> = {};

    scales.forEach((s) => {
        const key = s.date.slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(s);
    });

    return Object.entries(map).map(([date, items]) => ({
        date,
        items,
    }));
}

export function useScales() {
    const [scales, setScales] = useState<ScaleItem[]>([]);
    const [loading, setLoading] = useState(true);

    // edição / exclusão
    const [selected, setSelected] = useState<ScaleItem | null>(null);

    // modais
    const [showNew, setShowNew] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    // drawer detalhes
    const [detailsScaleId, setDetailsScaleId] = useState<string | null>(null);
    const showDetails = !!detailsScaleId;

    const [deleting, setDeleting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);

        // sessão
        const { data: session } = await supabase.auth.getSession();
        const userId = session.session?.user?.id;

        if (!userId) {
            setScales([]);
            setLoading(false);
            return;
        }

        // church_id via profile (NUNCA app_metadata no mobile)
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("church_id")
            .eq("id", userId)
            .single();

        if (profileError || !profile?.church_id) {
            setScales([]);
            setLoading(false);
            return;
        }

        // carregar escalas
        const data = await fetchScales(profile.church_id);
        setScales(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const grouped = useMemo(() => groupByDate(scales), [scales]);

    // Ações

    function openNew() {
        setSelected(null);
        setShowNew(true);
    }

    function openEdit(item: ScaleItem) {
        setSelected(item);
        setShowNew(true);
    }

    function openDelete(item: ScaleItem) {
        setSelected(item);
        setShowDelete(true);
    }

    function openDetails(item: ScaleItem) {
        setDetailsScaleId(item.id);
    }

    function closeDetails() {
        setDetailsScaleId(null);
    }

    function closeAll() {
        setShowNew(false);
        setShowDelete(false);
        setSelected(null);
        closeDetails();
    }

    async function confirmDelete() {
        if (!selected) return;

        setDeleting(true);
        notifyLoading("Excluindo escala...");

        const { error } = await deleteScale(selected.id);

        if (!error) {
            notifySuccess("Escala excluída");
            await load();
        } else {
            notifyError("Erro ao excluir escala");
        }

        setDeleting(false);
        setShowDelete(false);
        setSelected(null);
    }

    return {
        // dados
        grouped,
        loading,

        // drawer
        showDetails,
        detailsScaleId,

        // modais
        showNew,
        showDelete,
        deleting,
        selected,

        // ações
        openNew,
        openEdit,
        openDelete,
        openDetails,

        closeDetails,
        closeAll,

        confirmDelete,
        load,
    };
}
