import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../../../src/lib/supabase";
import { useAdmin, ADMIN_ID } from "../../../src/features/admin/hooks/useAdminPlans";
import { AdminUserCard } from "../../../src/features/admin/components/adminUserCard";
import { EditPlanModal } from "../../../src/features/admin/components/editPlanModal";
import Loading from "../../../src/shared/ui/loading";

export default function AdminScreen() {
    const [checking, setChecking] = useState(true);
    const [enabled, setEnabled] = useState(false);

    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getSession();
            setEnabled(data.session?.user?.id === ADMIN_ID);
            setChecking(false);
        })();
    }, []);

    const { users, loading, selectedUser, modalOpen, openModal, closeModal, saveChanges, saving, refresh } =
        useAdmin(enabled);

    const filteredUsers = useMemo(() => {
        return users
            .filter((u) => {
                if (!search.trim()) return true;
                const s = search.toLowerCase();
                return u.email?.toLowerCase().includes(s) || u.church_name?.toLowerCase().includes(s);
            })
            .filter((u) => planFilter === "all" || u.plan_slug === planFilter)
            .filter((u) => {
                if (statusFilter === "all") return true;
                return statusFilter === "active" ? u.subscription_active : !u.subscription_active;
            });
    }, [users, search, planFilter, statusFilter]);

    if (checking) {
        return <Loading visible />;
    }

    if (!enabled) {
        return (
            <View style={styles.restricted}>
                <Text style={styles.restrictedText}>Acesso restrito.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Administração</Text>
            <Text style={styles.subtitle}>Gerencie usuários, igrejas e seus planos.</Text>

            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar usuário ou igreja..."
                placeholderTextColor="#9CA3AF"
                style={styles.search}
            />

            <View style={styles.filtersRow}>
                <View style={styles.filterWrapper}>
                    <Picker selectedValue={planFilter} onValueChange={setPlanFilter}>
                        <Picker.Item label="Todos os planos" value="all" />
                        <Picker.Item label="Grátis" value="free" />
                        <Picker.Item label="Padrão" value="standard" />
                        <Picker.Item label="Premium" value="premium" />
                    </Picker>
                </View>

                <View style={styles.filterWrapper}>
                    <Picker selectedValue={statusFilter} onValueChange={setStatusFilter}>
                        <Picker.Item label="Todas" value="all" />
                        <Picker.Item label="Ativa" value="active" />
                        <Picker.Item label="Inativa" value="inactive" />
                    </Picker>
                </View>
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={(u) => u.user_id}
                renderItem={({ item }) => <AdminUserCard user={item} onEdit={openModal} />}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                ListEmptyComponent={!loading ? <Text style={styles.empty}>Nenhum usuário encontrado.</Text> : null}
                contentContainerStyle={{ paddingBottom: 24 }}
            />

            <EditPlanModal
                visible={modalOpen}
                user={selectedUser}
                saving={saving}
                onClose={closeModal}
                onSave={saveChanges}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
    title: { fontSize: 20, fontWeight: "800", color: "#1F2937" },
    subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2, marginBottom: 16 },
    search: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "#fff", marginBottom: 12 },
    filtersRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
    filterWrapper: { flex: 1, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8, overflow: "hidden", backgroundColor: "#fff" },
    empty: { textAlign: "center", color: "#9CA3AF", marginTop: 24 },
    restricted: { flex: 1, alignItems: "center", justifyContent: "center" },
    restrictedText: { color: "#6B7280", fontSize: 15 },
});