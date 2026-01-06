import { View, Text, StyleSheet } from "react-native";

type Props = {
    activeMembers: number;
    monthlyVisitors: number;
};

export default function MembersReportSection({
    activeMembers,
    monthlyVisitors,
}: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Relatório de Membros</Text>

            <View style={styles.grid}>
                <View style={styles.metricCard}>
                    <Text style={styles.label}>Membros ativos</Text>
                    <Text style={styles.value}>{activeMembers}</Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.label}>Visitantes no mês</Text>
                    <Text style={styles.value}>{monthlyVisitors}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        color: "#1f2933",
    },
    grid: {
        flexDirection: "row",
        gap: 12,
    },
    metricCard: {
        flex: 1,
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        padding: 16,
    },
    label: {
        fontSize: 13,
        color: "#6b7280",
    },
    value: {
        marginTop: 6,
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
    },
});
