import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
    ministry: any;
    onEdit: () => void;
    onDelete: () => void;
};

export function MinistryCard({ ministry, onEdit, onDelete }: Props) {
    const createdAt = ministry.created_at
        ? new Date(ministry.created_at).toLocaleDateString("pt-BR")
        : "-";

    return (
        <View style={styles.card}>
            <View style={styles.titleRow}>
                <Feather name="info" size={16} color="#38B2AC" />
                <Text style={styles.title} numberOfLines={1}>
                    {ministry.name}
                </Text>
            </View>

            {ministry.description ? (
                <Text style={styles.description}>{ministry.description}</Text>
            ) : (
                <Text style={styles.descriptionEmpty}>Sem descrição</Text>
            )}

            <View style={styles.dateRow}>
                <Feather name="calendar" size={16} color="#38B2AC" />
                <Text style={styles.dateText}>{createdAt}</Text>
            </View>

            <View style={styles.actions}>
                <Pressable onPress={onEdit} style={styles.iconButton}>
                    <Feather name="edit-2" size={20} color="#059669" />
                </Pressable>

                <Pressable onPress={onDelete} style={styles.iconButton}>
                    <Feather name="trash-2" size={20} color="#DC2626" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 14,
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    description: {
        fontSize: 14,
        color: "#374151",
        marginBottom: 10,
    },
    descriptionEmpty: {
        fontSize: 14,
        color: "#9CA3AF",
        fontStyle: "italic",
        marginBottom: 10,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 13,
        color: "#6B7280",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 14,
    },
    iconButton: {
        padding: 6,
    },
});
