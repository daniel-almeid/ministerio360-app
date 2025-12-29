import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
    notifySuccess,
    notifyError,
    notifyLoading,
    dismissToast,
} from "@/src/shared/ui/toast";

type Props = {
    visible: boolean;
    onConfirm: () => Promise<void> | void;
    onCancel: () => void;
};

export function ModalDeleteTransaction({
    visible,
    onConfirm,
    onCancel,
}: Props) {
    async function handleConfirm() {
        try {
            notifyLoading("Excluindo transação...");
            await onConfirm();
            dismissToast();
            notifySuccess("Transação excluída com sucesso");
            onCancel();
        } catch {
            dismissToast();
            notifyError("Erro ao excluir transação");
        }
    }

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Feather
                            name="alert-triangle"
                            size={24}
                            color="#dc2626"
                        />

                        <Pressable onPress={onCancel}>
                            <Feather
                                name="x"
                                size={22}
                                color="#9ca3af"
                            />
                        </Pressable>
                    </View>

                    <Text style={styles.title}>Excluir transação</Text>

                    <Text style={styles.description}>
                        Deseja realmente excluir esta transação? Esta ação não
                        poderá ser desfeita.
                    </Text>

                    <View style={styles.actions}>
                        <Pressable
                            style={styles.cancelButton}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={styles.deleteButton}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.deleteText}>Excluir</Text>
                        </Pressable>
                    </View>
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
        alignItems: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        width: "100%",
        maxWidth: 360,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: "#4b5563",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 20,
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    cancelText: {
        color: "#374151",
    },
    deleteButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#dc2626",
    },
    deleteText: {
        color: "#fff",
        fontWeight: "600",
    },
});
