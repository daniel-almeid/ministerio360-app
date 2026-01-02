import { View, Pressable, Text, StyleSheet } from "react-native";
import { notifyLoading, dismissToast } from "../../../../../shared/ui/toast";

type Props = {
  saving: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
};

export default function SubmitActions({
  saving,
  onClose,
  onSubmit,
}: Props) {
  async function handleSubmit() {
    notifyLoading("Salvando evento...");
    await onSubmit();
    dismissToast();
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={onClose} disabled={saving}>
        <Text>Cancelar</Text>
      </Pressable>

      <Pressable
        style={[styles.saveButton, saving && styles.disabled]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving ? "Salvando..." : "Salvar"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: "#38B2AC",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  saveText: {
    color: "#fff",
    fontWeight: "500",
  },
});
