import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabase";
import type { Member } from "../../../hooks/useMembersData";

type FormState = {
    name: string;
    ministry_id: string;
    email: string;
    phone: string;
    is_active: boolean;
    birth_date: string;
};

export function useMemberForm(
    member: Member | null,
    onSuccess: () => void,
    onClose: () => void
) {
    const [form, setForm] = useState<FormState>({
        name: "",
        ministry_id: "",
        email: "",
        phone: "",
        is_active: true,
        birth_date: "",
    });

    const [saving, setSaving] = useState(false);
    const [ministries, setMinistries] = useState<
        { id: string; name: string }[]
    >([]);

    useEffect(() => {
        loadMinistries();

        if (member) {
            setForm({
                name: member.name,
                ministry_id: member.ministry_id ?? "",
                email: member.email ?? "",
                phone: member.phone ?? "",
                is_active: member.is_active,
                birth_date: member.birth_date ?? "",
            });
        }
    }, [member]);

    async function loadMinistries() {
        const { data, error } = await supabase
            .from("ministries")
            .select("id, name")
            .order("name");

        if (!error && data) setMinistries(data);
    }

    async function handleSubmit() {
        if (!form.name.trim()) return;

        setSaving(true);

        const payload = {
            ...form,
            ministry_id: form.ministry_id || null,
            email: form.email || null,
            phone: form.phone || null,
            birth_date: form.birth_date || null,
        };

        const query = member
            ? supabase
                  .from("members")
                  .update(payload)
                  .eq("id", member.id)
            : supabase
                  .from("members")
                  .insert([payload]);

        const { error } = await query;

        setSaving(false);

        if (!error) {
            onSuccess();
            onClose();
        }
    }

    return {
        form,
        setForm,
        ministries,
        saving,
        handleSubmit,
    };
}
