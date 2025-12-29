import { ScrollView, StyleSheet, View } from "react-native";
import { useDashboardData } from "../../../src/features/dashboard/useDashboardData";
import { DashboardMetrics } from "../../../src/features/dashboard/components/DashboardMetrics";
import { DashboardEvents } from "../../../src/features/dashboard/components/DashboardEvents";
import { DashboardVisitors } from "../../../src/features/dashboard/components/DashboardVisitors";
import Loading from "../../../src/shared/ui/loading";

export default function Dashboard() {
  const {
    currentMonthIncome,
    currentMonthExpenses,
    visitors,
    events,
    loading,
  } = useDashboardData();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <DashboardMetrics
          income={currentMonthIncome}
          expenses={currentMonthExpenses}
          visitors={visitors.length}
          nextEvent={events[0]?.title ?? "Nenhum"}
        />

        <DashboardEvents events={events} />
        <DashboardVisitors visitors={visitors} />
      </ScrollView>

      {/* Loading overlay */}
      <Loading visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F3F4F6",
  },
});
