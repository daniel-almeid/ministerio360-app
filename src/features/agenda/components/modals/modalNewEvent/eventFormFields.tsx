import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parse } from "date-fns";

type Props = {
    form: {
        title: string;
        date: string; // DD/MM/YYYY
        time: string; // HH:mm
        location: string;
    };
    setForm: (v: any) => void;
};

export default function EventFormFields({ form, setForm }: Props) {
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    function handleDateChange(_: any, selectedDate?: Date) {
        setShowDate(false);
        if (!selectedDate) return;

        setForm({
            ...form,
            date: format(selectedDate, "dd/MM/yyyy"),
        });
    }

    function handleTimeChange(_: any, selectedTime?: Date) {
        setShowTime(false);
        if (!selectedTime) return;

        setForm({
            ...form,
            time: format(selectedTime, "HH:mm"),
        });
    }

    function getDateValue() {
        if (!form.date) return new Date();
        return parse(form.date, "dd/MM/yyyy", new Date());
    }

    return (
        <View style={styles.container}>
            {/* Título */}
            <View>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    placeholder="Digite o título"
                    value={form.title}
                    onChangeText={(v) => setForm({ ...form, title: v })}
                    style={styles.input}
                />
            </View>

            {/* Data */}
            <View>
                <Text style={styles.label}>Data</Text>
                <Pressable style={styles.input} onPress={() => setShowDate(true)}>
                    <Text>{form.date || "Selecionar data"}</Text>
                </Pressable>

                {showDate && (
                    <DateTimePicker
                        value={getDateValue()}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            {/* Hora */}
            <View>
                <Text style={styles.label}>Hora</Text>
                <Pressable style={styles.input} onPress={() => setShowTime(true)}>
                    <Text>{form.time || "Selecionar hora"}</Text>
                </Pressable>

                {showTime && (
                    <DateTimePicker
                        value={new Date()}
                        mode="time"
                        display="spinner"
                        is24Hour
                        onChange={handleTimeChange}
                    />
                )}
            </View>

            {/* Local */}
            <View>
                <Text style={styles.label}>Local</Text>
                <TextInput
                    placeholder="Digite o local"
                    value={form.location}
                    onChangeText={(v) => setForm({ ...form, location: v })}
                    style={styles.input}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 14,
    },
    label: {
        fontSize: 13,
        color: "#4A5568",
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#fff",
    },
});
