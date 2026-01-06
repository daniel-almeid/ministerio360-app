import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import Loading from "../../../shared/ui/loading";
import type { FinancialReportItem } from "../types/types";
import { generatePdfReport } from "../utils/generatePdfReports";

type Props = {
    month: string;
    financialData: FinancialReportItem[];
    loading: boolean;
    onChangeMonth: (m: string) => void;
    activeMembers: number;
    monthlyVisitors: number;
};

function formatMonthLabel(value: string) {
    const [y, m] = value.split("-");
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date
        .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
        .replace(/^./, c => c.toUpperCase());
}

const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
];

export default function FinancialReportSection({
    month,
    financialData,
    loading,
    onChangeMonth,
    activeMembers,
    monthlyVisitors,
}: Props) {
    const [monthOpen, setMonthOpen] = useState(false);
    const [year, setYear] = useState(Number(month.split("-")[0]));

    const label = useMemo(() => formatMonthLabel(month), [month]);

    function selectMonth(index: number) {
        onChangeMonth(
            `${year}-${String(index + 1).padStart(2, "0")}`
        );
        setMonthOpen(false);
    }

    const totalIncome = financialData.reduce((acc, i) => acc + i.income, 0);
    const totalExpense = financialData.reduce((acc, i) => acc + i.expense, 0);
    const totalBalance = totalIncome - totalExpense;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Relatório Financeiro</Text>

            <View style={styles.actions}>
                <Pressable
                    style={styles.filterButton}
                    onPress={() => setMonthOpen(true)}
                >
                    <Feather name="calendar" size={16} color="#38B2AC" />
                    <Text style={styles.filterText}>{label}</Text>
                </Pressable>

                <Pressable
                    style={styles.pdfButton}
                    onPress={() =>
                        generatePdfReport({
                            month,
                            financialData,
                            activeMembers,
                            monthlyVisitors,
                        })
                    }
                >
                    <Feather name="file-text" size={16} color="#fff" />
                    <Text style={styles.pdfText}>PDF</Text>
                </Pressable>
            </View>

            {loading ? (
                <View style={styles.loading}>
                    <Loading visible />
                </View>
            ) : financialData.length === 0 ? (
                <Text style={styles.empty}>
                    Nenhuma transação encontrada neste mês.
                </Text>
            ) : (
                <ScrollView
                    style={styles.list}
                    contentContainerStyle={{ paddingBottom: 8 }}
                >
                    {financialData.map(item => (
                        <View key={item.category} style={styles.itemCard}>
                            <Text style={styles.category}>
                                {item.category}
                            </Text>

                            <View style={styles.row}>
                                <Text style={styles.label}>Entrada</Text>
                                <Text style={styles.income}>
                                    R$ {item.income.toFixed(2).replace(".", ",")}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Saída</Text>
                                <Text style={styles.expense}>
                                    R$ {item.expense.toFixed(2).replace(".", ",")}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Balanço</Text>
                                <Text
                                    style={[
                                        styles.balance,
                                        item.balance < 0 && styles.negative,
                                    ]}
                                >
                                    R$ {item.balance
                                        .toFixed(2)
                                        .replace(".", ",")}
                                </Text>
                            </View>
                        </View>
                    ))}

                    <View style={styles.totalCard}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text
                            style={[
                                styles.totalValue,
                                totalBalance < 0 && styles.negative,
                            ]}
                        >
                            R$ {totalBalance.toFixed(2).replace(".", ",")}
                        </Text>
                    </View>
                </ScrollView>
            )}

            <Modal transparent visible={monthOpen} animationType="fade">
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setMonthOpen(false)}
                >
                    <View style={styles.monthPicker}>
                        <View style={styles.yearRow}>
                            <Pressable onPress={() => setYear(y => y - 1)}>
                                <Feather name="chevron-left" size={20} />
                            </Pressable>

                            <Text style={styles.year}>{year}</Text>

                            <Pressable onPress={() => setYear(y => y + 1)}>
                                <Feather name="chevron-right" size={20} />
                            </Pressable>
                        </View>

                        <View style={styles.monthGrid}>
                            {months.map((m, i) => (
                                <Pressable
                                    key={m}
                                    style={styles.monthButton}
                                    onPress={() => selectMonth(i)}
                                >
                                    <Text style={styles.monthText}>{m}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </Modal>
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
        color: "#374151",
        marginBottom: 10,
    },
    actions: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 8,
        borderRadius: 10,
    },
    filterText: {
        fontWeight: "600",
        color: "#374151",
    },
    pdfButton: {
        flexDirection: "row",
        gap: 6,
        backgroundColor: "#38B2AC",
        padding: 8,
        borderRadius: 10,
    },
    pdfText: {
        color: "#fff",
        fontWeight: "700",
    },
    loading: {
        paddingVertical: 24,
        alignItems: "center",
    },
    empty: {
        textAlign: "center",
        marginTop: 24,
        color: "#6b7280",
    },
    list: {
        maxHeight: 420,
    },
    itemCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    category: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        color: "#6b7280",
    },
    income: {
        fontSize: 14,
        fontWeight: "500",
        color: "#16a34a",
    },
    expense: {
        fontSize: 14,
        fontWeight: "500",
        color: "#dc2626",
    },
    balance: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    negative: {
        color: "#dc2626",
    },
    totalCard: {
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    totalLabel: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    monthPicker: {
        backgroundColor: "#fff",
        borderRadius: 14,
        width: 300,
        padding: 14,
    },
    yearRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    year: {
        fontSize: 16,
        fontWeight: "700",
    },
    monthGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 12,
    },
    monthButton: {
        width: "33.33%",
        paddingVertical: 12,
        alignItems: "center",
    },
    monthText: {
        fontWeight: "600",
    },
});
