import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { PlanDefinition, PlanSlug } from "../types/plans";

type Props = {
    currentPlan: PlanDefinition;
    price: number;
    formattedExpiresOn: string | null;
};

export function CurrentPlanCard({ currentPlan, price, formattedExpiresOn }: Props) {
    return (
        <View style={styles.row}>
            <View style={styles.iconCircle}>
                <Feather name="award" size={22} color="#0F766E" />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.label}>Plano atual</Text>
                <Text style={styles.planName}>{currentPlan.name.toUpperCase()}</Text>

                {price > 0 ? (
                    <Text style={styles.detail}>R$ {price.toFixed(2)} / mês</Text>
                ) : (
                    <Text style={styles.detail}>Plano gratuito com recursos limitados</Text>
                )}

                {formattedExpiresOn && (
                    <Text style={styles.detail}>
                        Plano válido até <Text style={styles.bold}>{formattedExpiresOn}</Text>
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F0FDFA",
        alignItems: "center",
        justifyContent: "center",
    },
    label: { fontSize: 13, color: "#6B7280" },
    planName: { fontSize: 22, fontWeight: "800", color: "#0F766E", marginTop: 2 },
    detail: { fontSize: 13, color: "#6B7280", marginTop: 4 },
    bold: { fontWeight: "700", color: "#374151" },
});