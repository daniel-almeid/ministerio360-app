import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import {
    notifyError,
    notifySuccess,
    notifyLoading,
} from "../../../shared/ui/toast";
import { MinistryLite, MemberLite, ScaleItem } from "../types/scales";

type FormState = {
    date: string;
    event: string;
    responsible: string;
    ministriesSelected: string[];
    assignments: Record<string, string[]>;
};

const EMPTY_FORM: FormState = {
    date: "",
    event: "",
    responsible: "",
    ministriesSelected: [],
    assignments: {},
};

export function useScaleForm(
    onSuccess: () => void | Promise<void>,
    onClose: () => void,
    ministries: MinistryLite[],
    scaleData?: ScaleItem
) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [members, setMembers] = useState<MemberLite[]>([]);
    const [saving, setSaving] = useState(false);

    // Load base date

    useEffect(() => {
        loadMembers();
    }, []);

    useEffect(() => {
        if (!scaleData) {
            setForm(EMPTY_FORM);
            return;
        }

        preloadEditData(scaleData);
    }, [scaleData]);

    async function loadMembers() {
        const { data } = await supabase
            .from("members")
            .select("id, name, ministry_id")
            .order("name");

        setMembers((data || []) as MemberLite[]);
    }

    // PRELOAD EDITION
    async function preloadEditData(scale: ScaleItem) {
        const { data: assigns } = await supabase
            .from("scale_assignments")
            .select("ministry_id, member_id")
            .eq("scale_id", scale.id);

        const assignments: Record<string, string[]> = {};

        (assigns || []).forEach((row) => {
            if (!assignments[row.ministry_id]) {
                assignments[row.ministry_id] = [];
            }
            assignments[row.ministry_id].push(row.member_id);
        });

        setForm({
            date: scale.date.slice(0, 10),
            event: scale.event,
            responsible: scale.responsible,
            ministriesSelected: scale.ministries.map((m) => m.id),
            assignments,
        });
    }

    // Form actions

    function toggleMinistry(id: string) {
        setForm((prev) => {
            const exists = prev.ministriesSelected.includes(id);

            if (exists) {
                const ministriesSelected = prev.ministriesSelected.filter(
                    (m) => m !== id
                );

                const assignments = { ...prev.assignments };
                delete assignments[id];

                return {
                    ...prev,
                    ministriesSelected,
                    assignments,
                };
            }

            return {
                ...prev,
                ministriesSelected: [...prev.ministriesSelected, id],
                assignments: {
                    ...prev.assignments,
                    [id]: [],
                },
            };
        });
    }

    function toggleMember(ministryId: string, memberId: string) {
        setForm((prev) => {
            const list = prev.assignments[ministryId] || [];
            const exists = list.includes(memberId);

            return {
                ...prev,
                assignments: {
                    ...prev.assignments,
                    [ministryId]: exists
                        ? list.filter((id) => id !== memberId)
                        : [...list, memberId],
                },
            };
        });
    }

    // Submit

    async function submit() {
        setSaving(true);
        notifyLoading("Salvando escala...");

        const { data: session } = await supabase.auth.getSession();
        const userId = session.session?.user?.id;

        if (!userId) {
            notifyError("Usuário não autenticado");
            setSaving(false);
            return;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("church_id")
            .eq("id", userId)
            .single();

        if (!profile?.church_id) {
            notifyError("Igreja não encontrada");
            setSaving(false);
            return;
        }

        if (!Object.keys(form.assignments).length) {
            notifyError("Selecione ao menos um membro");
            setSaving(false);
            return;
        }

        const selectedMinistries = ministries
            .filter((m) => form.ministriesSelected.includes(m.id))
            .map((m) => ({ id: m.id, name: m.name }));

        let scaleId: string;

        if (scaleData) {
            const { error } = await supabase
                .from("scales")
                .update({
                    date: `${form.date}T12:00:00`,
                    event_name: form.event,
                    responsible: form.responsible,
                    ministries: selectedMinistries,
                })
                .eq("id", scaleData.id);

            if (error) {
                notifyError("Erro ao salvar escala");
                setSaving(false);
                return;
            }

            scaleId = scaleData.id;

            await supabase
                .from("scale_assignments")
                .delete()
                .eq("scale_id", scaleId);
        } else {
            const { data, error } = await supabase
                .from("scales")
                .insert({
                    date: `${form.date}T12:00:00`,
                    event_name: form.event,
                    responsible: form.responsible,
                    ministries: selectedMinistries,
                    church_id: profile.church_id,
                })
                .select("id")
                .single();

            if (error || !data) {
                notifyError("Erro ao salvar escala");
                setSaving(false);
                return;
            }

            scaleId = data.id;
        }

        const rows = Object.entries(form.assignments).flatMap(
            ([ministryId, memberIds]) =>
                memberIds.map((memberId) => ({
                    scale_id: scaleId,
                    ministry_id: ministryId,
                    member_id: memberId,
                    church_id: profile.church_id,
                }))
        );

        if (rows.length) {
            await supabase.from("scale_assignments").insert(rows);
        }

        notifySuccess(scaleData ? "Escala atualizada" : "Escala criada");
        setForm(EMPTY_FORM);
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
