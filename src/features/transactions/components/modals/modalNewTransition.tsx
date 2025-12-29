import { useState } from "react";
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
    onClose: () => void;
    onCreate: (payload: {
        type: "entrada" | "saida";
        category: string;
        amount: number;
        person_name?: string | null;
    }) => Promise<void>;
};

const categoriasPadrao = [
    "Dízimo",
    "Oferta",
    "Compras",
    "Contas",
    "Eventos",
    "Doações",
    "Missões",
    "Outro...",
];

export function ModalNewTransaction({
    visible,
    onClose,
    onCreate,
}: Props) {
    const [type, setType] = useState<"Entrada" | "Saída">("Entrada");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [personName, setPersonName] = useState("");
    const [loading, setLoading] = useState(false);

    const [typeOpen, setTypeOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

    async function handleSave() {
        const finalCategory =
            category === "Outro..." ? customCategory : category;

        if (!finalCategory || !amount) {
            notifyError("Preencha todos os campos obrigatórios.");
            return;
        }

        const parsedAmount = Number(String(amount).replace(",", "."));
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            notifyError("Informe um valor válido.");
            return;
        }

        try {
            setLoading(true);
            notifyLoading("Salvando transação...");

            await onCreate({
                type: type === "Entrada" ? "entrada" : "saida",
                category: finalCategory,
                amount: parsedAmount,
                person_name: personName || null,
            });

            dismissToast();
            notifySuccess("Transação criada com sucesso");
            onClose();
        } catch {
            dismissToast();
            notifyError("Erro ao salvar transação.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Nova Transação</Text>

                    <Pressable
                        style={styles.select}
                        onPress={() => setTypeOpen(true)}
                    >
                        <Text style={styles.selectText}>{type}</Text>
                    </Pressable>

                    <Pressable
                        style={styles.select}
                        onPress={() => setCategoryOpen(true)}
                    >
                        <Text style={styles.selectText}>
                            {category || "Selecione a categoria"}
                        </Text>
                    </Pressable>

                    {category === "Outro..." && (
                        <TextInput
                            placeholder="Digite a categoria"
                            value={customCategory}
                            onChangeText={setCustomCategory}
                            style={styles.input}
                        />
                    )}

                    <TextInput
                        placeholder="Pessoa / Motivo"
                        value={personName}
                        onChangeText={setPersonName}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Valor"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
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

                <Modal transparent visible={typeOpen} animationType="fade">
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setTypeOpen(false)}
                    >
                        <View style={styles.optionModal}>
                            {["Entrada", "Saída"].map(item => (
                                <Pressable
                                    key={item}
                                    style={styles.option}
                                    onPress={() => {
                                        setType(item as any);
                                        setTypeOpen(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>
                                        {item}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Pressable>
                </Modal>

                <Modal transparent visible={categoryOpen} animationType="fade">
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setCategoryOpen(false)}
                    >
                        <View style={styles.optionModal}>
                            {categoriasPadrao.map(item => (
                                <Pressable
                                    key={item}
                                    style={styles.option}
                                    onPress={() => {
                                        setCategory(item);
                                        setCategoryOpen(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>
                                        {item}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Pressable>
                </Modal>
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
        color: "#1f2937",
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
        backgroundColor: "#f9fafb",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 16,
    },
    cancel: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    cancelText: {
        color: "#374151",
    },
    save: {
        backgroundColor: "#38B2AC",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    saveText: {
        color: "#fff",
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    optionModal: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: 240,
        paddingVertical: 8,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionText: {
        fontSize: 14,
        color: "#374151",
    },
});
