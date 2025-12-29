import { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
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

export default function DeleteMemberModal({
    visible,
    member,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        setLoading(true);

        const { error } = await supabase
            .from("members")
            .delete()
            .eq("id", member.id);

        setLoading(false);

        if (error) {
            notifyError("Erro ao excluir membro");
            return;
        }

        notifySuccess("Membro excluído com sucesso");
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

                    <View style={styles.icon}>
                        <Feather name="trash-2" size={26} color="#DC2626" />
                    </View>

                    <Text style={styles.title}>Excluir Membro</Text>
                    <Text style={styles.text}>
                        Tem certeza que deseja excluir{" "}
                        <Text style={{ fontWeight: "600" }}>{member.name}</Text>?
                        Essa ação não poderá ser desfeita.
                    </Text>

                    <View style={styles.actions}>
                        <Pressable style={styles.cancel} onPress={onClose}>
                            <Text>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.delete, loading && { opacity: 0.6 }]}
                            disabled={loading}
                            onPress={handleDelete}
                        >
                            <Text style={{ color: "#fff" }}>
                                {loading ? "Excluindo..." : "Excluir"}
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
    icon: {
        backgroundColor: "#FEE2E2",
        alignSelf: "center",
        padding: 12,
        borderRadius: 999,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
    },
    text: {
        textAlign: "center",
        color: "#4B5563",
        marginBottom: 20,
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
    delete: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#DC2626",
    },
});
