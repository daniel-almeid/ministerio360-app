import { View, Text, StyleSheet } from "react-native";
import Loading from "../../../shared/ui/loading";
import { useReports } from "../hooks/useReports";
import FinancialReportSection from "../components/financialReport";
import MembersReportSection from "../components/membersReport";

export default function ReportsSection() {
    const {
        selectedMonth,
        setSelectedMonth,
        financialData,
        activeMembers,
        monthlyVisitors,
        loading,
    } = useReports();

    if (loading) {
        return <Loading visible />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Relatórios</Text>
                <Text style={styles.subtitle}>
                    Visão geral financeira e de membros
                </Text>
            </View>

            <FinancialReportSection
                month={selectedMonth}
                financialData={financialData}
                loading={loading}
                onChangeMonth={setSelectedMonth}
                activeMembers={activeMembers}
                monthlyVisitors={monthlyVisitors}
            />

            <MembersReportSection
                activeMembers={activeMembers}
                monthlyVisitors={monthlyVisitors}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 20,
        backgroundColor: "#f6f7f9",
    },
    header: {
        marginBottom: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1f2933",
    },
    subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: "#6b7280",
    },
});
