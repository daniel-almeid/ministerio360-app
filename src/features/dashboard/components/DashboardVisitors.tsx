import { View, Text, StyleSheet } from "react-native";

export function DashboardVisitors({ visitors }: any) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Visitantes recentes</Text>

            {visitors.length === 0 ? (
                <Text style={styles.empty}>Nenhum visitante recente.</Text>
            ) : (
                visitors.map((v: any) => (
                    <View key={v.id} style={styles.item}>
                        <Text style={styles.name}>{v.name}</Text>
                        <Text style={styles.date}>
                            {v.visit_date.split("-").reverse().join("/")}
                        </Text>
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 16,
        elevation: 2,
        marginBottom: 24,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 12,
    },
    empty: {
        color: "#6B7280",
        textAlign: "center",
        paddingVertical: 16,
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    name: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1F2937",
    },
    date: {
        marginTop: 4,
        fontSize: 13,
        color: "#6B7280",
    },
});
