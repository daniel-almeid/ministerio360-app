import {
    View,
    TextInput,
    Pressable,
    Text,
    StyleSheet,
    FlatList,
} from "react-native";
import { useEffect, useState } from "react";
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
    
    const [localSearch, setLocalSearch] = useState(searchValue);

    // mantém sincronizado caso o search seja limpo externamente
    useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <TextInput
                    placeholder="Pesquisar visitante..."
                    value={localSearch}
                    onChangeText={(text) => {
                        setLocalSearch(text);
                        onSearchChange(text);
                    }}
                    style={styles.search}
                />

                <View style={styles.actions}>
                    <Pressable
                        onPress={onToggleArchived}
                        style={styles.archiveBtn}
                    >
                        <Text style={styles.archiveText}>
                            {showArchived ? "Ativos" : "Arquivados"}
                        </Text>
                    </Pressable>

                    {!showArchived && (
                        <Pressable
                            onPress={onNewClick}
                            style={styles.newBtn}
                        >
                            <Text style={styles.newText}>
                                Novo Visitante
                            </Text>
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

            <View style={styles.listArea}>
                {isLoading ? (
                    <Loading visible />
                ) : visitors.length === 0 ? (
                    <View style={styles.emptyWrap}>
                        <Text style={styles.emptyText}>
                            {showArchived
                                ? "Nenhum visitante arquivado."
                                : "Nenhum visitante encontrado."}
                        </Text>
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
                    />
                )}
            </View>

            {totalItems > 0 && (
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
            )}
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
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: "#111827",
    },
    actions: {
        flexDirection: "row",
        gap: 8,
        justifyContent: "flex-end",
        padding: 8,
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
    pillsWrap: { marginBottom: 10 },
    listArea: { flex: 1, marginTop: 4 },
    listContent: { paddingBottom: 12 },
    paginationWrap: { paddingTop: 8 },
    emptyWrap: { flex: 1, paddingTop: 40, alignItems: "center" },
    emptyText: {
        color: "#6B7280",
        fontSize: 14,
        textAlign: "center",
    },
});
