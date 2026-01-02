import {
    Modal,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/src/lib/supabase";
import { fetchScaleDetails } from "../../services/scalesService";
import Loading from "../../../../shared/ui/loading";

type Props = {
    visible: boolean;
    scaleId: string | null;
    onClose: () => void;
};

type DetailsData = {
    scale: {
        id: string;
        date: string;
        event_name: string;
        responsible: string;
    };
    grouped: Record<string, string[]>;
};

export default function ScaleDetailsDrawer({
    visible,
    scaleId,
    onClose,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DetailsData | null>(null);

    const translateX = useRef(new Animated.Value(360)).current;

    // animação do drawer
    useEffect(() => {
        Animated.timing(translateX, {
            toValue: visible ? 0 : 360,
            duration: visible ? 250 : 200,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    // carregar dados
    useEffect(() => {
        if (!visible || !scaleId) return;
        load(scaleId);
    }, [visible, scaleId]);

    async function load(id: string) {
        setLoading(true);
        setData(null);

        // 🔑 church_id igual ao resto do app
        const { data: session } = await supabase.auth.getSession();
        const userId = session.session?.user?.id;

        if (!userId) {
            setLoading(false);
            return;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("church_id")
            .eq("id", userId)
            .single();

        if (!profile?.church_id) {
            setLoading(false);
            return;
        }

        const res = await fetchScaleDetails(id, profile.church_id);
        setData(res);
        setLoading(false);
    }

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={styles.backdrop}>
                <Pressable style={styles.overlay} onPress={onClose} />

                <Animated.View
                    style={[
                        styles.drawer,
                        { transform: [{ translateX }] },
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Detalhes da Escala</Text>
                        <Pressable onPress={onClose} style={styles.closeBtn}>
                            <Feather name="x" size={18} color="#6B7280" />
                        </Pressable>
                    </View>

                    {loading || !data ? (
                        <Loading visible />
                    ) : (
                        <ScrollView
                            contentContainerStyle={styles.content}
                            showsVerticalScrollIndicator={false}
                        >
                            <Item
                                label="Data"
                                value={formatDate(data.scale.date)}
                            />
                            <Item
                                label="Evento"
                                value={data.scale.event_name}
                            />
                            <Item
                                label="Responsável"
                                value={data.scale.responsible}
                            />

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Ministérios e Membros
                                </Text>

                                {!Object.keys(data.grouped).length ? (
                                    <Text style={styles.empty}>
                                        Nenhum ministério ou membro listado.
                                    </Text>
                                ) : (
                                    Object.entries(data.grouped).map(
                                        ([ministry, members]) => (
                                            <View
                                                key={ministry}
                                                style={styles.block}
                                            >
                                                <Text
                                                    style={styles.ministry}
                                                >
                                                    {ministry}
                                                </Text>

                                                {members.map((m, i) => (
                                                    <Text
                                                        key={i}
                                                        style={styles.member}
                                                    >
                                                        {m}
                                                    </Text>
                                                ))}
                                            </View>
                                        )
                                    )
                                )}
                            </View>
                        </ScrollView>
                    )}
                </Animated.View>
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
        width: 360,
        backgroundColor: "#fff",
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    closeBtn: {
        padding: 6,
        borderRadius: 6,
    },
    title: {
        fontWeight: "700",
        fontSize: 16,
        color: "#374151",
    },
    content: {
        paddingBottom: 32,
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
        color: "#319795",
        fontSize: 13,
        marginBottom: 4,
    },
    member: {
        fontSize: 13,
        color: "#374151",
    },
});
