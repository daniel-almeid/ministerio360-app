import { View, Text, StyleSheet, Pressable } from "react-native";
import { EventItem } from "../../types/agenda";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
    grouped: Record<string, EventItem[]>;
    nextEvent: EventItem | null;
    openEdit: (ev: EventItem) => void;
    openDelete: (ev: EventItem) => void;
};

export default function EventTableMobile({
    grouped,
    nextEvent,
    openEdit,
    openDelete,
}: Props) {
    return (
        <View>
            {Object.entries(grouped).map(([monthLabel, events]) => (
                <View key={monthLabel} style={styles.monthBlock}>
                    <Text style={styles.monthTitle}>{monthLabel}</Text>

                    {events.map((event) => (
                        <View key={event.id} style={styles.eventCard}>
                            {/* Header */}
                            <View style={styles.eventHeader}>
                                <Text style={styles.eventTitle}>{event.title}</Text>

                                <View style={styles.actions}>
                                    <Pressable onPress={() => openEdit(event)}>
                                        <Text style={styles.actionEdit}>Editar</Text>
                                    </Pressable>

                                    <Pressable onPress={() => openDelete(event)}>
                                        <Text style={styles.actionDelete}>Excluir</Text>
                                    </Pressable>
                                </View>
                            </View>

                            {/* Data / Hora */}
                            <Text style={styles.eventMeta}>
                                {format(parseISO(event.date), "dd/MM/yyyy", {
                                    locale: ptBR,
                                })}
                                {event.time ? ` • ${event.time}` : ""}
                            </Text>

                            {/* Local */}
                            {event.location ? (
                                <Text style={styles.eventLocation}>{event.location}</Text>
                            ) : null}

                            {/* Ministérios */}
                            {event.ministries && event.ministries.length > 0 && (
                                <View style={styles.ministriesContainer}>
                                    {event.ministries.map((m) => (
                                        <View key={m.id} style={styles.ministryBadge}>
                                            <Text style={styles.ministryText}>{m.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    monthBlock: {
        marginBottom: 24,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
        textTransform: "capitalize",
    },
    eventCard: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    eventHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: "600",
    },
    actions: {
        flexDirection: "row",
        gap: 12,
    },
    actionEdit: {
        color: "#0D9488",
        fontWeight: "500",
    },
    actionDelete: {
        color: "#DC2626",
        fontWeight: "500",
    },
    eventMeta: {
        marginTop: 4,
        fontSize: 12,
        color: "#6B7280",
    },
    eventLocation: {
        marginTop: 2,
        fontSize: 12,
        color: "#374151",
    },

    /* Ministérios */
    ministriesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 8,
    },
    ministryBadge: {
        backgroundColor: "#EDFDFD",
        borderColor: "#81E6D9",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    ministryText: {
        fontSize: 11,
        fontWeight: "500",
        color: "#065F5B",
    },
});
