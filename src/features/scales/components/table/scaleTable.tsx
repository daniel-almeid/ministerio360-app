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
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {grouped.map((group) => (
                <View key={group.date} style={styles.group}>
                    <Text style={styles.date}>
                        {formatDate(group.date)}
                    </Text>

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
                                            <Feather name="users" size={12} color="#2C7A7B" />
                                            <Text style={styles.tagText}>{m.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <View style={styles.actions}>
                                <Pressable onPress={() => onView(item)} style={styles.actionBtn}>
                                    <Feather name="eye" size={16} />
                                </Pressable>

                                <Pressable onPress={() => onEdit(item)} style={styles.actionBtn}>
                                    <Feather name="edit-2" size={16} />
                                </Pressable>

                                <Pressable onPress={() => onDelete(item)} style={styles.deleteBtn}>
                                    <Feather name="trash-2" size={16} />
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
    const base = date.slice(0, 10);
    const [y, m, d] = base.split("-");
    return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
    },

    group: {
        marginBottom: 12,
    },

    date: {
        fontWeight: "700",
        color: "#374151",
        marginBottom: 8,
    },

    card: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 10,
    },

    title: {
        fontWeight: "700",
        fontSize: 15,
    },

    resp: {
        marginTop: 6,
        fontSize: 12,
    },

    bold: {
        fontWeight: "700",
    },

    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },

    tag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
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
    },

    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },

    actionBtn: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        marginLeft: 8,
    },

    deleteBtn: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#FECACA",
        backgroundColor: "#FEF2F2",
        marginLeft: 8,
    },
});
