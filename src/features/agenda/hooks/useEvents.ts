import { useEffect, useState } from "react";
import { fetchEvents, deleteEvent } from "../services/eventsService";
import { EventItem, Ministry } from "../types/agenda";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    notifySuccess,
    notifyError,
    notifyLoading,
    dismissToast,
} from "@/src/shared/ui/toast";

export function useEvents(
    ministries: Ministry[],
    onRefresh: () => void
) {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<EventItem | null>(null);

    const [showNew, setShowNew] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [grouped, setGrouped] = useState<Record<string, EventItem[]>>({});
    const [nextEvent, setNextEvent] = useState<EventItem | null>(null);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setLoading(true);

            const data = await fetchEvents();

            const now = new Date();
            const upcoming = data.filter((ev) => parseISO(ev.date) >= now);
            setNextEvent(upcoming[0] ?? null);

            const groups: Record<string, EventItem[]> = {};

            data.forEach((ev) => {
                const monthLabel = format(parseISO(ev.date), "MMMM yyyy", {
                    locale: ptBR,
                });

                if (!groups[monthLabel]) groups[monthLabel] = [];
                groups[monthLabel].push(ev);
            });

            setEvents(data);
            setGrouped(groups);
        } catch (error) {
            notifyError("Erro ao carregar eventos");
        } finally {
            setLoading(false);
        }
    }

    function openNew() {
        setSelected(null);
        setShowNew(true);
    }

    function openEdit(ev: EventItem) {
        setSelected(ev);
        setShowEdit(true);
    }

    function openDelete(ev: EventItem) {
        setSelected(ev);
        setShowDelete(true);
    }

    function closeAll() {
        setShowNew(false);
        setShowEdit(false);
        setShowDelete(false);
        setSelected(null);
    }

    async function confirmDelete() {
        if (!selected) return;

        try {
            setDeleting(true);
            notifyLoading("Excluindo evento...");

            const { error } = await deleteEvent(selected.id);
            dismissToast();

            if (error) {
                notifyError("Erro ao excluir evento");
                return;
            }

            notifySuccess("Evento excluído com sucesso");
            await load();
        } catch (error) {
            notifyError("Erro inesperado ao excluir evento");
        } finally {
            setDeleting(false);
            closeAll();
        }
    }

    return {
        loading,
        grouped,
        nextEvent,
        selected,
        showNew,
        showEdit,
        showDelete,
        deleting,
        load,
        openNew,
        openEdit,
        openDelete,
        closeAll,
        confirmDelete,
    };
}
