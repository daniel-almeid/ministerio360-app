import { useState } from "react";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../src/lib/supabase";

const UPDATE_PASSWORD_URL = "https://ministerio360.vercel.app/login/reset-password/update";

export default function ResetPasswordScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSend() {
        setError("");

        if (!email.trim()) {
            setError("Informe seu e-mail.");
            return;
        }

        setLoading(true);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: UPDATE_PASSWORD_URL,
        });

        setLoading(false);

        if (resetError) {
            setError("Não foi possível enviar o link. Tente novamente.");
            return;
        }

        setSent(true);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <View style={styles.card}>
                <Pressable onPress={() => router.replace("/auth/login")} style={styles.backRow}>
                    <Feather name="arrow-left" size={16} color="#38B2AC" />
                    <Text style={styles.backText}>Voltar ao login</Text>
                </Pressable>

                {!sent ? (
                    <>
                        <Text style={styles.title}>Recuperar senha</Text>
                        <Text style={styles.label}>Digite seu e-mail</Text>

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <Pressable disabled={loading} onPress={handleSend} style={styles.primaryButton}>
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Enviar link</Text>
                            )}
                        </Pressable>
                    </>
                ) : (
                    <View style={styles.successBox}>
                        <Feather name="check-circle" size={40} color="#059669" />
                        <Text style={styles.successTitle}>E-mail enviado!</Text>
                        <Text style={styles.successText}>
                            Se o e-mail existir, você receberá um link para redefinir sua senha.
                            Abra o link pelo navegador do seu celular para criar a nova senha.
                        </Text>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E5E7EB", justifyContent: "center", paddingHorizontal: 24 },
    card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, gap: 14, elevation: 4 },
    backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
    backText: { color: "#38B2AC", fontWeight: "600" },
    title: { fontSize: 22, fontWeight: "800", color: "#1F2937", textAlign: "center", marginBottom: 4 },
    label: { color: "#374151", marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
    },
    errorText: { color: "#EF4444", textAlign: "center" },
    primaryButton: { backgroundColor: "#38B2AC", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 4 },
    primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
    successBox: { alignItems: "center", gap: 10, paddingVertical: 12 },
    successTitle: { fontSize: 18, fontWeight: "700", color: "#059669" },
    successText: { fontSize: 14, color: "#6B7280", textAlign: "center" },
});