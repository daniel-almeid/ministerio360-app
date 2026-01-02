import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { fetchScales, deleteScale } from "../services/scalesService";
import { ScaleItem } from "../types/scales";
import { notifyError, notifyLoading, notifySuccess } from "../../../shared/ui/toast";

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

    const [selected, setSelected] = useState<ScaleItem | null>(null);

    const [showNew, setShowNew] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    // DETALHES
    const [showDetails, setShowDetails] = useState(false);
    const [detailsScaleId, setDetailsScaleId] = useState<string | null>(null);

    const [deleting, setDeleting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);

        const { data: session } = await supabase.auth.getSession();
        const churchId = session.session?.user?.app_metadata?.church_id;

        if (!churchId) {
            setScales([]);
            setLoading(false);
            return;
        }

        const data = await fetchScales(churchId);
        setScales(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const grouped = useMemo(() => groupByDate(scales), [scales]);

    function openNew() {
        setSelected(null);
        setShowNew(true);
    }

    function openEdit(item: ScaleItem) {
        setSelected(item);
        setShowEdit(true);
    }

    function openDelete(item: ScaleItem) {
        setSelected(item);
        setShowDelete(true);
    }

    // abrir detalhes
    function openDetails(item: ScaleItem) {
        setDetailsScaleId(item.id);
        setShowDetails(true);
    }

    function closeDetails() {
        setShowDetails(false);
        setDetailsScaleId(null);
    }

    function closeAll() {
        setShowNew(false);
        setShowEdit(false);
        setShowDelete(false);
        setSelected(null);
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
        grouped,
        loading,

        selected,

        showNew,
        showEdit,
        showDelete,

        // details
        showDetails,
        detailsScaleId,
        openDetails,
        closeDetails,

        deleting,

        openNew,
        openEdit,
        openDelete,
        confirmDelete,
        closeAll,
        load,
    };
}
