import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function UpgradeRequiredModal({ open, onClose }: Props) {
    const router = useRouter();

    return (
        <Modal visible={open} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>
                        Recurso disponível apenas em planos superiores
                    </Text>

                    <Text style={styles.subtitle}>
                        Para acessar esta funcionalidade, faça upgrade do seu plano.
                    </Text>

                    <Pressable
                        style={styles.primaryButton}
                        onPress={() => router.push("/tabs/plans")}
                    >
                        <Text style={styles.buttonText}>Ver planos</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryButton} onPress={onClose}>
                        <Text style={styles.secondaryText}>Fechar</Text>
                    </Pressable>
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
    modal: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 12,
    },
    subtitle: {
        textAlign: "center",
        color: "#6b7280",
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: "#0d9488",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    secondaryButton: {
        marginTop: 10,
        backgroundColor: "#e5e7eb",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "600",
    },
    secondaryText: {
        color: "#374151",
        fontWeight: "600",
    },
});