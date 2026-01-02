import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
    ministries: any[];
    selected: string[];
    toggleMinistry: (id: string) => void;
};

export default function MinistrySelector({ ministries, selected, toggleMinistry }: Props) {
    return (
        <View style={styles.wrap}>
            {ministries.map((m) => (
                <Pressable
                    key={m.id}
                    onPress={() => toggleMinistry(m.id)}
                    style={[
                        styles.item,
                        selected.includes(m.id) && styles.active,
                    ]}
                >
                    <Text style={selected.includes(m.id) ? styles.activeText : styles.text}>
                        {m.name}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    item: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },
    active: {
        backgroundColor: "#38B2AC",
        borderColor: "#38B2AC",
    },
    text: {
        fontSize: 13,
        color: "#374151",
    },
    activeText: {
        fontSize: 13,
        color: "#fff",
        fontWeight: "700",
    },
});
