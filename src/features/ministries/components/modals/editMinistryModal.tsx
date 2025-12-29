import { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { notifySuccess, notifyError, notifyLoading, dismissToast } from "../../../../shared/ui/toast";

type Props = {
    visible: boolean;
    ministry: any | null;
    onClose: () => void;
    onSave: (payload: {
        id: string;
        name: string;
        description: string;
    }) => Promise<boolean>;
};

export function EditMinistryModal({
    visible,
    ministry,
    onClose,
    onSave,
}: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!ministry) return;
        setName(ministry.name || "");
        setDescription(ministry.description || "");
    }, [ministry]);

    async function handleSave() {
        if (!ministry?.id || saving) return;

        if (!name.trim()) {
            notifyError("O nome do ministério é obrigatório.");
            return;
        }

        setSaving(true);
        notifyLoading("Salvando alterações...");

        try {
            const success = await onSave({
                id: ministry.id,
                name,
                description,
            });

            dismissToast();

            if (success) {
                notifySuccess("Ministério atualizado com sucesso!");
                onClose();
            } else {
                notifyError("Não foi possível atualizar o ministério.");
            }
        } catch {
            dismissToast();
            notifyError("Erro inesperado ao atualizar ministério.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <Pressable onPress={onClose} style={styles.closeBtn}>
                        <Feather name="x" size={18} color="#6B7280" />
                    </Pressable>

                    <Text style={styles.title}>Editar Ministério</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput value={name} onChangeText={setName} style={styles.input} />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.input, styles.textarea]}
                            multiline
                        />
                    </View>

                    <View style={styles.actions}>
                        <Pressable onPress={onClose} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleSave}
                            disabled={saving}
                            style={[
                                styles.saveBtn,
                                saving && styles.saveBtnDisabled,
                            ]}
                        >
                            {saving ? (
                                <ActivityIndicator />
                            ) : (
                                <Text style={styles.saveText}>Salvar alterações</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 16,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
    },
    closeBtn: {
        position: "absolute",
        top: 12,
        right: 12,
        padding: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 12,
    },
    field: {
        marginBottom: 12,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#4B5563",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#111827",
    },
    textarea: {
        minHeight: 90,
        textAlignVertical: "top",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 8,
    },
    cancelBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
    },
    cancelText: {
        color: "#4B5563",
        fontWeight: "600",
    },
    saveBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#059669",
        borderRadius: 12,
        minWidth: 140,
        alignItems: "center",
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});
