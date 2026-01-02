import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
    saving: boolean;
    onClose: () => void;
    onSubmit: () => void;
};

export default function SubmitActions({ saving, onClose, onSubmit }: Props) {
    return (
        <View style={styles.row}>
            <Pressable onPress={onClose}>
                <Text style={styles.cancel}>Cancelar</Text>
            </Pressable>

            <Pressable
                onPress={onSubmit}
                disabled={saving}
                style={styles.submit}
            >
                <Text style={styles.submitText}>
                    {saving ? "Salvando..." : "Salvar"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 10,
    },
    cancel: {
        fontSize: 14,
        color: "#374151",
    },
    submit: {
        backgroundColor: "#38B2AC",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    submitText: {
        color: "#fff",
        fontWeight: "700",
    },
});
