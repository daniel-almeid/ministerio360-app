import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
};

export default function TextareaField({
    label,
    name,
    value,
    onChange,
}: Props) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                multiline
                numberOfLines={3}
                onChangeText={(text) => onChange(name, text)}
                style={styles.textarea}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 13,
        color: "#4B5563",
        marginBottom: 4,
    },
    textarea: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        padding: 12,
        textAlignVertical: "top",
    },
});
