import { View, Text, StyleSheet, Pressable } from "react-native";
import { useScales } from "./hooks/useScales";
import Loading from "../../shared/ui/loading";
import ScaleTableMobile from "./components/table/scaleTable";
import ConfirmDeleteModal from "./components/modal/confirmDeleteModal";
import ScaleDetailsModal from "./components/modal/scaleDetails";
import ModalNewScale from "./components/modal/modalNewScale";
import { MinistryLite } from "./types/scales";

type Props = {
    ministries: MinistryLite[];
};

export default function ScaleSection({ ministries }: Props) {
    const {
        grouped,
        loading,

        showNew,
        selected,

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
        load,
    } = useScales();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.title}>Escalas</Text>
                    <Text style={styles.subtitle}>
                        Organização por data e ministério
                    </Text>
                </View>

                <Pressable style={styles.newBtn} onPress={openNew}>
                    <Text style={styles.newText}>Nova escala</Text>
                </Pressable>
            </View>

            {/* Card */}
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

            {/* Modais */}
            <ModalNewScale
                visible={showNew}
                onClose={closeAll}
                onSuccess={load}
                ministries={ministries}
                scaleData={selected}
            />

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
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    headerText: {
        gap: 2,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },

    subtitle: {
        fontSize: 13,
        color: "#6B7280",
    },

    newBtn: {
        backgroundColor: "#38B2AC",
        paddingHorizontal: 18,
        paddingVertical: 11,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    newText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 13,
    },

    card: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
});
