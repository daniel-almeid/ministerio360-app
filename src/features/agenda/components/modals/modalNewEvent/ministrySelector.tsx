import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
    ministries: any[];
    selected: string[];
    toggle: (id: string) => void;
};

export default function MinistrySelector({
    ministries,
    selected,
    toggle,
}: Props) {
    return (
        <View style={styles.container}>
            {ministries.map((m) => {
                const active = selected.includes(m.id);

                return (
                    <Pressable
                        key={m.id}
                        onPress={() => toggle(m.id)}
                        style={[
                            styles.item,
                            active && styles.itemActive,
                        ]}
                    >
                        <Text style={[styles.text, active && styles.textActive]}>
                            {m.name}
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
        flexWrap: "wrap",
        gap: 12,
        margin: 10
    },
    item: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#CBD5E0",
    },
    itemActive: {
        backgroundColor: "#38B2AC",
        borderColor: "#38B2AC",
    },
    text: {
        color: "#4A5568",
    },
    textActive: {
        color: "#fff",
    },
});
