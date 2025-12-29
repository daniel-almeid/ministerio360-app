import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDrawerData } from "./useDrawerData";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

const ADMIN_ID = "289d49c4-8db0-49e2-b527-af90809f3be8";

const links = [
  { href: "/tabs/dashboard", label: "Dashboard", icon: "home", plan: "free" },
  { href: "/tabs/finances", label: "Finanças", icon: "cash", plan: "free" },
  { href: "/tabs/ministries", label: "Ministérios", icon: "business", plan: "premium" },
  { href: "/tabs/members", label: "Membros", icon: "people", plan: "free" },
  { href: "/tabs/visitors", label: "Visitantes", icon: "person-add", plan: "standard" },
  { href: "/tabs/agenda", label: "Agenda e Escalas", icon: "calendar", plan: "premium" },
  { href: "/tabs/reports", label: "Relatórios", icon: "bar-chart", plan: "standard" },
  { href: "/tabs/settings", label: "Configurações", icon: "settings", plan: "free" },
] as const;

type DrawerLink = typeof links[number]["href"];

export function DrawerContent({ navigation }: DrawerContentComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { plan, userId } = useDrawerData();

  function canAccess(required: string) {
    const level = { free: 1, standard: 2, premium: 3 };
    return level[plan] >= level[required as keyof typeof level];
  }

  function go(href: DrawerLink) {
    navigation.closeDrawer();
    router.replace(href as any);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Ministério360</Text>

        <Pressable onPress={() => navigation.closeDrawer()} style={styles.closeButton}>
          <Ionicons name="close" size={22} color="#E6FFFA" />
        </Pressable>
      </View>

      <View style={styles.links}>
        {links.map(({ href, label, icon, plan: required }) => {
          const active = pathname === href;
          const allowed = canAccess(required);

          return (
            <Pressable
              key={href}
              onPress={() => allowed && go(href)}
              style={[
                styles.link,
                active && styles.active,
                !allowed && styles.disabled,
              ]}
            >
              <Ionicons
                name={icon as any}
                size={22}
                color={active ? "#FFFFFF" : "#81E6D9"}
              />
              <Text style={styles.label}>{label}</Text>
            </Pressable>
          );
        })}

        {userId === ADMIN_ID && (
          <Pressable
            onPress={() => {
              navigation.closeDrawer();
              router.replace("/tabs/(tabs)/admin");
            }}
            style={styles.link}
          >
            <Ionicons name="shield" size={22} color="#81E6D9" />
            <Text style={styles.label}>Admin</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Ministério360
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A5F",
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  links: {
    padding: 12,
    gap: 6,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 12,
    borderRadius: 10,
  },
  active: {
    backgroundColor: "#38B2AC",
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: "#E6FFFA",
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    marginTop: "auto",
    padding: 16,
  },
  footerText: {
    color: "#A0AEC0",
    fontSize: 12,
    textAlign: "center",
  },
});
