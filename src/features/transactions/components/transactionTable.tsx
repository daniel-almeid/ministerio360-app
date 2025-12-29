import { useMemo, useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Modal,
    StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Loading from "@/src/shared/ui/loading";
import { PaginationControls } from "@/src/shared/components/paginationControls";
import { TransactionCard } from "./transactionCard";

type Props = {
    transactions: any[];
    paginatedData: any[];
    loading: boolean;
    pageChanging: boolean;
    filter: "todas" | "entrada" | "saida";
    setFilter: (v: "todas" | "entrada" | "saida") => void;
    selectedMonth: string;
    setSelectedMonth: (v: string) => void;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    handleNext: () => void;
    handlePrevious: () => void;
    onNewClick: () => void;
    onEdit: (t: any) => void;
    onDelete: (t: any) => void;
};

function formatMonthLabel(value: string) {
    const [y, m] = value.split("-");
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date
        .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
        .replace(/^./, c => c.toUpperCase());
}

const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
];

export default function TransactionTable(props: Props) {
    const {
        transactions,
        paginatedData,
        loading,
        pageChanging,
        filter,
        setFilter,
        selectedMonth,
        setSelectedMonth,
        currentPage,
        totalPages,
        itemsPerPage,
        handleNext,
        handlePrevious,
        onNewClick,
        onEdit,
        onDelete,
    } = props;

    const [filterOpen, setFilterOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);
    const [year, setYear] = useState(
        Number(selectedMonth.split("-")[0])
    );

    const label = useMemo(
        () => formatMonthLabel(selectedMonth),
        [selectedMonth]
    );

    function selectMonth(index: number) {
        setSelectedMonth(
            `${year}-${String(index + 1).padStart(2, "0")}`
        );
        setMonthOpen(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.filters}>
                    <Pressable
                        style={styles.filterButton}
                        onPress={() => setMonthOpen(true)}
                    >
                        <Feather name="calendar" size={16} color="#38B2AC" />
                        <Text style={styles.filterText}>{label}</Text>
                    </Pressable>

                    <Pressable
                        style={styles.filterButton}
                        onPress={() => setFilterOpen(true)}
                    >
                        <Feather name="filter" size={16} color="#38B2AC" />
                        <Text style={styles.filterText}>
                            {filter === "todas"
                                ? "Todas"
                                : filter === "entrada"
                                ? "Entradas"
                                : "Saídas"}
                        </Text>
                    </Pressable>
                </View>

                <Pressable
                    style={styles.newButton}
                    onPress={onNewClick}
                >
                    <Feather
                        name="plus-circle"
                        size={18}
                        color="#fff"
                    />
                    <Text style={styles.newText}>
                        Nova Transação
                    </Text>
                </Pressable>
            </View>

            <View style={styles.list}>
                {pageChanging && (
                    <View style={styles.overlay}>
                        <Loading visible />
                    </View>
                )}

                <ScrollView
                    contentContainerStyle={styles.scroll}
                >
                    {paginatedData.length > 0 ? (
                        paginatedData.map(t => (
                            <TransactionCard
                                key={t.id}
                                transaction={t}
                                onEdit={() => onEdit(t)}
                                onDelete={() => onDelete(t)}
                            />
                        ))
                    ) : (
                        <Text style={styles.empty}>
                            Nenhuma transação encontrada.
                        </Text>
                    )}
                </ScrollView>
            </View>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={transactions.length}
                itemsPerPage={itemsPerPage}
                onNext={handleNext}
                onPrev={handlePrevious}
            />

            <Loading visible={loading} />

            <Modal transparent visible={filterOpen} animationType="fade">
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setFilterOpen(false)}
                >
                    <View style={styles.modal}>
                        {["todas", "entrada", "saida"].map(v => (
                            <Pressable
                                key={v}
                                style={styles.modalItem}
                                onPress={() => {
                                    setFilter(v as any);
                                    setFilterOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.modalText,
                                        filter === v && styles.active,
                                    ]}
                                >
                                    {v === "todas"
                                        ? "Todas"
                                        : v === "entrada"
                                        ? "Entradas"
                                        : "Saídas"}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>

            <Modal transparent visible={monthOpen} animationType="fade">
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setMonthOpen(false)}
                >
                    <View style={styles.monthPicker}>
                        <View style={styles.yearRow}>
                            <Pressable onPress={() => setYear(y => y - 1)}>
                                <Feather name="chevron-left" size={20} />
                            </Pressable>

                            <Text style={styles.year}>{year}</Text>

                            <Pressable onPress={() => setYear(y => y + 1)}>
                                <Feather name="chevron-right" size={20} />
                            </Pressable>
                        </View>

                        <View style={styles.monthGrid}>
                            {months.map((m, i) => (
                                <Pressable
                                    key={m}
                                    style={styles.monthButton}
                                    onPress={() => selectMonth(i)}
                                >
                                    <Text style={styles.monthText}>{m}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    top: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    filters: {
        flexDirection: "row",
        gap: 1,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 8,
        borderRadius: 10,
    },
    filterText: {
        fontWeight: "600",
    },
    newButton: {
        flexDirection: "row",
        gap: 1,
        backgroundColor: "#38B2AC",
        padding: 8,
        borderRadius: 10,
    },
    newText: {
        color: "#fff",
        fontWeight: "700",
    },
    list: {
        flex: 1,
    },
    scroll: {
        paddingBottom: 120,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.6)",
        zIndex: 10,
    },
    empty: {
        textAlign: "center",
        marginTop: 24,
        color: "#6b7280",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: 240,
    },
    modalItem: {
        padding: 14,
    },
    modalText: {
        color: "#374151",
    },
    active: {
        color: "#38B2AC",
        fontWeight: "700",
    },
    monthPicker: {
        backgroundColor: "#fff",
        borderRadius: 14,
        width: 300,
        padding: 14,
    },
    yearRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    year: {
        fontSize: 16,
        fontWeight: "700",
    },
    monthGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 12,
    },
    monthButton: {
        width: "33.33%",
        paddingVertical: 12,
        alignItems: "center",
    },
    monthText: {
        fontWeight: "600",
    },
});
