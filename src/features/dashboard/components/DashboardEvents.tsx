import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Feather } from "@expo/vector-icons";

type Ministry = { id: string; name: string };

type EventItem = {
    id: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
    ministries?: Ministry[];
};

export function DashboardEvents({ events }: { events: EventItem[] }) {
    const nextEventId = events?.[0]?.id;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Próximos eventos</Text>

            {events.length === 0 ? (
                <Text style={styles.empty}>Nenhum evento futuro encontrado.</Text>
            ) : (
                events.map((e) => {
                    const isNext = e.id === nextEventId;

                    return (
                        <View key={e.id} style={[styles.item, isNext && styles.nextItem]}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.eventTitle}>{e.title}</Text>

                                <View style={styles.metaRow}>
                                    <View style={styles.metaItem}>
                                        <Feather name="calendar" size={13} color="#38B2AC" />
                                        <Text style={styles.metaText}>
                                            {format(new Date(e.date), "dd/MM/yyyy", { locale: ptBR })}
                                        </Text>
                                    </View>

                                    {e.time && (
                                        <View style={styles.metaItem}>
                                            <Feather name="clock" size={13} color="#38B2AC" />
                                            <Text style={styles.metaText}>{e.time.slice(0, 5)}</Text>
                                        </View>
                                    )}

                                    {e.location && (
                                        <View style={styles.metaItem}>
                                            <Feather name="map-pin" size={13} color="#38B2AC" />
                                            <Text style={styles.metaText}>{e.location}</Text>
                                        </View>
                                    )}
                                </View>

                                {!!e.ministries?.length && (
                                    <View style={styles.metaItem}>
                                        <Feather name="users" size={13} color="#38B2AC" />
                                        <Text style={styles.metaText}>
                                            {e.ministries.map((m) => m.name).join(", ")}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {isNext && <Text style={styles.badge}>Próximo</Text>}
                        </View>
                    );
                })
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, marginBottom: 16, elevation: 2 },
    title: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 12 },
    empty: { color: "#6B7280", textAlign: "center", paddingVertical: 16 },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 8,
    },
    nextItem: { backgroundColor: "#E6FFFA", borderLeftWidth: 4, borderLeftColor: "#38B2AC" },
    eventTitle: { fontSize: 15, fontWeight: "600", color: "#1F2937" },
    metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 6 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
    metaText: { fontSize: 12, color: "#4B5563" },
    badge: {
        backgroundColor: "#38B2AC",
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "600",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        alignSelf: "flex-start",
    },
});