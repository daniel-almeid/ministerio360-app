import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useScales } from "./hooks/useScales";
import Loading from "../../shared/ui/loading";
import ScaleTableMobile from "./components/table/scaleTable";
import ConfirmDeleteModal from "./components/modal/confirmDeleteModal";
import ScaleDetailsModal from "./components/modal/scaleDetails";

export default function ScaleSection() {
    const {
        grouped,
        loading,

        openNew,
        openEdit,
        openDelete,

        openDetails,
        showDetails,
        detailsScaleId,
        closeDetails,

        showDelete,
        deleting,
        confirmDelete,
        closeAll,
    } = useScales();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Escalas</Text>
                    <Text style={styles.subtitle}>
                        Organização por data e ministério
                    </Text>
                </View>

                <Pressable style={styles.newBtn} onPress={openNew}>
                    <Feather name="plus" size={16} color="#fff" />
                    <Text style={styles.newText}>Nova escala</Text>
                </Pressable>
            </View>

            <View style={styles.card}>
                {loading ? (
                    <Loading visible />
                ) : (
                    <ScaleTableMobile
                        grouped={grouped}
                        onView={openDetails}
                        onEdit={openEdit}
                        onDelete={openDelete}
                    />
                )}
            </View>

            <ScaleDetailsModal
                visible={showDetails}
                scaleId={detailsScaleId}
                onClose={closeDetails}
            />

            <ConfirmDeleteModal
                open={showDelete}
                loading={deleting}
                onClose={closeAll}
                onConfirm={confirmDelete}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    title: { fontSize: 20, fontWeight: "700" },
    subtitle: { fontSize: 13, color: "#6B7280" },
    newBtn: {
        flexDirection: "row",
        gap: 8,
        backgroundColor: "#38B2AC",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },
    newText: { color: "#fff", fontWeight: "700" },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
});
