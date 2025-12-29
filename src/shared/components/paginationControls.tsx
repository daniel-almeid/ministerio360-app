import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onNext: () => void;
  onPrev: () => void;
};

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onNext,
  onPrev,
}: Props) {
  const insets = useSafeAreaInsets();

  if (totalPages <= 1) return null;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom  },
      ]}
    >
      <Text style={styles.text}>
        Exibindo {(currentPage - 1) * itemsPerPage + 1} –{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={onPrev}
          disabled={currentPage === 1}
          style={[
            styles.button,
            currentPage === 1 && styles.disabled,
          ]}
        >
          <Feather name="chevron-left" size={20} />
        </Pressable>

        <Pressable
          onPress={onNext}
          disabled={currentPage === totalPages}
          style={[
            styles.button,
            currentPage === totalPages && styles.disabled,
          ]}
        >
          <Feather name="chevron-right" size={20} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
  },

  text: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  disabled: {
    opacity: 0.4,
  },
});
