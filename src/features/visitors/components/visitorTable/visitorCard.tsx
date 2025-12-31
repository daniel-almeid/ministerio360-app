import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Visitor } from "../../types/visitors";

type Props = {
    visitor: Visitor;
    showArchived: boolean;
    processingId: string | null;
    onSelect: (v: Visitor) => void;
    onFollowup: (v: Visitor) => void;
    onFinish: (v: Visitor) => void;
};

function statusLabel(status: string) {
    if (status === "pendente") return { label: "Pendente", bg: "#FEF3C7", fg: "#92400E" };
    if (status === "em_andamento") return { label: "Em andamento", bg: "#DBEAFE", fg: "#1D4ED8" };
    return { label: "Concluído", bg: "#DCFCE7", fg: "#166534" };
}

export function VisitorCard({
    visitor,
    showArchived,
    processingId,
    onSelect,
    onFollowup,
    onFinish,
}: Props) {
    const date = visitor.visit_date
        ? new Date(visitor.visit_date).toLocaleDateString("pt-BR")
        : "-";

    const tag = statusLabel(visitor.followup_status);
    const disabled = processingId === visitor.id;

    return (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <Text style={styles.name}>{visitor.name}</Text>

                <View style={[styles.badge, { backgroundColor: tag.bg }]}>
                    <Text style={[styles.badgeText, { color: tag.fg }]}>{tag.label}</Text>
                </View>
            </View>

            <Text style={styles.meta}>Data da visita: {date}</Text>
            <Text style={styles.meta}>Telefone: {visitor.phone ?? "—"}</Text>
            <Text style={styles.meta}>E-mail: {visitor.email ?? "—"}</Text>
            <Text style={styles.meta}>É membro: {visitor.is_member ? "Sim" : "Não"}</Text>

            {!showArchived && (
                <View style={styles.actions}>
                    {visitor.followup_status === "pendente" && (
                        <Pressable
                            onPress={() => onFollowup(visitor)}
                            disabled={disabled}
                            style={[styles.actionBtn, disabled && styles.actionDisabled]}
                        >
                            <Text style={styles.actionText}>Iniciar</Text>
                        </Pressable>
                    )}

                    {visitor.followup_status === "em_andamento" && (
                        <Pressable
                            onPress={() => onFinish(visitor)}
                            disabled={disabled}
                            style={[styles.actionBtnBlue, disabled && styles.actionDisabled]}
                        >
                            <Text style={styles.actionTextWhite}>Finalizar</Text>
                        </Pressable>
                    )}

                    <Pressable onPress={() => onSelect(visitor)} style={styles.actionBtnTeal}>
                        <Text style={styles.actionTextTeal}>Detalhes</Text>
                    </Pressable>
                </View>
            )}

            {showArchived && (
                <View style={styles.actions}>
                    <Pressable onPress={() => onSelect(visitor)} style={styles.actionBtnTeal}>
                        <Text style={styles.actionTextTeal}>Detalhes</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 10,
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    name: { fontSize: 16, fontWeight: "700", color: "#111827" },
    meta: { fontSize: 12, color: "#4B5563", marginTop: 4 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
    badgeText: { fontSize: 11, fontWeight: "700" },

    actions: { flexDirection: "row", gap: 8, justifyContent: "flex-end", marginTop: 12 },
    actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: "#10B981" },
    actionBtnBlue: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: "#2563EB" },
    actionBtnTeal: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: "#ECFEFF" },
    actionText: { color: "#fff", fontWeight: "700", fontSize: 12 },
    actionTextWhite: { color: "#fff", fontWeight: "700", fontSize: 12 },
    actionTextTeal: { color: "#0F766E", fontWeight: "800", fontSize: 12 },
    actionDisabled: { opacity: 0.5 },
});
