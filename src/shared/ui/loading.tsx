import { View, Text, StyleSheet, ActivityIndicator, Animated } from "react-native";
import { useEffect, useRef } from "react";

type Props = {
    visible: boolean;
};

export default function Loading({ visible }: Props) {
    const opacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0.3)).current;
    const translateX = useRef(new Animated.Value(-120)).current;

    // animações iniciam UMA VEZ
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(textOpacity, {
                    toValue: 0.3,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.timing(translateX, {
                toValue: 120,
                duration: 1200,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    // apenas mostra / esconde
    useEffect(() => {
        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    return (
        <Animated.View
            pointerEvents={visible ? "auto" : "none"}
            style={[styles.overlay, { opacity }]}
        >
            <View style={styles.card}>
                <ActivityIndicator size="large" color="#38B2AC" />

                <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
                    Carregando...
                </Animated.Text>

                <View style={styles.progressBar}>
                    <Animated.View
                        style={[
                            styles.progress,
                            { transform: [{ translateX }] },
                        ]}
                    />
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
    },

    card: {
        alignItems: "center",
    },

    text: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: "500",
        color: "#374151",
    },

    progressBar: {
        width: 160,
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 999,
        marginTop: 14,
        overflow: "hidden",
    },

    progress: {
        width: 80,
        height: "100%",
        backgroundColor: "#38B2AC",
        borderRadius: 999,
    },
});
