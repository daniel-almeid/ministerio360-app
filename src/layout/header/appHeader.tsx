import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderData } from "./userHeaderData";
import { HeaderProfileMenu } from "./headerProfileMenu";

export function AppHeader() {
  const { churchName, userEmail } = useHeaderData();
  const navigation = useNavigation();

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.container}>
        <Pressable onPress={openDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={22} color="#0F766E" />
        </Pressable>

        <View style={styles.right}>
          <Text style={styles.church} numberOfLines={1}>
            {churchName}
          </Text>

          <HeaderProfileMenu
            churchName={churchName}
            userEmail={userEmail}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#0F766E",
  },

  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  church: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
    maxWidth: 180,
  },
});