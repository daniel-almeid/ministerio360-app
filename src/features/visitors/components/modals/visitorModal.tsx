import { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    Switch,
    StyleSheet,
} from "react-native";
import type { Visitor } from "../../types/visitors";
import { upsertVisitor } from "../../services/visitors";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    visitor?: Visitor | null;
};

export default function VisitorModal({ visible, onClose, onSuccess, visitor }: Props) {
    const isEditing = !!visitor;

    const [form, setForm] = useState({
        name: "",
        visit_date: "",
        phone: "",
        email: "",
        notes: "",
        is_member: false,
    });

    useEffect(() => {
        if (!visitor) {
            setForm({
                name: "",
                visit_date: "",
                phone: "",
                email: "",
                notes: "",
                is_member: false,
            });
            return;
        }

        setForm({
            name: visitor.name || "",
            visit_date: visitor.visit_date ? visitor.visit_date.slice(0, 10) : "",
            phone: visitor.phone ? visitor.phone.replace(/^55/, "") : "",
            email: visitor.email || "",
            notes: visitor.notes || "",
            is_member: !!visitor.is_member,
        });
    }, [visitor, visible]);

    async function handleSubmit() {
        if (!form.name.trim() || !form.visit_date) return;

        const rawPhone = form.phone.replace(/\D/g, "");
        const phoneWithCountry = rawPhone
            ? rawPhone.startsWith("55")
                ? rawPhone
                : `55${rawPhone}`
            : null;

        const payload: any = {
            name: form.name.trim(),
            visit_date: form.visit_date,
            phone: phoneWithCountry,
            email: form.email ? form.email : null,
            notes: form.notes ? form.notes : null,
            is_member: form.is_member,
        };

        if (!isEditing) {
            payload.followup_status = "pendente";
            payload.archived = false;
        }

        await upsertVisitor(payload, visitor?.id);

        onSuccess();
        onClose();
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>{isEditing ? "Editar Visitante" : "Registrar Visitante"}</Text>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        value={form.name}
                        onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
                        style={styles.input}
                    />

                    <Text style={styles.label}>Data da visita (YYYY-MM-DD)</Text>
                    <TextInput
                        value={form.visit_date}
                        onChangeText={(v) => setForm((p) => ({ ...p, visit_date: v }))}
                        style={styles.input}
                        placeholder="2025-12-31"
                    />

                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        value={form.phone}
                        onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
                        style={styles.input}
                        placeholder="(DDD) 00000-0000"
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        value={form.email}
                        onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>É membro de alguma igreja?</Text>
                        <Switch
                            value={form.is_member}
                            onValueChange={(v) => setForm((p) => ({ ...p, is_member: v }))}
                        />
                    </View>

                    <Text style={styles.label}>Anotações</Text>
                    <TextInput
                        value={form.notes}
                        onChangeText={(v) => setForm((p) => ({ ...p, notes: v }))}
                        style={[styles.input, { height: 90 }]}
                        multiline
                    />

                    <View style={styles.footer}>
                        <Pressable onPress={onClose} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable onPress={handleSubmit} style={styles.saveBtn}>
                            <Text style={styles.saveText}>{isEditing ? "Salvar" : "Registrar"}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 16 },
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 16 },
    title: { fontSize: 16, fontWeight: "800", color: "#374151", marginBottom: 10 },
    label: { fontSize: 12, color: "#6B7280", marginTop: 10, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: "#111827",
    },
    switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
    switchLabel: { fontSize: 12, color: "#374151", fontWeight: "700" },
    footer: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 14 },
    cancelBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" },
    cancelText: { fontWeight: "800", color: "#374151" },
    saveBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#38B2AC" },
    saveText: { fontWeight: "900", color: "#fff" },
});
