import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type Props = {
    visible: boolean;
    onClose: () => void;
};

export function UpgradeRequiredModal({ visible, onClose }: Props) {
    const router = useRouter();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <Text style={styles.title}>Recurso disponível apenas em planos superiores</Text>
                    <Text style={styles.text}>
                        Para acessar esta funcionalidade, faça upgrade do seu plano.
                    </Text>

                    <Pressable
                        onPress={() => {
                            onClose();
                            router.push("/tabs/plans");
                        }}
                        style={styles.primaryButton}
                    >
                        <Text style={styles.primaryButtonText}>Ver planos</Text>
                    </Pressable>

                    <Pressable onPress={onClose} style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Fechar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 24 },
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 24, alignItems: "center", gap: 12 },
    title: { fontSize: 18, fontWeight: "700", color: "#1F2937", textAlign: "center" },
    text: { fontSize: 14, color: "#6B7280", textAlign: "center" },
    primaryButton: { backgroundColor: "#0D9488", borderRadius: 12, paddingVertical: 14, width: "100%", alignItems: "center", marginTop: 8 },
    primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    secondaryButton: { backgroundColor: "#E5E7EB", borderRadius: 12, paddingVertical: 14, width: "100%", alignItems: "center" },
    secondaryButtonText: { color: "#374151", fontWeight: "700", fontSize: 15 },
});