import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
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
            {nextEvent && (
                <View style={styles.highlight}>
                    <Text style={styles.highlightTitle}>{nextEvent.title}</Text>

                    <Text style={styles.highlightText}>
                        {format(parseISO(nextEvent.date), "dd/MM/yyyy", { locale: ptBR })}{" "}
                        {nextEvent.time?.slice(0, 5)}
                    </Text>
                </View>
            )}

            {Object.entries(grouped).map(([month, events]) => (
                <View key={month}>
                    <Text style={styles.month}>{month}</Text>

                    {events.map((event) => (
                        <View key={event.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{event.title}</Text>

                            <Text style={styles.cardText}>
                                {format(parseISO(event.date), "dd/MM/yyyy", { locale: ptBR })}{" "}
                                {event.time?.slice(0, 5)}
                            </Text>

                            <View style={styles.actions}>
                                <Pressable onPress={() => openEdit(event)}>
                                    <Feather name="edit" size={18} color="#319795" />
                                </Pressable>

                                <Pressable onPress={() => openDelete(event)}>
                                    <Feather name="trash-2" size={18} color="#E53E3E" />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    highlight: {
        padding: 16,
        backgroundColor: "#E6FFFA",
        borderLeftWidth: 4,
        borderLeftColor: "#38B2AC",
        borderRadius: 8,
        marginBottom: 20,
    },
    highlightTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    highlightText: {
        marginTop: 4,
        color: "#2D3748",
    },
    month: {
        fontWeight: "600",
        marginVertical: 12,
        textTransform: "capitalize",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 14,
        marginBottom: 10,
    },
    cardTitle: {
        fontWeight: "600",
    },
    cardText: {
        marginTop: 4,
        color: "#4A5568",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 10,
    },
});
