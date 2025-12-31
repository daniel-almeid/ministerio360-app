import { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    Switch,
    StyleSheet,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { Visitor } from "../../types/visitors";
import { upsertVisitor } from "../../services/visitors";
import {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyLoading,
    dismissToast,
} from "../../../../shared/ui/toast";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    visitor?: Visitor | null;
};

function formatBR(date: Date) {
    return date.toLocaleDateString("pt-BR");
}

function formatISO(date: Date) {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function VisitorModal({
    visible,
    onClose,
    onSuccess,
    visitor,
}: Props) {
    const isEditing = !!visitor;

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [form, setForm] = useState<{
        name: string;
        visitDate: Date | null;
        phone: string;
        email: string;
        notes: string;
        is_member: boolean;
    }>({
        name: "",
        visitDate: null,
        phone: "",
        email: "",
        notes: "",
        is_member: false,
    });

    useEffect(() => {
        if (!visitor) {
            setForm({
                name: "",
                visitDate: null,
                phone: "",
                email: "",
                notes: "",
                is_member: false,
            });
            return;
        }

        setForm({
            name: visitor.name || "",
            visitDate: visitor.visit_date
                ? new Date(visitor.visit_date)
                : null,
            phone: visitor.phone ? visitor.phone.replace(/^55/, "") : "",
            email: visitor.email || "",
            notes: visitor.notes || "",
            is_member: !!visitor.is_member,
        });
    }, [visitor, visible]);

    async function handleSubmit() {
        if (!form.name.trim() || !form.visitDate) {
            notifyWarning("Preencha o nome e a data da visita");
            return;
        }

        notifyLoading(
            isEditing ? "Salvando visitante..." : "Registrando visitante..."
        );

        try {
            const rawPhone = form.phone.replace(/\D/g, "");
            const phoneWithCountry = rawPhone
                ? rawPhone.startsWith("55")
                    ? rawPhone
                    : `55${rawPhone}`
                : null;

            const payload: any = {
                name: form.name.trim(),
                visit_date: formatISO(form.visitDate),
                phone: phoneWithCountry,
                email: form.email || null,
                notes: form.notes || null,
                is_member: form.is_member,
            };

            if (!isEditing) {
                payload.followup_status = "pendente";
                payload.archived = false;
            }

            await upsertVisitor(payload, visitor?.id);

            dismissToast();
            notifySuccess(
                isEditing
                    ? "Visitante atualizado com sucesso"
                    : "Visitante registrado com sucesso"
            );

            onSuccess();
            onClose();
        } catch {
            dismissToast();
            notifyError("Erro ao salvar visitante. Tente novamente.");
        }
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>
                        {isEditing ? "Editar Visitante" : "Registrar Visitante"}
                    </Text>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        value={form.name}
                        onChangeText={(v) =>
                            setForm((p) => ({ ...p, name: v }))
                        }
                        style={styles.input}
                    />

                    <Text style={styles.label}>Data da visita</Text>
                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        style={styles.input}
                    >
                        <Text style={{ color: "#111827" }}>
                            {form.visitDate
                                ? formatBR(form.visitDate)
                                : "Selecionar data"}
                        </Text>
                    </Pressable>

                    {showDatePicker && (
                        <DateTimePicker
                            value={form.visitDate ?? new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "calendar"}
                            onChange={(_, date) => {
                                setShowDatePicker(false);
                                if (date) {
                                    setForm((p) => ({
                                        ...p,
                                        visitDate: date,
                                    }));
                                }
                            }}
                        />
                    )}

                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        value={form.phone}
                        onChangeText={(v) =>
                            setForm((p) => ({ ...p, phone: v }))
                        }
                        style={styles.input}
                        placeholder="(DDD) 00000-0000"
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        value={form.email}
                        onChangeText={(v) =>
                            setForm((p) => ({ ...p, email: v }))
                        }
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>
                            É membro de alguma igreja?
                        </Text>
                        <Switch
                            value={form.is_member}
                            onValueChange={(v) =>
                                setForm((p) => ({ ...p, is_member: v }))
                            }
                        />
                    </View>

                    <Text style={styles.label}>Anotações</Text>
                    <TextInput
                        value={form.notes}
                        onChangeText={(v) =>
                            setForm((p) => ({ ...p, notes: v }))
                        }
                        style={[styles.input, { height: 90 }]}
                        multiline
                    />

                    <View style={styles.footer}>
                        <Pressable
                            onPress={onClose}
                            style={styles.cancelBtn}
                        >
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleSubmit}
                            style={styles.saveBtn}
                        >
                            <Text style={styles.saveText}>
                                {isEditing ? "Salvar" : "Registrar"}
                            </Text>
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
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    title: {
        fontSize: 16,
        fontWeight: "800",
        color: "#374151",
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 10,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: "#111827",
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    switchLabel: {
        fontSize: 12,
        color: "#374151",
        fontWeight: "700",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 14,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    cancelText: {
        fontWeight: "800",
        color: "#374151",
    },
    saveBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: "#38B2AC",
    },
    saveText: {
        fontWeight: "900",
        color: "#fff",
    },
});
