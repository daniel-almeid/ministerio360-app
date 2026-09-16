import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
    visible: boolean;
    formattedExpiresOn: string | null;
    onClose: () => void;
};

export function CancelSubscriptionModal({ visible, formattedExpiresOn, onClose }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <Text style={styles.title}>Cancelamento de assinatura</Text>

                    <Text style={styles.text}>
                        O cancelamento tradicional não está disponível. Seu plano é pré-pago e
                        permanecerá ativo até:
                    </Text>

                    <Text style={styles.date}>{formattedExpiresOn || "Data não encontrada"}</Text>

                    <Text style={styles.text}>
                        Após essa data, sua conta retornará automaticamente ao plano gratuito.
                    </Text>

                    <Pressable onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>Entendi</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 20 },
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, gap: 14 },
    title: { fontSize: 18, fontWeight: "700", color: "#1F2937" },
    text: { fontSize: 14, color: "#4B5563", lineHeight: 20 },
    date: { fontSize: 18, fontWeight: "700", color: "#0F766E", textAlign: "center" },
    button: { backgroundColor: "#0D9488", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});