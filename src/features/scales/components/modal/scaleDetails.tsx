import { Modal, View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { fetchScaleDetails } from "../../services/scalesService";
import Loading from "../../../../shared/ui/loading";

type Props = {
    visible: boolean;
    scaleId: string | null;
    onClose: () => void;
};

export default function ScaleDetailsModal({ visible, scaleId, onClose }: Props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!scaleId) return;
        load();
    }, [scaleId]);

    async function load() {
        setLoading(true);
        const res = await fetchScaleDetails(scaleId!);
        setData(res);
        setLoading(false);
    }

    if (!visible) return null;

    return (
        <Modal visible transparent animationType="fade">
            <View style={styles.backdrop}>
                <Pressable style={styles.overlay} onPress={onClose} />

                <View style={styles.drawer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Detalhes da Escala</Text>
                        <Pressable onPress={onClose}>
                            <Feather name="x" size={18} />
                        </Pressable>
                    </View>

                    {loading ? (
                        <Loading visible />
                    ) : (
                        <ScrollView contentContainerStyle={styles.content}>
                            <Item label="Data" value={formatDate(data.scale.date)} />
                            <Item label="Evento" value={data.scale.event_name} />
                            <Item label="Responsável" value={data.scale.responsible} />

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Ministérios e Membros
                                </Text>

                                {!Object.keys(data.grouped).length ? (
                                    <Text style={styles.empty}>
                                        Nenhum membro atribuído
                                    </Text>
                                ) : (
                                    Object.entries(data.grouped).map(
                                        ([ministry, members]: any) => (
                                            <View
                                                key={ministry}
                                                style={styles.block}
                                            >
                                                <Text style={styles.ministry}>
                                                    {ministry}
                                                </Text>

                                                {members.map((m: string) => (
                                                    <Text
                                                        key={m}
                                                        style={styles.member}
                                                    >
                                                        • {m}
                                                    </Text>
                                                ))}
                                            </View>
                                        )
                                    )
                                )}
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
}

function Item({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.item}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

function formatDate(iso: string) {
    const [y, m, d] = iso.slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    overlay: {
        flex: 1,
    },
    drawer: {
        width: 320,
        backgroundColor: "#fff",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontWeight: "700",
        fontSize: 16,
        color: "#111827",
    },
    content: {
        paddingBottom: 24,
        gap: 16,
    },
    item: {
        gap: 2,
    },
    label: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "600",
    },
    value: {
        fontSize: 14,
        color: "#111827",
        fontWeight: "500",
    },
    section: {
        marginTop: 8,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "600",
    },
    empty: {
        fontSize: 12,
        color: "#9CA3AF",
        fontStyle: "italic",
    },
    block: {
        backgroundColor: "#F9FAFB",
        borderRadius: 8,
        padding: 12,
        gap: 6,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    ministry: {
        fontWeight: "700",
        color: "#0d8d87ff",
        fontSize: 13,
    },
    member: {
        fontSize: 13,
        color: "#374151",
    },
});
