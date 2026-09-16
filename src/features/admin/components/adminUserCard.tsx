import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AdminUser } from "../types/admin";

type Props = {
    user: AdminUser;
    onEdit: (user: AdminUser) => void;
};

function formatDate(value: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("pt-BR");
}

export function AdminUserCard({ user, onEdit }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>Igreja</Text>
            <Text style={styles.value}>{user.church_name ?? "-"}</Text>

            <View style={styles.badgeRow}>
                <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{user.plan_slug}</Text>
                </View>

                <View style={[styles.statusBadge, user.subscription_active ? styles.statusActive : styles.statusInactive]}>
                    <Text style={[styles.statusText, user.subscription_active ? styles.statusActiveText : styles.statusInactiveText]}>
                        {user.subscription_active ? "Ativa" : "Inativa"}
                    </Text>
                </View>
            </View>

            <View style={styles.datesRow}>
                <Text style={styles.dateText}>Usuário: {formatDate(user.created_at_user)}</Text>
                <Text style={styles.dateText}>Igreja: {formatDate(user.created_at_church)}</Text>
            </View>

            <Pressable onPress={() => onEdit(user)} style={styles.editBtn}>
                <Feather name="edit-2" size={16} color="#38B2AC" />
                <Text style={styles.editBtnText}>Alterar plano</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 16, marginBottom: 12 },
    label: { fontSize: 11, color: "#9CA3AF", marginTop: 8 },
    value: { fontSize: 14, fontWeight: "600", color: "#111827" },
    badgeRow: { flexDirection: "row", gap: 8, marginTop: 12 },
    planBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: "#F0FDFA", borderWidth: 1, borderColor: "#99F6E4" },
    planBadgeText: { fontSize: 12, color: "#0F766E", fontWeight: "600", textTransform: "capitalize" },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
    statusActive: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
    statusInactive: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
    statusText: { fontSize: 12, fontWeight: "600" },
    statusActiveText: { color: "#15803D" },
    statusInactiveText: { color: "#B91C1C" },
    datesRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
    dateText: { fontSize: 12, color: "#6B7280" },
    editBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 14,
        borderWidth: 1,
        borderColor: "#38B2AC",
        borderRadius: 10,
        paddingVertical: 10,
    },
    editBtnText: { color: "#38B2AC", fontWeight: "700", fontSize: 13 },
});