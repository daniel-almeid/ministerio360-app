import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type Visitor = {
    id: string;
    name: string;
    visit_date: string;
    phone?: string | null;
    email?: string | null;
};

export function DashboardVisitors({ visitors }: { visitors: Visitor[] }) {
    const recentVisitors = useMemo(() => {
        const today = new Date();
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(today.getDate() - 14);

        return visitors.filter((v) => {
            if (!v.visit_date) return false;
            const [y, m, d] = v.visit_date.split("-").map(Number);
            const visitDate = new Date(y, m - 1, d);
            return visitDate >= twoWeeksAgo && visitDate <= today;
        });
    }, [visitors]);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Visitantes recentes (últimas 2 semanas)</Text>

            {recentVisitors.length === 0 ? (
                <Text style={styles.empty}>Nenhum visitante registrado nas últimas semanas.</Text>
            ) : (
                recentVisitors.map((v) => (
                    <View key={v.id} style={styles.item}>
                        <Text style={styles.name}>{v.name}</Text>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Feather name="calendar" size={13} color="#38B2AC" />
                                <Text style={styles.metaText}>
                                    {v.visit_date.split("-").reverse().join("/")}
                                </Text>
                            </View>

                            {v.phone ? (
                                <View style={styles.metaItem}>
                                    <Feather name="phone" size={13} color="#38B2AC" />
                                    <Text style={styles.metaText}>{v.phone}</Text>
                                </View>
                            ) : v.email ? (
                                <View style={styles.metaItem}>
                                    <Feather name="mail" size={13} color="#38B2AC" />
                                    <Text style={styles.metaText}>{v.email}</Text>
                                </View>
                            ) : (
                                <Text style={styles.notInformed}>Não informado</Text>
                            )}
                        </View>
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, elevation: 2, marginBottom: 24 },
    title: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 12 },
    empty: { color: "#6B7280", textAlign: "center", paddingVertical: 16 },
    item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
    name: { fontSize: 15, fontWeight: "600", color: "#1F2937" },
    metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginTop: 6 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    metaText: { fontSize: 13, color: "#4B5563" },
    notInformed: { fontSize: 13, color: "#9CA3AF" },
});