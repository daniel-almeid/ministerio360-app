import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function DashboardEvents({ events }: any) {
    const nextEventId = events?.[0]?.id;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Próximos eventos</Text>

            {events.length === 0 ? (
                <Text style={styles.empty}>Nenhum evento futuro encontrado.</Text>
            ) : (
                events.map((e: any) => {
                    const isNext = e.id === nextEventId;

                    return (
                        <View
                            key={e.id}
                            style={[
                                styles.item,
                                isNext && styles.nextItem,
                            ]}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.eventTitle}>{e.title}</Text>
                                <Text style={styles.date}>
                                    {format(new Date(e.date), "dd/MM/yyyy", { locale: ptBR })}
                                </Text>
                            </View>

                            {isNext && (
                                <Text style={styles.badge}>Próximo</Text>
                            )}
                        </View>
                    );
                })
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 12,
    },
    empty: {
        color: "#6B7280",
        textAlign: "center",
        paddingVertical: 16,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 8,
    },
    nextItem: {
        backgroundColor: "#E6FFFA",
        borderLeftWidth: 4,
        borderLeftColor: "#38B2AC",
    },
    eventTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1F2937",
    },
    date: {
        marginTop: 4,
        color: "#6B7280",
        fontSize: 13,
    },
    badge: {
        backgroundColor: "#38B2AC",
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "600",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
});
