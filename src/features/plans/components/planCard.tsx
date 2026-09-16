import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { PlanSlug } from "../types/plans";

type Props = {
    slug: PlanSlug;
    name: string;
    price: string;
    features: string[];
    current: PlanSlug;
    active: boolean;
    processing: boolean;
    onSubscribe: () => void;
};

export default function PlanCard({ slug, name, price, features, current, active, processing, onSubscribe }: Props) {
    const isSelected = current === slug;
    const isActive = active && isSelected;

    return (
        <View style={[styles.card, isSelected && styles.cardSelected]}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.price}>{price}</Text>

            <View style={styles.features}>
                {features.map((f) => (
                    <View key={f} style={styles.featureRow}>
                        <Feather name="check" size={16} color="#38B2AC" />
                        <Text style={styles.featureText}>{f}</Text>
                    </View>
                ))}
            </View>

            {isActive ? (
                <View style={[styles.button, styles.buttonDisabled]}>
                    <Text style={styles.buttonTextDisabled}>Plano atual</Text>
                </View>
            ) : (
                <Pressable
                    onPress={onSubscribe}
                    disabled={processing}
                    style={[styles.button, processing && styles.buttonDisabled]}
                >
                    {processing ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{slug === "free" ? "Selecionar" : "Assinar"}</Text>
                    )}
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB", padding: 20, marginBottom: 16 },
    cardSelected: { borderColor: "#38B2AC", backgroundColor: "#F0FDFA" },
    name: { fontSize: 20, fontWeight: "800", color: "#1F2937" },
    price: { fontSize: 24, fontWeight: "800", color: "#1F2937", marginTop: 4, marginBottom: 12 },
    features: { gap: 8, marginBottom: 16 },
    featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    featureText: { fontSize: 14, color: "#374151", flexShrink: 1 },
    button: { backgroundColor: "#38B2AC", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
    buttonDisabled: { backgroundColor: "#D1D5DB" },
    buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    buttonTextDisabled: { color: "#6B7280", fontWeight: "700", fontSize: 15 },
});