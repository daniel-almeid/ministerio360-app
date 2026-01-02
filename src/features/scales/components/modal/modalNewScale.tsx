import { Modal, View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MinistryLite, ScaleItem } from "../../types/scales";
import { useScaleForm } from "../../hooks/useScaleForm";
import ScaleFormFields from "./scaleFormFields";
import MinistrySelector from "./ministrySelector";
import MemberSelector from "./memberSelector";
import SubmitActions from "./submitActions";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void | Promise<void>;
    ministries: MinistryLite[];
    scaleData?: ScaleItem | null;
};

export default function ModalNewScale({
    visible,
    onClose,
    onSuccess,
    ministries,
    scaleData,
}: Props) {
    const {
        form,
        setForm,
        members,
        toggleMinistry,
        toggleMember,
        submit,
        saving,
    } = useScaleForm(onSuccess, onClose, ministries, scaleData || undefined);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {scaleData ? "Editar Escala" : "Nova Escala"}
                        </Text>

                        <Pressable onPress={onClose}>
                            <Feather name="x" size={18} />
                        </Pressable>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <ScaleFormFields form={form} setForm={setForm} />

                        <MinistrySelector
                            ministries={ministries}
                            selected={form.ministriesSelected}
                            toggleMinistry={toggleMinistry}
                        />

                        <MemberSelector
                            ministries={ministries}
                            members={members}
                            form={form}
                            toggleMember={toggleMember}
                        />

                        <SubmitActions saving={saving} onClose={onClose} onSubmit={submit} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 16,
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 16,
        maxHeight: "90%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#F3F4F6",
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
    },
    content: {
        padding: 16,
        gap: 16,
    },
});
