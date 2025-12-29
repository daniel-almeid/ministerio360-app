import { useState } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Modal,
    FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Option = {
    id: string;
    name: string;
};

type Props = {
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
};

export function MinistrySelect({
    value,
    options,
    onChange,
    placeholder = "Ministério",
}: Props) {
    const [open, setOpen] = useState(false);

    const selectedLabel =
        value && options.find((m) => m.id === value)?.name
            ? options.find((m) => m.id === value)?.name
            : placeholder;

    const isPlaceholder = !value;

    return (
        <>
            <Pressable style={styles.input} onPress={() => setOpen(true)}>
                <Text
                    style={[
                        styles.value,
                        isPlaceholder && styles.placeholder,
                    ]}
                    numberOfLines={1}
                >
                    {selectedLabel}
                </Text>
                <Feather name="chevron-down" size={18} color="#6B7280" />
            </Pressable>

            <Modal visible={open} transparent animationType="fade">
                <Pressable
                    style={styles.overlay}
                    onPress={() => setOpen(false)}
                >
                    <View style={styles.sheet}>
                        <Pressable
                            style={[
                                styles.option,
                                !value && styles.optionSelected,
                            ]}
                            onPress={() => {
                                onChange("");
                                setOpen(false);
                            }}
                        >
                            <Text>Sem ministério</Text>
                        </Pressable>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.option,
                                        item.id === value &&
                                        styles.optionSelected,
                                    ]}
                                    onPress={() => {
                                        onChange(item.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Text>{item.name}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12, // 🔑 mesmo espaçamento do TextInput
        backgroundColor: "#fff",
    },
    value: {
        fontSize: 14,
        color: "#374151",
        flex: 1,
        marginRight: 8,
    },
    placeholder: {
        color: "#9CA3AF",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 24,
    },
    sheet: {
        backgroundColor: "#fff",
        borderRadius: 12,
        maxHeight: "70%",
        overflow: "hidden",
    },
    option: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    optionSelected: {
        backgroundColor: "#E6FFFA",
    },
});
