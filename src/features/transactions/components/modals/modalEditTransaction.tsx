import { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    ActivityIndicator,
} from "react-native";
import {
    notifySuccess,
    notifyError,
    notifyLoading,
    dismissToast,
} from "@/src/shared/ui/toast";

type Props = {
    visible: boolean;
    transaction: {
        id: string;
        type: "entrada" | "saida";
        category: string;
        person_name?: string | null;
        amount: number;
    };
    onClose: () => void;
    onUpdate: (
        id: string,
        payload: {
            type: "entrada" | "saida";
            category: string;
            person_name?: string | null;
            amount: number;
        }
    ) => Promise<void>;
};

export function ModalEditTransaction({
    visible,
    transaction,
    onClose,
    onUpdate,
}: Props) {
    const [form, setForm] = useState({
        type: transaction.type,
        category: transaction.category,
        person_name: transaction.person_name || "",
        amount: String(transaction.amount),
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm({
            type: transaction.type,
            category: transaction.category,
            person_name: transaction.person_name || "",
            amount: String(transaction.amount),
        });
    }, [
        transaction.id,
        transaction.type,
        transaction.category,
        transaction.person_name,
        transaction.amount,
    ]);

    async function handleSave() {
        const parsedAmount = Number(String(form.amount).replace(",", "."));

        if (!form.category || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            notifyError("Preencha os campos corretamente.");
            return;
        }

        try {
            setLoading(true);
            notifyLoading("Salvando alterações...");

            await onUpdate(transaction.id, {
                type: form.type,
                category: form.category,
                person_name: form.person_name || null,
                amount: parsedAmount,
            });

            dismissToast();
            notifySuccess("Transação atualizada com sucesso");
            onClose();
        } catch {
            dismissToast();
            notifyError("Erro ao atualizar transação");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Editar Transação</Text>

                    <Pressable
                        style={styles.select}
                        onPress={() =>
                            setForm(p => ({
                                ...p,
                                type:
                                    p.type === "entrada"
                                        ? "saida"
                                        : "entrada",
                            }))
                        }
                        disabled={loading}
                    >
                        <Text style={styles.selectText}>
                            {form.type === "entrada" ? "Entrada" : "Saída"}
                        </Text>
                    </Pressable>

                    <TextInput
                        placeholder="Categoria"
                        value={form.category}
                        onChangeText={v =>
                            setForm(p => ({ ...p, category: v }))
                        }
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Pessoa / Motivo"
                        value={form.person_name}
                        onChangeText={v =>
                            setForm(p => ({ ...p, person_name: v }))
                        }
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Valor"
                        keyboardType="numeric"
                        value={form.amount}
                        onChangeText={v =>
                            setForm(p => ({ ...p, amount: v }))
                        }
                        style={styles.input}
                    />

                    <View style={styles.actions}>
                        <Pressable
                            onPress={onClose}
                            style={styles.cancel}
                            disabled={loading}
                        >
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleSave}
                            style={styles.save}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveText}>Salvar</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    select: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    selectText: {
        color: "#374151",
    },
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 10,
    },
    cancel: {
        padding: 12,
    },
    cancelText: {
        color: "#374151",
    },
    save: {
        backgroundColor: "#38B2AC",
        padding: 12,
        borderRadius: 8,
    },
    saveText: {
        color: "#fff",
        fontWeight: "600",
    },
});
