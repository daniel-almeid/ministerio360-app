import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AppHeader } from "../../src/layout/header/appHeader";
import { DrawerContent } from "../../src/layout/sidebar/DrawerContent";
import { supabase } from "../../src/lib/supabase";

export default function TabsRootLayout() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSession();

        const { data: sub } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!session) {
                    router.replace("/auth/login");
                }
            }
        );

        return () => {
            sub.subscription.unsubscribe();
        };
    }, []);

    async function checkSession() {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            router.replace("/auth/login");
            return;
        }

        setLoading(false);
    }

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <Drawer
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                header: () => <AppHeader />,
                drawerStyle: {
                    backgroundColor: "#1E3A5F",
                    width: 260,
                },
            }}
        >
            <Drawer.Screen name="(tabs)" />
        </Drawer>
    );
}
