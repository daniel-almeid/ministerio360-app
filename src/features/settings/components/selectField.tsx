import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
    label: string;
    name: string;
    value: string;
    options: string[];
    onChange: (name: string, value: string) => void;
};

export default function SelectField({
    label,
    name,
    value,
    options,
    onChange,
}: Props) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={value}
                    onValueChange={(v) => onChange(name, v)}
                >
                    {options.map((opt) => (
                        <Picker.Item key={opt} label={opt} value={opt} />
                    ))}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 13,
        color: "#4B5563",
        marginBottom: 4,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        overflow: "hidden",
    },
});
