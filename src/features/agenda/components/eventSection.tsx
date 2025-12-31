import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useEvents } from "../hooks/useEvents";
import EventTableMobile from "./table/eventTable";
import ModalNewEvent from "./modals/modalNewEvent";
import ModalEditEvent from "./modals/modalEditEvent";
import ConfirmDeleteModal from "./modals/confirmDeleteModal";
import { Ministry } from "../types/agenda";

type Props = {
    ministries: Ministry[];
    onRefreshMinistries: () => void;
};

export default function EventSection({
    ministries,
    onRefreshMinistries,
}: Props) {
    const {
        grouped,
        nextEvent,
        load,

        selected,
        showNew,
        showEdit,
        showDelete,

        openNew,
        openEdit,
        openDelete,
        closeAll,
        confirmDelete,
    } = useEvents(ministries, onRefreshMinistries);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Agenda</Text>
                        <Text style={styles.subtitle}>
                            Todos os eventos cadastrados
                        </Text>
                    </View>

                    <Pressable style={styles.newButton} onPress={openNew}>
                        <Text style={styles.newButtonText}>Novo evento</Text>
                    </Pressable>
                </View>

                <View style={styles.scrollWrapper}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        nestedScrollEnabled
                    >
                        <EventTableMobile
                            grouped={grouped}
                            nextEvent={nextEvent}
                            openEdit={openEdit}
                            openDelete={openDelete}
                        />
                    </ScrollView>
                </View>
            </View>

            {showNew && (
                <ModalNewEvent
                    eventData={null}
                    onClose={closeAll}
                    onSuccess={() => {
                        load();
                        closeAll();
                    }}
                />
            )}

            {showEdit && selected && (
                <ModalEditEvent
                    open
                    event={selected}
                    onClose={closeAll}
                    onSuccess={() => {
                        load();
                        closeAll();
                    }}
                />
            )}

            {showDelete && (
                <ConfirmDeleteModal
                    open
                    onClose={closeAll}
                    onConfirm={confirmDelete}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FAFC",
        padding: 16,
    },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
    },
    subtitle: {
        fontSize: 13,
        color: "#718096",
    },
    newButton: {
        backgroundColor: "#38B2AC",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    newButtonText: {
        color: "#fff",
        fontWeight: "600",
    },

    scrollWrapper: {
        flex: 1,
        minHeight: 0,
    },

    listContent: {
        paddingBottom: 24,
    },
});
