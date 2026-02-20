import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    placeholder?: string;
    keyboardType?: any;
};

export default function InputField({
    label,
    name,
    value,
    onChange,
    placeholder,
    keyboardType,
}: Props) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                placeholder={placeholder}
                keyboardType={keyboardType}
                onChangeText={(text) => onChange(name, text)}
                style={styles.input}
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
    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
});
