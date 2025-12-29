import { View, Text, StyleSheet } from "react-native";

export function DashboardMetrics({
  income,
  expenses,
  visitors,
  nextEvent,
}: any) {
  return (
    <View style={styles.container}>
      <Metric title="Entradas mês atual" value={income} color="#38B2AC" />
      <Metric title="Saídas mês atual" value={expenses} color="#E53E3E" />
      <Metric title="Novos visitantes" value={visitors} color="#81E6D9" />
      <Metric title="Próximo evento" value={nextEvent} color="#3182CE" />
    </View>
  );
}

function Metric({ title, value, color }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
  },
});
