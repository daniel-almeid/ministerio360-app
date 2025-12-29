import { View, Text, StyleSheet } from "react-native";

type Props = {
  income: number;
  expenses: number;
  visitors: number;
  nextEvent: string;
};

export function DashboardMetrics({
  income,
  expenses,
  visitors,
  nextEvent,
}: Props) {
  return (
    <View style={styles.container}>
      <Metric
        title="Entradas mês atual"
        value={formatCurrency(income)}
        color="#0d8d87ff"
      />
      <Metric
        title="Saídas mês atual"
        value={formatCurrency(expenses)}
        color="#E53E3E"
      />
      <Metric
        title="Novos visitantes"
        value={String(visitors)}
        color="#2f9e8fff"
      />
      <Metric
        title="Próximo evento"
        value={nextEvent}
        color="#3182CE"
      />
    </View>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

type MetricProps = {
  title: string;
  value: string;
  color: string;
};

function Metric({ title, value, color }: MetricProps) {
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
