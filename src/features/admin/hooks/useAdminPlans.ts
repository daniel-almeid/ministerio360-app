import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { notifySuccess, notifyError } from "../../../shared/ui/toast";
import type { AdminUser } from "../types/admin";

export const ADMIN_ID = "289d49c4-8db0-49e2-b527-af90809f3be8";

export function useAdmin(enabled: boolean) {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!enabled) return;
        load();
    }, [enabled]);

    async function load() {
        setLoading(true);

        const { data, error } = await supabase
            .from("profiles")
            .select(`
                id,
                email,
                created_at,
                church_id,
                church_profiles:church_id (
                    id,
                    trade_name,
                    created_at,
                    plan_slug,
                    subscription_active
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            notifyError("Erro ao carregar usuários.");
            setLoading(false);
            return;
        }

        const formatted: AdminUser[] = (data as any[]).map((u) => ({
            user_id: u.id,
            email: u.email,
            created_at_user: u.created_at,
            church_id: u.church_id ?? null,
            church_name: u.church_profiles?.trade_name ?? null,
            created_at_church: u.church_profiles?.created_at ?? null,
            plan_slug: u.church_profiles?.plan_slug ?? "free",
            subscription_active: u.church_profiles?.subscription_active ?? false,
        }));

        setUsers(formatted);
        setLoading(false);
    }

    function openModal(user: AdminUser) {
        setSelectedUser(user);
        setModalOpen(true);
    }

    function closeModal() {
        setSelectedUser(null);
        setModalOpen(false);
    }

    async function saveChanges(values: { plan_slug: string; subscription_active: boolean }) {
        if (!selectedUser?.church_id) return;

        setSaving(true);

        const { error } = await supabase
            .from("church_profiles")
            .update({
                plan_slug: values.plan_slug,
                subscription_active: values.subscription_active,
            })
            .eq("id", selectedUser.church_id);

        if (error) {
            notifyError("Erro ao atualizar plano.");
            setSaving(false);
            return;
        }

        await supabase.rpc("refresh_church_claim", { p_user_id: selectedUser.user_id });

        setUsers((prev) =>
            prev.map((u) =>
                u.user_id === selectedUser.user_id
                    ? { ...u, plan_slug: values.plan_slug, subscription_active: values.subscription_active }
                    : u
            )
        );

        notifySuccess("Plano atualizado com sucesso.");
        setSaving(false);
        closeModal();
    }

    return { users, loading, selectedUser, modalOpen, openModal, closeModal, saveChanges, saving, refresh: load };
}