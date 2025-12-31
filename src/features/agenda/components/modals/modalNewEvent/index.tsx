import { Modal, StyleSheet, Text, View } from "react-native";
import MinistrySelector from "./ministrySelector";
import SubmitActions from "./submitActions";
import { useEventForm } from "./useEventForm";
import EventFormFields from "./eventFormFields";

type Props = {
    eventData: any;
    onClose: () => void;
    onSuccess: () => void;
};

export default function ModalNewEvent({
    eventData,
    onClose,
    onSuccess,
}: Props) {
    const {
        form,
        setForm,
        ministries,
        selected,
        toggle,
        submit,
        saving,
    } = useEventForm(eventData, onSuccess, onClose);

    return (
        <Modal transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {eventData ? "Editar Evento" : "Novo Evento"}
                    </Text>

                    <EventFormFields form={form} setForm={setForm} />

                    <MinistrySelector
                        ministries={ministries}
                        selected={selected}
                        toggle={toggle}
                    />

                    <SubmitActions
                        saving={saving}
                        onClose={onClose}
                        onSubmit={submit}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 16,
    },
    content: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
});
