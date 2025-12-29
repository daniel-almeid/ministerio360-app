import { Modal, View, Text, Pressable, StyleSheet, ActivityIndicator} from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { notifySuccess, notifyError, notifyLoading, dismissToast } from "../../../../shared/ui/toast";

type Props = {
    visible: boolean;
    ministry: any | null;
    onClose: () => void;
    onConfirm: (id: string) => Promise<boolean>;
};

export function DeleteMinistryModal({
    visible,
    ministry,
    onClose,
    onConfirm,
}: Props) {
    const [deleting, setDeleting] = useState(false);

    async function handleConfirm() {
        if (!ministry?.id || deleting) return;

        setDeleting(true);
        notifyLoading("Excluindo ministério...");

        try {
            const success = await onConfirm(ministry.id);

            dismissToast();

            if (success) {
                notifySuccess("Ministério excluído com sucesso!");
                onClose();
            } else {
                notifyError("Não foi possível excluir o ministério.");
            }
        } catch {
            dismissToast();
            notifyError("Erro inesperado ao excluir ministério.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <Pressable onPress={onClose} style={styles.closeBtn}>
                        <Feather name="x" size={18} color="#6B7280" />
                    </Pressable>

                    <View style={styles.header}>
                        <Feather name="trash-2" size={18} color="#EF4444" />
                        <Text style={styles.title}>Excluir Ministério</Text>
                    </View>

                    <Text style={styles.text}>
                        Deseja realmente excluir o ministério{" "}
                        <Text style={styles.bold}>{ministry?.name}</Text>?{"\n"}
                        Essa ação não poderá ser desfeita.
                    </Text>

                    <View style={styles.actions}>
                        <Pressable onPress={onClose} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleConfirm}
                            disabled={deleting}
                            style={[
                                styles.deleteBtn,
                                deleting && styles.deleteBtnDisabled,
                            ]}
                        >
                            {deleting ? (
                                <ActivityIndicator />
                            ) : (
                                <Text style={styles.deleteText}>Excluir</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 16,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
    },
    closeBtn: {
        position: "absolute",
        top: 12,
        right: 12,
        padding: 6,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#374151",
    },
    text: {
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 20,
    },
    bold: {
        fontWeight: "700",
        color: "#111827",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 14,
    },
    cancelBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
    },
    cancelText: {
        color: "#4B5563",
        fontWeight: "600",
    },
    deleteBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#DC2626",
        borderRadius: 12,
        minWidth: 110,
        alignItems: "center",
    },
    deleteBtnDisabled: {
        opacity: 0.6,
    },
    deleteText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});
