import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    Platform,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    toISODate,
    fromISODate,
    formatDateBR,
} from "@/src/shared/utils/date";

type Props = {
    form: {
        date: string;
        event: string;
        responsible: string;
    };
    setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function ScaleFormFields({ form, setForm }: Props) {
    const [showPicker, setShowPicker] = useState(false);

    function handleChange(_: any, selected?: Date) {
        setShowPicker(false);
        if (!selected) return;

        setForm((prev: any) => ({
            ...prev,
            date: toISODate(selected),
        }));
    }

    return (
        <View style={styles.grid}>
            <Pressable onPress={() => setShowPicker(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Data"
                    value={form.date ? formatDateBR(form.date) : ""}
                    editable={false}
                    pointerEvents="none"
                />
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={
                        form.date
                            ? fromISODate(form.date)
                            : new Date()
                    }
                    mode="date"
                    display={
                        Platform.OS === "ios" ? "spinner" : "default"
                    }
                    onChange={handleChange}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Responsável"
                value={form.responsible}
                onChangeText={(v) =>
                    setForm((prev: any) => ({
                        ...prev,
                        responsible: v,
                    }))
                }
            />

            <TextInput
                style={styles.input}
                placeholder="Evento"
                value={form.event}
                onChangeText={(v) =>
                    setForm((prev: any) => ({
                        ...prev,
                        event: v,
                    }))
                }
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
        backgroundColor: "#FFFFFF",
    },
});
