import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    loading?: boolean;
    title?: string;
    message?: string;
};

export default function ConfirmDeleteModal({
    open,
    onClose,
    onConfirm,
    loading = false,
    title = "Excluir registro",
    message = "Tem certeza que deseja excluir este item?",
}: Props) {
    if (!open) return null;

    return (
        <Modal transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <Pressable onPress={onClose} disabled={loading}>
                            <Text>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.deleteButton, loading && styles.disabled]}
                            onPress={onConfirm}
                            disabled={loading}
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
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 16,
    },
    box: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
    },
    title: {
        fontWeight: "600",
        fontSize: 16,
    },
    message: {
        marginTop: 8,
        color: "#4A5568",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 20,
    },
    deleteButton: {
        backgroundColor: "#E53E3E",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    deleteText: {
        color: "#fff",
    },
    disabled: {
        opacity: 0.6,
    },
});
