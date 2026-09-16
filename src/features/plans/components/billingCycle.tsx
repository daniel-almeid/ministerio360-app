import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
    hasPaidPlan: boolean;
    formattedLastPayment: string | null;
    formattedNextPayment: string | null;
    progressPercent: number;
};

export function BillingCycle({
    hasPaidPlan,
    formattedLastPayment,
    formattedNextPayment,
    progressPercent,
}: Props) {
    if (!hasPaidPlan) return null;

    return (
        <View style={styles.container}>
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Ciclo de cobrança</Text>

            {formattedLastPayment && (
                <View style={styles.row}>
                    <Feather name="credit-card" size={14} color="#6B7280" />
                    <Text style={styles.text}>
                        Último pagamento em <Text style={styles.bold}>{formattedLastPayment}</Text>
                    </Text>
                </View>
            )}

            {formattedNextPayment && (
                <View style={styles.row}>
                    <Feather name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.text}>
                        Próxima cobrança em <Text style={styles.bold}>{formattedNextPayment}</Text>
                    </Text>
                </View>
            )}

            <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>CICLO ATUAL</Text>
                <Text style={styles.progressLabel}>{progressPercent}% UTILIZADO</Text>
            </View>

            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>

            {formattedLastPayment && formattedNextPayment && (
                <View style={styles.progressDates}>
                    <Text style={styles.progressDateText}>{formattedLastPayment}</Text>
                    <Text style={styles.progressDateText}>{formattedNextPayment}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 20 },
    divider: { height: 1, backgroundColor: "#E5E7EB", marginBottom: 16 },
    sectionTitle: { fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 12 },
    row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
    text: { fontSize: 13, color: "#374151" },
    bold: { fontWeight: "700" },
    progressHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
    progressLabel: { fontSize: 10, color: "#9CA3AF", fontWeight: "700" },
    progressTrack: { height: 8, borderRadius: 999, backgroundColor: "#F3F4F6", marginTop: 6, overflow: "hidden" },
    progressFill: { height: "100%", backgroundColor: "#38B2AC", borderRadius: 999 },
    progressDates: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
    progressDateText: { fontSize: 10, color: "#9CA3AF" },
});