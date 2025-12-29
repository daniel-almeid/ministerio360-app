import { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Switch,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../../../lib/supabase";
import { notifySuccess, notifyError } from "../../../../shared/ui/toast";
import type { Member } from "../../hooks/useMembersData";

type Props = {
    visible: boolean;
    member: Member;
    onClose: () => void;
    onSuccess: () => void;
};

export default function EditMemberModal({
    visible,
    member,
    onClose,
    onSuccess,
}: Props) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        ministry_id: "",
        is_active: true,
        birth_date: "",
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (member) {
            setForm({
                name: member.name ?? "",
                email: member.email ?? "",
                phone: member.phone ?? "",
                ministry_id: member.ministry_id ?? "",
                is_active: member.is_active,
                birth_date: member.birth_date ?? "",
            });
        }
    }, [member]);

    async function handleSave() {
        setSaving(true);

        const { error } = await supabase
            .from("members")
            .update({
                name: form.name,
                email: form.email,
                phone: form.phone,
                ministry_id: form.ministry_id || null,
                is_active: form.is_active,
                birth_date: form.birth_date || null,
            })
            .eq("id", member.id);

        setSaving(false);

        if (error) {
            notifyError("Erro ao atualizar membro");
            return;
        }

        notifySuccess("Membro atualizado com sucesso");
        onSuccess();
        onClose();
    }

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Pressable style={styles.close} onPress={onClose}>
                        <Feather name="x" size={20} />
                    </Pressable>

                    <Text style={styles.title}>Editar Membro</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={form.name}
                        onChangeText={(v) => setForm({ ...form, name: v })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        value={form.email}
                        onChangeText={(v) => setForm({ ...form, email: v })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Telefone"
                        value={form.phone}
                        onChangeText={(v) => setForm({ ...form, phone: v })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Data de nascimento (YYYY-MM-DD)"
                        value={form.birth_date}
                        onChangeText={(v) =>
                            setForm({ ...form, birth_date: v })
                        }
                    />

                    <View style={styles.switchRow}>
                        <Text>Ativo</Text>
                        <Switch
                            value={form.is_active}
                            onValueChange={(v) =>
                                setForm({ ...form, is_active: v })
                            }
                        />
                    </View>

                    <View style={styles.actions}>
                        <Pressable style={styles.cancel} onPress={onClose}>
                            <Text>Cancelar</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.save, saving && { opacity: 0.6 }]}
                            disabled={saving}
                            onPress={handleSave}
                        >
                            <Text style={{ color: "#fff" }}>
                                {saving ? "Salvando..." : "Salvar"}
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
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 20,
        width: "90%",
    },
    close: {
        position: "absolute",
        top: 12,
        right: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 12,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
    },
    cancel: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },
    save: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#38B2AC",
    },
});
