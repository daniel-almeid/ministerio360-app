import { View, Text, Pressable, StyleSheet } from "react-native";

type Option = { key: string; label: string };

type Props = {
    value: string;
    options: Option[];
    onChange: (key: string) => void;
};

export function StatusPills({ value, options, onChange }: Props) {
    return (
        <View style={styles.container}>
            {options.map((opt) => {
                const active = value === opt.key;
                return (
                    <Pressable
                        key={opt.key}
                        onPress={() => onChange(opt.key)}
                        style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
                    >
                        <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>
                            {opt.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 6,
        backgroundColor: "#F3F4F6",
        padding: 6,
        borderRadius: 999,
    },
    pill: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
    },
    pillActive: {
        backgroundColor: "#38B2AC",
    },
    pillInactive: {
        backgroundColor: "transparent",
    },
    text: { fontSize: 12, fontWeight: "600" },
    textActive: { color: "#fff" },
    textInactive: { color: "#4B5563" },
});
