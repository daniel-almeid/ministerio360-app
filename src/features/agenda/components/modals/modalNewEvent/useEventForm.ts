import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../../../../lib/supabase";

export function useEventForm(
    eventData: any,
    onSuccess: () => void,
    onClose: () => void
) {
    const [form, setForm] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
    });

    const [ministries, setMinistries] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadMinistries();
        if (eventData) loadData();
    }, [eventData]);

    async function loadMinistries() {
        const { data } = await supabase
            .from("ministries")
            .select("id, name")
            .order("name");

        setMinistries(data || []);
    }

    async function loadData() {
        setForm({
            title: eventData.title,
            date: eventData.date?.slice(0, 10) || "",
            time: eventData.time || "",
            location: eventData.location || "",
        });

        const { data } = await supabase
            .from("event_ministries")
            .select("ministry_id")
            .eq("event_id", eventData.id);

        setSelected(data?.map((x: any) => x.ministry_id) || []);
    }

    function toggle(id: string) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    async function submit() {
        setSaving(true);

        const { data } = await supabase.auth.getSession();
        const churchId = data.session?.user?.app_metadata?.church_id;

        const isoDate = form.date ? `${form.date}T12:00:00` : null;

        const payload = {
            title: form.title,
            date: isoDate,
            time: form.time,
            location: form.location || null,
            church_id: churchId,
        };

        let eventId = eventData?.id || null;

        if (eventData) {
            await supabase.from("events").update(payload).eq("id", eventId);
        } else {
            const { data: created } = await supabase
                .from("events")
                .insert([payload])
                .select("id")
                .single();

            eventId = created?.id;
        }

        await supabase.from("event_ministries").delete().eq("event_id", eventId);

        if (selected.length > 0) {
            const rows = selected.map((m) => ({
                event_id: eventId,
                ministry_id: m,
            }));

            await supabase.from("event_ministries").insert(rows);
        }

        Alert.alert("Sucesso", "Evento salvo com sucesso");
        onSuccess();
        onClose();
        setSaving(false);
    }

    return {
        form,
        setForm,
        ministries,
        selected,
        toggle,
        submit,
        saving,
    };
}
