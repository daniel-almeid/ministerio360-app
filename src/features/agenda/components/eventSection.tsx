import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEvents } from "../hooks/useEvents";
import EventTableMobile from "../components/table/eventTable";
import ModalNewEvent from "../components/modals/modalNewEvent";
import ModalEditEvent from "../components/modals/modalEditEvent";
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
        loading,
        grouped,
        nextEvent,
        filterMinistry,
        setFilterMinistry,

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
            <View style={styles.header}>
                <Text style={styles.title}>Próximos eventos</Text>

                <Pressable style={styles.newButton} onPress={openNew}>
                    <Text style={styles.newButtonText}>Novo evento</Text>
                </Pressable>
            </View>

            <EventTableMobile
                grouped={grouped}
                nextEvent={nextEvent}
                openEdit={openEdit}
                openDelete={openDelete}
            />

            {showNew && (
                <ModalNewEvent
                    eventData={null}
                    onClose={closeAll}
                    onSuccess={closeAll}
                />
            )}

            {showEdit && selected && (
                <ModalEditEvent
                    open
                    event={selected}
                    onClose={closeAll}
                    onSuccess={closeAll}
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
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    newButton: {
        backgroundColor: "#38B2AC",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    newButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
});
