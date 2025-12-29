import { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    churchName: string;
    userEmail: string | null;
};

export function HeaderProfileMenu({ churchName, userEmail }: Props) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: open ? 1 : 0,
                duration: 120,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: open ? 1 : 0.95,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [open]);

    async function handleLogout() {
        await supabase.auth.signOut();
        setOpen(false);
        router.replace("/auth/login");
    }

    return (
        <View style={styles.wrapper}>
            <Pressable
                onPress={() => setOpen((prev) => !prev)}
                style={styles.avatar}
            >
                <Ionicons name="business" size={20} color="#fff" />
            </Pressable>

            {open && (
                <>
                    <Pressable
                        style={styles.overlay}
                        onPress={() => setOpen(false)}
                    />

                    <Animated.View
                        style={[
                            styles.menu,
                            {
                                opacity,
                                transform: [{ scale }],
                            },
                        ]}
                    >
                        <View style={styles.header}>
                            <Text style={styles.church}>{churchName}</Text>
                            {userEmail && (
                                <Text style={styles.email} numberOfLines={1}>
                                    {userEmail}
                                </Text>
                            )}
                        </View>

                        <MenuItem
                            icon="person-outline"
                            label="Perfil da Igreja"
                            onPress={() => {
                                setOpen(false);
                                router.push("/tabs/settings");
                            }}
                        />

                        <MenuItem
                            icon="card-outline"
                            label="Planos"
                            onPress={() => {
                                setOpen(false);
                                router.push("/tabs/plans");
                            }}
                        />

                        <MenuItem
                            icon="log-out-outline"
                            label="Sair"
                            danger
                            onPress={handleLogout}
                        />
                    </Animated.View>
                </>
            )}
        </View>
    );
}

function MenuItem({
    icon,
    label,
    onPress,
    danger,
}: {
    icon: any;
    label: string;
    onPress: () => void;
    danger?: boolean;
}) {
    return (
        <Pressable style={styles.item} onPress={onPress}>
            <Ionicons
                name={icon}
                size={18}
                color={danger ? "#DC2626" : "#334155"}
            />
            <Text
                style={[
                    styles.itemText,
                    danger && { color: "#DC2626" },
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({

    wrapper: {
        position: "relative",
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#0F766E",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },

    overlay: {
        position: "absolute",
        top: -1000,
        left: -1000,
        right: -1000,
        bottom: -1000,
        zIndex: 1,
    },

    menu: {
        position: "absolute",
        top: 52,
        right: -15,
        width: 260,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        elevation: 10,
        zIndex: 2,
    },

    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },

    church: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    email: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 4,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    itemText: {
        fontSize: 15,
        color: "#334155",
    },
});
