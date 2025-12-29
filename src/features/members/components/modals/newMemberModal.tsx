import { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Switch,
    Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMemberForm } from "./memberModal/useMemberForm";
import { MinistrySelect } from "./memberModal/ministrySelect";
import { notifySuccess, notifyError } from "../../../../shared/ui/toast";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

function formatDateBR(date: string) {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
}

export default function NewMemberModal({
    visible,
    onClose,
    onSuccess,
}: Props) {
    function handleSuccess() {
        notifySuccess("Membro cadastrado com sucesso");
        onSuccess();
        onClose();
    }

    const { form, setForm, ministries, saving, handleSubmit } =
        useMemberForm(null, handleSuccess, onClose);

    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Pressable style={styles.close} onPress={onClose}>
                        <Feather name="x" size={20} />
                    </Pressable>

                    <Text style={styles.title}>Novo Membro</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={form.name}
                        onChangeText={(v) => setForm({ ...form, name: v })}
                    />

                    <MinistrySelect
                        value={form.ministry_id}
                        options={ministries}
                        placeholder="Ministério"
                        onChange={(v) =>
                            setForm({ ...form, ministry_id: v })
                        }
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={(v) =>
                            setForm({ ...form, email: v })
                        }
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Telefone"
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(v) =>
                            setForm({ ...form, phone: v })
                        }
                    />

                    <Pressable
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text
                            style={{
                                color: form.birth_date
                                    ? "#374151"
                                    : "#9CA3AF",
                            }}
                        >
                            {form.birth_date
                                ? formatDateBR(form.birth_date)
                                : "Data de nascimento"}
                        </Text>
                    </Pressable>

                    {showDatePicker && (
                        <DateTimePicker
                            value={
                                form.birth_date
                                    ? new Date(form.birth_date)
                                    : new Date()
                            }
                            mode="date"
                            display={
                                Platform.OS === "ios"
                                    ? "spinner"
                                    : "calendar"
                            }
                            onChange={(_, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    const iso = selectedDate
                                        .toISOString()
                                        .split("T")[0];
                                    setForm({
                                        ...form,
                                        birth_date: iso,
                                    });
                                }
                            }}
                        />
                    )}

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
                        <Pressable
                            style={styles.cancel}
                            onPress={onClose}
                        >
                            <Text>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.save,
                                saving && { opacity: 0.6 },
                            ]}
                            disabled={saving}
                            onPress={handleSubmit}
                        >
                            <Text style={{ color: "#fff" }}>
                                {saving ? "Salvando..." : "Cadastrar"}
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
        padding: 12,
        marginBottom: 12,
        justifyContent: "center",
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
