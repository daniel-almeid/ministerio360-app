import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { ChurchFormData, INITIAL_FORM } from "../types/churchConfig";

import {
    notifySuccess,
    notifyError,
    notifyLoading,
    dismissToast,
} from "../../../shared/ui/toast";

export function useChurchConfig() {
    const [formData, setFormData] =
        useState<ChurchFormData>(INITIAL_FORM);
    const [churchId, setChurchId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadChurchData();
    }, []);

    async function loadChurchData() {
        try {
            setLoading(true);

            const { data: sessionData } =
                await supabase.auth.getSession();

            const church_id =
                sessionData.session?.user?.app_metadata?.church_id;

            if (!church_id) {
                notifyError("Church ID não encontrado.");
                return;
            }

            setChurchId(church_id);

            const { data, error } = await supabase
                .from("church_institutional_info")
                .select("*")
                .eq("church_id", church_id)
                .maybeSingle();

            if (error) {
                notifyError("Erro ao carregar dados da igreja.");
                return;
            }

            setFormData({ ...INITIAL_FORM, ...data });
        } catch (err: any) {
            notifyError("Erro ao carregar dados da igreja.");
        } finally {
            setLoading(false);
        }
    }

    async function saveChurchData() {
        if (!churchId) {
            notifyError("Igreja não identificada.");
            return;
        }

        try {
            setSaving(true);
            notifyLoading("Salvando informações...");

            const { error } = await supabase
                .from("church_institutional_info")
                .upsert(
                    { church_id: churchId, ...formData },
                    { onConflict: "church_id" }
                );

            if (error) throw error;

            dismissToast();
            notifySuccess("Informações salvas com sucesso!");

            // opcional: recarrega dados para garantir consistência
            await loadChurchData();
        } catch (err: any) {
            dismissToast();
            notifyError(err.message || "Erro ao salvar informações.");
        } finally {
            setSaving(false);
        }
    }

    function handleChange(name: string, value: string) {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    return {
        formData,
        handleChange,
        loading,
        saving,
        saveChurchData,
    };
}
