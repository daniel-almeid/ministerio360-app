import { View, TextInput, StyleSheet } from "react-native";

type Props = {
    form: any;
    setForm: (v: any) => void;
};

export default function EventFormFields({ form, setForm }: Props) {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Título"
                value={form.title}
                onChangeText={(v) => setForm({ ...form, title: v })}
                style={styles.input}
            />

            <TextInput
                placeholder="Data (YYYY-MM-DD)"
                value={form.date}
                onChangeText={(v) => setForm({ ...form, date: v })}
                style={styles.input}
            />

            <TextInput
                placeholder="Hora (HH:mm)"
                value={form.time}
                onChangeText={(v) => setForm({ ...form, time: v })}
                style={styles.input}
            />

            <TextInput
                placeholder="Local"
                value={form.location}
                onChangeText={(v) => setForm({ ...form, location: v })}
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        padding: 10,
    },
});
