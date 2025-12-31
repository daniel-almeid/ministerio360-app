import { View, Pressable, Text, StyleSheet } from "react-native";

type Props = {
    saving: boolean;
    onClose: () => void;
};

export default function SubmitActions({ saving, onClose }: Props) {
    return (
        <View style={styles.container}>
            <Pressable onPress={onClose}>
                <Text>Cancelar</Text>
            </Pressable>

            <Pressable style={styles.saveButton} onPress={() => { }}>
                <Text style={styles.saveText}>
                    {saving ? "Salvando..." : "Salvar"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 16,
    },
    saveButton: {
        backgroundColor: "#38B2AC",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    saveText: {
        color: "#fff",
    },
});
