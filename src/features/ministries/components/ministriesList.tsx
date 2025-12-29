import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";

import { MinistryCard } from "./ministryCard";
import { PaginationControls } from "../../../shared/components/paginationControls";
import Loading from "../../../shared/ui/loading";

type Props = {
    ministries: any[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPrev: () => void;
    onNext: () => void;
    onEdit: (m: any) => void;
    onDelete: (m: any) => void;
    onRefresh: () => void;
};

export function MinistriesList({
    ministries,
    loading,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPrev,
    onNext,
    onEdit,
    onDelete,
    onRefresh,
}: Props) {
    if (loading) {
        return (
            <View style={styles.loadingWrap}>
                <Loading visible />
            </View>
        );
    }

    if (!ministries.length) {
        return (
            <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>
                    Nenhum ministério cadastrado ainda.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={ministries}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <MinistryCard
                        ministry={item}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} />
                }
            />

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
    },
    listContent: {
        paddingBottom: 12,
    },
    loadingWrap: {
        flex: 1,
        paddingTop: 24,
    },
    emptyWrap: {
        flex: 1,
        paddingTop: 40,
        alignItems: "center",
    },
    emptyText: {
        color: "#6B7280",
        fontSize: 14,
    },
    paginationWrap: {
        paddingTop: 8,
    },
});
