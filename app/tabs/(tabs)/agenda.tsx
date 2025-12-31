import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import EventSection from "@/src/features/agenda/components/eventSection";
import { supabase } from "@/src/lib/supabase";
import type { Ministry } from "@/src/features/agenda/types/agenda";

export default function Agenda() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  function reload() {
    setReloadFlag((v) => !v);
  }

  useEffect(() => {
    loadMinistries();
  }, [reloadFlag]);

  async function loadMinistries() {
    const { data } = await supabase
      .from("ministries")
      .select("id, name")
      .order("name");

    setMinistries(data || []);
  }

  return (
    <View style={styles.container}>
      <EventSection
        ministries={ministries}
        onRefreshMinistries={reload}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
});
