import {
    View,
    TextInput,
    Pressable,
    Text,
    StyleSheet,
    FlatList,
} from "react-native";
import type { Visitor } from "../../types/visitors";
import { StatusPills } from "./statusPills";
import { VisitorCard } from "./visitorCard";
import Loading from "../../../../shared/ui/loading";
import { PaginationControls } from "../../../../shared/components/paginationControls";

type Props = {
    visitors: Visitor[];
    isLoading: boolean;
    searchValue: string;
    onSearchChange: (v: string) => void;
    showArchived: boolean;
    onToggleArchived: () => void;
    statusFilter: string;
    onStatusChange: (v: string) => void;
    processingId: string | null;
    onSelect: (v: Visitor) => void;
    onFollowup: (v: Visitor) => void;
    onFinish: (v: Visitor) => void;
    onNewClick: () => void;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onNext: () => void;
    onPrev: () => void;
};

export default function VisitorTable({
    visitors,
    isLoading,
    searchValue,
    onSearchChange,
    showArchived,
    onToggleArchived,
    statusFilter,
    onStatusChange,
    processingId,
    onSelect,
    onFollowup,
    onFinish,
    onNewClick,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onNext,
    onPrev,
}: Props) {
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.topRow}>
                <TextInput
                    placeholder="Pesquisar visitante..."
                    value={searchValue}
                    onChangeText={onSearchChange}
                    style={styles.search}
                />

                <View style={styles.actions}>
                    <Pressable onPress={onToggleArchived} style={styles.archiveBtn}>
                        <Text style={styles.archiveText}>
                            {showArchived ? "Ativos" : "Arquivados"}
                        </Text>
                    </Pressable>

                    {!showArchived && (
                        <Pressable onPress={onNewClick} style={styles.newBtn}>
                            <Text style={styles.newText}>Novo</Text>
                        </Pressable>
                    )}
                </View>
            </View>

            {!showArchived && (
                <View style={styles.pillsWrap}>
                    <StatusPills
                        value={statusFilter}
                        onChange={onStatusChange}
                        options={[
                            { key: "all", label: "Todos" },
                            { key: "pendente", label: "Pendente" },
                            { key: "em_andamento", label: "Em andamento" },
                            { key: "concluido", label: "Concluído" },
                        ]}
                    />
                </View>
            )}

            {/* LISTA */}
            {isLoading ? (
                <View style={styles.loadingWrap}>
                    <Loading visible />
                </View>
            ) : (
                <FlatList
                    data={visitors}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <VisitorCard
                            visitor={item}
                            showArchived={showArchived}
                            processingId={processingId}
                            onSelect={onSelect}
                            onFollowup={onFollowup}
                            onFinish={onFinish}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            {showArchived
                                ? "Nenhum visitante arquivado."
                                : "Nenhum visitante encontrado."}
                        </Text>
                    }
                />
            )}

            {/* PAGINAÇÃO FIXA */}
            <View style={styles.paginationWrap}>
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPrev={onPrev}
                    onNext={onNext}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    topRow: { gap: 10 },

    search: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: "#111827",
    },

    actions: {
        flexDirection: "row",
        gap: 4,
        paddingVertical: 4,
        justifyContent: "flex-end",
    },

    archiveBtn: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
    },

    archiveText: { color: "#374151", fontWeight: "700" },

    newBtn: {
        backgroundColor: "#38B2AC",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
    },

    newText: { color: "#fff", fontWeight: "800" },

    pillsWrap: {
        marginBottom: 10,
        paddingBottom: 10,
        paddingVertical: 10,
    },

    listContent: {
        paddingBottom: 12,
    },

    loadingWrap: {
        flex: 1,
        paddingTop: 24,
    },

    empty: {
        textAlign: "center",
        paddingVertical: 24,
        color: "#6B7280",
    },

    paginationWrap: {
        paddingTop: 8,
    },
});
