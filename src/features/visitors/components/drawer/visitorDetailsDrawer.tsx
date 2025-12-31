import { useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
} from "react-native";
import type { Visitor } from "../../types/visitors";
import { setVisitorArchived } from "../../services/visitors";
import Loading from "../../../../shared/ui/loading";
import {
    notifyLoading,
    notifySuccess,
    notifyError,
    dismissToast,
} from "../../../../shared/ui/toast";

type Props = {
    visible: boolean;
    visitor: Visitor | null;
    processingId: string | null;

    onClose: () => void;
    onUpdated: () => void;

    onStartFollowup: (v: Visitor) => void;
    onFinishFollowup: (v: Visitor) => void;
    onEdit: (v: Visitor) => void;
};

export default function VisitorDetailsDrawer({
    visible,
    visitor,
    processingId,
    onClose,
    onUpdated,
    onStartFollowup,
    onFinishFollowup,
    onEdit,
}: Props) {
    const translateX = useRef(new Animated.Value(420)).current;
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (visible) {
            setBusy(true);
            Animated.timing(translateX, {
                toValue: 0,
                duration: 260,
                useNativeDriver: true,
            }).start(() => setBusy(false));
        } else {
            translateX.setValue(420);
        }
    }, [visible]);

    function close() {
        Animated.timing(translateX, {
            toValue: 420,
            duration: 220,
            useNativeDriver: true,
        }).start(onClose);
    }

    async function confirmArchive() {
        if (!visitor || busy) return;

        setBusy(true);
        notifyLoading("Arquivando visitante...");

        try {
            await setVisitorArchived(visitor.id, true);

            dismissToast();
            notifySuccess("Visitante arquivado com sucesso");

            onUpdated();
            close();
        } catch {
            dismissToast();
            notifyError("Erro ao arquivar visitante");
        } finally {
            setBusy(false);
        }
    }

    if (!visitor) return null;

    const canStart = visitor.followup_status === "pendente";
    const canFinish = visitor.followup_status === "em_andamento";
    const isProcessing = processingId === visitor.id;

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={close} />

                <Animated.View
                    style={[
                        styles.drawer,
                        { transform: [{ translateX }] },
                    ]}
                >
                    <Loading visible={busy} />

                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Detalhes do Visitante
                        </Text>
                        <Pressable onPress={close}>
                            <Text style={styles.close}>✕</Text>
                        </Pressable>
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.label}>Nome</Text>
                        <Text style={styles.value}>{visitor.name}</Text>

                        <Text style={styles.label}>Data da visita</Text>
                        <Text style={styles.value}>
                            {visitor.visit_date
                                ? new Date(
                                      visitor.visit_date
                                  ).toLocaleDateString("pt-BR")
                                : "—"}
                        </Text>

                        <Text style={styles.label}>Status Follow-up</Text>
                        <Text style={styles.value}>
                            {visitor.followup_status}
                        </Text>

                        <Text style={styles.label}>Telefone</Text>
                        <Text style={styles.value}>
                            {visitor.phone ?? "—"}
                        </Text>

                        <Text style={styles.label}>E-mail</Text>
                        <Text style={styles.value}>
                            {visitor.email ?? "—"}
                        </Text>

                        <Text style={styles.label}>É membro?</Text>
                        <Text style={styles.value}>
                            {visitor.is_member ? "Sim" : "Não"}
                        </Text>

                        {!!visitor.notes && (
                            <>
                                <Text style={styles.label}>Observações</Text>
                                <Text style={styles.value}>
                                    {visitor.notes}
                                </Text>
                            </>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <Pressable
                            onPress={close}
                            style={styles.btnGhost}
                        >
                            <Text style={styles.btnGhostText}>
                                Fechar
                            </Text>
                        </Pressable>

                        <View style={{ flexDirection: "row", gap: 8 }}>
                            <Pressable
                                onPress={() => onEdit(visitor)}
                                style={styles.btnOutline}
                            >
                                <Text style={styles.btnOutlineText}>
                                    Editar
                                </Text>
                            </Pressable>

                            {canStart && (
                                <Pressable
                                    onPress={() =>
                                        onStartFollowup(visitor)
                                    }
                                    style={[
                                        styles.btnGreen,
                                        isProcessing &&
                                            styles.disabled,
                                    ]}
                                >
                                    <Text style={styles.btnWhite}>
                                        Iniciar
                                    </Text>
                                </Pressable>
                            )}

                            {canFinish && (
                                <Pressable
                                    onPress={() =>
                                        onFinishFollowup(visitor)
                                    }
                                    style={[
                                        styles.btnBlue,
                                        isProcessing &&
                                            styles.disabled,
                                    ]}
                                >
                                    <Text style={styles.btnWhite}>
                                        Finalizar
                                    </Text>
                                </Pressable>
                            )}

                            {!visitor.archived && (
                                <Pressable
                                    onPress={confirmArchive}
                                    style={[
                                        styles.btnRed,
                                        busy && styles.disabled,
                                    ]}
                                >
                                    <Text style={styles.btnWhite}>
                                        Arquivar
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    backdrop: { flex: 1 },
    drawer: {
        width: 340,
        backgroundColor: "#fff",
        height: "100%",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    header: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: { fontWeight: "900", color: "#374151" },
    close: { fontSize: 18, color: "#6B7280" },
    body: { padding: 14 },
    label: { marginTop: 8, fontSize: 12, color: "#6B7280" },
    value: { fontSize: 13, color: "#111827", fontWeight: "700" },
    footer: {
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    btnGhost: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    btnGhostText: { fontWeight: "900", color: "#374151" },

    btnOutline: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#38B2AC",
    },
    btnOutlineText: { fontWeight: "900", color: "#0F766E" },

    btnGreen: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#10B981",
    },
    btnBlue: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#2563EB",
    },
    btnRed: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#DC2626",
    },
    btnWhite: { fontWeight: "900", color: "#fff" },
    disabled: { opacity: 0.5 },
});
