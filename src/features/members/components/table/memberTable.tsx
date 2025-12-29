import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { useMembersData } from "../../hooks/useMembersData";
import { MemberItem } from "./memberItem";
import Loading from "../../../../shared/ui/loading";
import { PaginationControls } from "@/src/shared/components/paginationControls";
import type { Member } from "../../hooks/useMembersData";

type Props = {
  reloadFlag: boolean;
  onNewClick: () => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
};

export default function MemberTable({
  reloadFlag,
  onNewClick,
  onEdit,
  onDelete,
}: Props) {
  const {
    members,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    nextPage,
    prevPage,
  } = useMembersData(reloadFlag);

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchRow}>
        <Feather name="search" size={18} color="#9CA3AF" />
        <TextInput
          placeholder="Pesquisar membro..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* FILTERS */}
      <View style={styles.filters}>
        {[
          { key: "all", label: "Todos" },
          { key: "active", label: "Ativos" },
          { key: "inactive", label: "Inativos" },
        ].map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setStatusFilter(f.key as any)}
            style={[
              styles.filterButton,
              statusFilter === f.key && styles.filterActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* NEW */}
      <Pressable style={styles.newButton} onPress={onNewClick}>
        <Feather name="plus-circle" size={18} color="#fff" />
        <Text style={styles.newButtonText}>Novo Membro</Text>
      </Pressable>

      {/* LISTA */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {members.length > 0 ? (
          members.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>
            Nenhum membro cadastrado ainda.
          </Text>
        )}
      </ScrollView>

      {/* PAGINAÇÃO */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onNext={nextPage}
        onPrev={prevPage}
      />

      {/* LOADING */}
      <Loading visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    flex: 1,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },

  filterActive: {
    backgroundColor: "#38B2AC",
  },

  filterText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },

  filterTextActive: {
    color: "#fff",
  },

  newButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#38B2AC",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
  },

  newButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    paddingVertical: 32,
  },
});
