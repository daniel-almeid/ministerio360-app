import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, Switch, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import type { AdminUser } from "../types/admin";

type Props = {
    visible: boolean;
    user: AdminUser | null;
    saving: boolean;
    onClose: () => void;
    onSave: (values: { plan_slug: string; subscription_active: boolean }) => void;
};

export function EditPlanModal({ visible, user, saving, onClose, onSave }: Props) {
    const [plan, setPlan] = useState("free");
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (!user) return;
        setPlan(user.plan_slug ?? "free");
        setActive(!!user.subscription_active);
    }, [user]);

    if (!user) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <Pressable onPress={onClose} style={styles.closeBtn}>
                        <Feather name="x" size={18} color="#6B7280" />
                    </Pressable>

                    <Text style={styles.title}>Editar plano — {user.church_name ?? user.email}</Text>

                    <Text style={styles.label}>Plano</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={plan} onValueChange={setPlan}>
                            <Picker.Item label="Grátis" value="free" />
                            <Picker.Item label="Padrão" value="standard" />
                            <Picker.Item label="Premium" value="premium" />
                        </Picker>
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.label}>Assinatura ativa</Text>
                        <Switch value={active} onValueChange={setActive} trackColor={{ true: "#38B2AC" }} />
                    </View>

                    <View style={styles.actions}>
                        <Pressable onPress={onClose} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => onSave({ plan_slug: plan, subscription_active: active })}
                            disabled={saving}
                            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                        >
                            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Salvar</Text>}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 16 },
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 16 },
    closeBtn: { position: "absolute", top: 12, right: 12, padding: 6 },
    title: { fontSize: 16, fontWeight: "700", color: "#374151", marginBottom: 16, paddingRight: 24 },
    label: { fontSize: 13, fontWeight: "600", color: "#4B5563", marginBottom: 6 },
    pickerWrapper: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8, overflow: "hidden", marginBottom: 16 },
    switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
    actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
    cancelBtn: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "#F3F4F6", borderRadius: 12 },
    cancelText: { color: "#4B5563", fontWeight: "600" },
    saveBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#38B2AC", borderRadius: 12, minWidth: 90, alignItems: "center" },
    saveBtnDisabled: { opacity: 0.6 },
    saveText: { color: "#fff", fontWeight: "700" },
});