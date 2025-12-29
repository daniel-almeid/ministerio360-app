import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
    transaction: any;
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
};

export function TransactionCard({ transaction: t, onEdit, onDelete }: Props) {
    const isIncome = t.type === "entrada";

    return (
        <View style={styles.card}>
            {/* Tipo */}
            <View style={styles.typeRow}>
                <Feather
                    name={isIncome ? "arrow-up-circle" : "arrow-down-circle"}
                    size={20}
                    color={isIncome ? "#16a34a" : "#dc2626"}
                />
                <Text
                    style={[
                        styles.typeText,
                        { color: isIncome ? "#15803d" : "#b91c1c" },
                    ]}
                >
                    {isIncome ? "Entrada" : "Saída"}
                </Text>
            </View>

            <Text style={styles.text}>
                <Text style={styles.label}>Categoria:</Text> {t.category}
            </Text>

            <Text style={styles.amount}>
                Valor: R$ {Number(t.amount).toFixed(2).replace(".", ",")}
            </Text>

            <Text style={styles.text}>
                <Text style={styles.label}>Pessoa / Motivo:</Text>{" "}
                {t.person_name || "-"}
            </Text>

            <View style={styles.dateRow}>
                <Feather name="calendar" size={14} color="#38B2AC" />
                <Text style={styles.dateText}>
                    {new Date(t.created_at).toLocaleDateString("pt-BR")}
                </Text>
            </View>

            <View style={styles.actions}>
                <Pressable onPress={() => onEdit(t)}>
                    <Feather name="edit" size={20} color="#059669" />
                </Pressable>

                <Pressable onPress={() => onDelete(t.id)}>
                    <Feather name="trash-2" size={20} color="#dc2626" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    typeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    typeText: {
        fontSize: 15,
        fontWeight: "600",
    },
    text: {
        fontSize: 15,
        color: "#374151",
        marginBottom: 4,
    },
    label: {
        fontWeight: "600",
    },
    amount: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
    },
    dateText: {
        fontSize: 13,
        color: "#6b7280",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 20,
        marginTop: 12,
    },
});
