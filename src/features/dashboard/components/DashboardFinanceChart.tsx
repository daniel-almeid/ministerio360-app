import { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

type Transaction = {
    amount: number;
    type: "entrada" | "saida";
    created_at: string;
};

type Props = {
    data: Transaction[];
};

const CHART_HEIGHT = 160;

function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DashboardFinanceChart({ data }: Props) {
    const chartData = useMemo(() => {
        const grouped: Record<string, { entrada: number; saida: number }> = {};

        data.forEach((item) => {
            const d = new Date(item.created_at);
            const day = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

            if (!grouped[day]) grouped[day] = { entrada: 0, saida: 0 };
            grouped[day][item.type] += Number(item.amount);
        });

        return Object.entries(grouped)
            .map(([day, values]) => ({ day, ...values }))
            .sort((a, b) => {
                const [da, ma] = a.day.split("/").map(Number);
                const [db, mb] = b.day.split("/").map(Number);
                return ma === mb ? da - db : ma - mb;
            });
    }, [data]);

    const maxValue = useMemo(() => {
        const max = Math.max(1, ...chartData.flatMap((d) => [d.entrada, d.saida]));
        return max;
    }, [chartData]);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Entradas vs Saídas</Text>

            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: "#38B2AC" }]} />
                    <Text style={styles.legendText}>Entradas</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: "#E53E3E" }]} />
                    <Text style={styles.legendText}>Saídas</Text>
                </View>
            </View>

            {chartData.length === 0 ? (
                <Text style={styles.empty}>Nenhum dado disponível para este mês.</Text>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.chartArea}>
                        {chartData.map((d) => (
                            <View key={d.day} style={styles.barGroup}>
                                <View style={styles.bars}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: (d.entrada / maxValue) * CHART_HEIGHT,
                                                backgroundColor: "#38B2AC",
                                            },
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: (d.saida / maxValue) * CHART_HEIGHT,
                                                backgroundColor: "#E53E3E",
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.dayLabel}>{d.day}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    legend: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 12,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 12,
        color: "#4B5563",
    },
    empty: {
        color: "#9CA3AF",
        textAlign: "center",
        paddingVertical: 24,
    },
    chartArea: {
        flexDirection: "row",
        alignItems: "flex-end",
        height: CHART_HEIGHT + 28,
        gap: 16,
        paddingHorizontal: 4,
    },
    barGroup: {
        alignItems: "center",
        justifyContent: "flex-end",
    },
    bars: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 4,
        height: CHART_HEIGHT,
    },
    bar: {
        width: 12,
        borderRadius: 4,
        minHeight: 2,
    },
    dayLabel: {
        marginTop: 6,
        fontSize: 11,
        color: "#6B7280",
    },
});