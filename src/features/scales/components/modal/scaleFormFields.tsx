import { View, TextInput, StyleSheet } from "react-native";

type Props = {
    form: any;
    setForm: (v: any) => void;
};

export default function ScaleFormFields({ form, setForm }: Props) {
    return (
        <View style={styles.grid}>
            <TextInput
                style={styles.input}
                placeholder="Data (YYYY-MM-DD)"
                value={form.date}
                onChangeText={(v) => setForm({ date: v })}
            />

            <TextInput
                style={styles.input}
                placeholder="Responsável"
                value={form.responsible}
                onChangeText={(v) => setForm({ responsible: v })}
            />

            <TextInput
                style={styles.input}
                placeholder="Evento"
                value={form.event}
                onChangeText={(v) => setForm({ event: v })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
    },
});
