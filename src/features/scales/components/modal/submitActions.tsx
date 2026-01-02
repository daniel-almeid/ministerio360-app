import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
    saving: boolean;
    onClose: () => void;
    onSubmit: () => void;
};

export default function SubmitActions({ saving, onClose, onSubmit }: Props) {
    return (
        <View style={styles.row}>
            <Pressable
                onPress={onClose}
                disabled={saving}
                style={({ pressed }) => [
                    styles.btn,
                    styles.cancelBtn,
                    pressed && !saving ? styles.pressed : null,
                    saving ? styles.disabled : null,
                ]}
            >
                <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            <Pressable
                onPress={onSubmit}
                disabled={saving}
                style={({ pressed }) => [
                    styles.btn,
                    styles.submitBtn,
                    pressed && !saving ? styles.pressed : null,
                    saving ? styles.disabled : null,
                ]}
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
        alignItems: "center",
        gap: 12,
        marginTop: 10,
    },

    btn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        minHeight: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    cancelBtn: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    cancelText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },

    submitBtn: {
        backgroundColor: "#38B2AC",
    },

    submitText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFFFFF",
    },

    pressed: {
        opacity: 0.85,
    },

    disabled: {
        opacity: 0.6,
    },
});
