import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { notifyError, notifySuccess, notifyLoading } from "../../../shared/ui/toast";
import { MinistryLite, MemberLite, ScaleItem } from "../types/scales";

type FormState = {
    date: string;
    event: string;
    responsible: string;
    ministriesSelected: string[];
    assignments: Record<string, string[]>;
};

export function useScaleForm(
    onSuccess: () => void | Promise<void>,
    onClose: () => void,
    ministries: MinistryLite[],
    scaleData?: ScaleItem
) {
    const [form, setForm] = useState<FormState>({
        date: "",
        event: "",
        responsible: "",
        ministriesSelected: [],
        assignments: {},
    });

    const [members, setMembers] = useState<MemberLite[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadMembers();
    }, []);

    useEffect(() => {
        if (!scaleData) return;

        setForm({
            date: scaleData.date.slice(0, 10),
            event: scaleData.event,
            responsible: scaleData.responsible,
            ministriesSelected: scaleData.ministries.map((m) => m.id),
            assignments: {},
        });
    }, [scaleData]);

    async function loadMembers() {
        const { data } = await supabase
            .from("members")
            .select("id, name, ministry_id")
            .order("name");

        setMembers((data || []) as MemberLite[]);
    }

    function toggleMinistry(id: string) {
        if (form.ministriesSelected.includes(id)) {
            const updated = form.ministriesSelected.filter((m) => m !== id);
            const assignments = { ...form.assignments };
            delete assignments[id];

            setForm({ ...form, ministriesSelected: updated, assignments });
        } else {
            setForm({
                ...form,
                ministriesSelected: [...form.ministriesSelected, id],
            });
        }
    }

    function toggleMember(ministryId: string, memberId: string) {
        const list = form.assignments[ministryId] || [];
        const exists = list.includes(memberId);

        setForm({
            ...form,
            assignments: {
                ...form.assignments,
                [ministryId]: exists
                    ? list.filter((id) => id !== memberId)
                    : [...list, memberId],
            },
        });
    }

    async function submit() {
        setSaving(true);
        notifyLoading("Salvando escala...");

        const { data: session } = await supabase.auth.getSession();
        const churchId = session.session?.user?.app_metadata?.church_id;

        const selectedMinistries = ministries
            .filter((m) => form.ministriesSelected.includes(m.id))
            .map((m) => ({ id: m.id, name: m.name }));

        let error;

        if (scaleData) {
            ({ error } = await supabase
                .from("scales")
                .update({
                    date: `${form.date}T12:00:00`,
                    event_name: form.event,
                    responsible: form.responsible,
                    ministries: selectedMinistries,
                })
                .eq("id", scaleData.id));
        } else {
            ({ error } = await supabase.from("scales").insert({
                date: `${form.date}T12:00:00`,
                event_name: form.event,
                responsible: form.responsible,
                ministries: selectedMinistries,
                church_id: churchId,
            }));
        }

        if (error) {
            notifyError("Erro ao salvar escala");
            setSaving(false);
            return;
        }

        notifySuccess(scaleData ? "Escala atualizada" : "Escala criada");
        await onSuccess();
        onClose();
        setSaving(false);
    }


    return {
        form,
        setForm,
        members,
        toggleMinistry,
        toggleMember,
        submit,
        saving,
    };
}
