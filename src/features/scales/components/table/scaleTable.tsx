import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScaleItem } from "../../types/scales";

type Props = {
    grouped: { date: string; items: ScaleItem[] }[];
    onView: (item: ScaleItem) => void;
    onEdit: (item: ScaleItem) => void;
    onDelete: (item: ScaleItem) => void;
};

export default function ScaleTableMobile({
    grouped,
    onView,
    onEdit,
    onDelete,
}: Props) {
    if (!grouped.length) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Nenhuma escala cadastrada</Text>
                <Text style={styles.emptySubtitle}>
                    Crie uma nova escala para começar
                </Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {grouped.map((group) => (
                <View key={group.date} style={styles.group}>
                    <Text style={styles.date}>{formatDate(group.date)}</Text>

                    {group.items.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Text style={styles.title}>{item.event}</Text>

                            <Text style={styles.resp}>
                                <Text style={styles.bold}>Responsável:</Text>{" "}
                                {item.responsible || "-"}
                            </Text>

                            {item.ministries?.length > 0 && (
                                <View style={styles.tags}>
                                    {item.ministries.map((m) => (
                                        <View key={m.id} style={styles.tag}>
                                            <Feather
                                                name="users"
                                                size={12}
                                                color="#2C7A7B"
                                            />
                                            <Text style={styles.tagText}>
                                                {m.name}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <View style={styles.actions}>
                                <Pressable
                                    onPress={() => onView(item)}
                                    style={styles.actionBtn}
                                >
                                    <Feather
                                        name="eye"
                                        size={16}
                                        color="#374151"
                                    />
                                </Pressable>

                                <Pressable
                                    onPress={() => onEdit(item)}
                                    style={[styles.actionBtn, styles.editBtn]}
                                >
                                    <Feather
                                        name="edit-2"
                                        size={16}
                                        color="#0d8d87ff"
                                    />
                                </Pressable>

                                <Pressable
                                    onPress={() => onDelete(item)}
                                    style={[
                                        styles.actionBtn,
                                        styles.deleteBtn,
                                    ]}
                                >
                                    <Feather
                                        name="trash-2"
                                        size={16}
                                        color="#DC2626"
                                    />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

function formatDate(date: string) {
    const [y, m, d] = date.slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 32,
    },

    empty: {
        alignItems: "center",
        paddingVertical: 48,
        gap: 6,
    },

    emptyTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },

    emptySubtitle: {
        fontSize: 12,
        color: "#9CA3AF",
    },

    group: {
        marginBottom: 16,
    },

    date: {
        fontSize: 13,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 10,
    },

    card: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 12,
        gap: 6,
    },

    title: {
        fontWeight: "700",
        fontSize: 15,
        color: "#111827",
    },

    resp: {
        fontSize: 12,
        color: "#374151",
    },

    bold: {
        fontWeight: "700",
    },

    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 6,
    },

    tag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: "#E6FFFA",
        borderWidth: 1,
        borderColor: "#81E6D9",
        marginRight: 6,
        marginBottom: 6,
    },

    tagText: {
        fontSize: 11,
        marginLeft: 4,
        fontWeight: "600",
        color: "#285E61",
    },

    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },

    actionBtn: {
        padding: 9,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginLeft: 8,
        backgroundColor: "#FFFFFF",
    },

    editBtn: {
        backgroundColor: "#ECFEFF",
        borderColor: "#A7F3D0",
    },

    deleteBtn: {
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA",
    },
});
