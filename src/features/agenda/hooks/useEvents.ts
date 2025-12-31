import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { fetchEvents, deleteEvent } from "../services/eventsService";
import { EventItem, Ministry } from "../types/agenda";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

    const [filterMinistry, setFilterMinistry] = useState("");
    const [grouped, setGrouped] = useState<Record<string, EventItem[]>>({});
    const [nextEvent, setNextEvent] = useState<EventItem | null>(null);

    useEffect(() => {
        load();
    }, [filterMinistry]);

    async function load() {
        setLoading(true);

        let data = await fetchEvents();

        if (filterMinistry) {
            data = data.filter((ev: any) =>
                ev.ministries?.some((m: any) => m.name === filterMinistry)
            );
        }

        const now = new Date();
        const upcoming = data.filter((ev) => parseISO(ev.date) >= now);
        setNextEvent(upcoming[0] ?? null);

        const groups: Record<string, EventItem[]> = {};

        data.forEach((ev) => {
            const month = format(parseISO(ev.date), "MMMM yyyy", { locale: ptBR });
            if (!groups[month]) groups[month] = [];
            groups[month].push(ev);
        });

        setEvents(data);
        setGrouped(groups);
        setLoading(false);
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

        setDeleting(true);
        const { error } = await deleteEvent(selected.id);

        if (!error) {
            Alert.alert("Sucesso", "Evento excluído");
            await load();
        } else {
            Alert.alert("Erro", "Erro ao excluir evento");
        }

        setDeleting(false);
        closeAll();
    }

    return {
        loading,
        grouped,
        nextEvent,

        filterMinistry,
        setFilterMinistry,

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
