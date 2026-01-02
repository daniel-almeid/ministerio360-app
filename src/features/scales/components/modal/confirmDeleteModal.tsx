import { Modal, View, Text, StyleSheet, Pressable } from "react-native";

type Props = {
    open: boolean;
    loading?: boolean;
    title?: string;
    message?: string;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmDeleteModal({
    open,
    loading = false,
    title = "Excluir registro",
    message = "Tem certeza que deseja excluir este item?",
    onClose,
    onConfirm,
}: Props) {
    if (!open) return null;

    return (
        <Modal visible transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <Pressable onPress={onClose} disabled={loading}>
                            <Text style={styles.cancel}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            onPress={onConfirm}
                            disabled={loading}
                            style={styles.deleteBtn}
                        >
                            <Text style={styles.deleteText}>
                                {loading ? "Excluindo..." : "Excluir"}
                            </Text>
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
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 24,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    message: {
        marginTop: 8,
        fontSize: 13,
        color: "#6B7280",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 20,
    },
    cancel: {
        fontSize: 14,
        color: "#374151",
    },
    deleteBtn: {
        backgroundColor: "#DC2626",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
    },
});
