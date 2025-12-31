import { View, StyleSheet } from "react-native";
import { useState } from "react";

import VisitorTable from "./components/visitorTable";
import VisitorModal from "./components/modals/visitorModal";
import VisitorDetailsDrawer from "./components/drawer/visitorDetailsDrawer";
import type { Visitor } from "./types/visitors";
import { useVisitorsData } from "./hooks/useVisitorsData";
import { useFollowup } from "./hooks/useFollowup";

export default function VisitorsScreen() {
  const {
    visitors,
    loading,
    search,                 // ✅ USAR O SEARCH DO HOOK
    setSearchDebounced,     // ✅ FUNÇÃO CORRETA
    showArchived,
    setShowArchived,
    statusFilter,
    setStatusFilter,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    nextPage,
    prevPage,
    reload,
  } = useVisitorsData();

  const { processingId, handleFollowup, handleFinish } = useFollowup();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  return (
    <View style={styles.page}>
      <VisitorTable
        visitors={visitors}
        isLoading={loading}
        searchValue={search}                 // ✅ AQUI
        onSearchChange={setSearchDebounced}  // ✅ AQUI
        showArchived={showArchived}
        onToggleArchived={setShowArchived}
        statusFilter={statusFilter}
        onStatusChange={(v) => setStatusFilter(v as any)}
        processingId={processingId}
        onSelect={(v) => {
          setSelectedVisitor(v);
          setDrawerOpen(true);
        }}
        onFollowup={async (v) => {
          const updated = await handleFollowup(v);
          if (updated) reload();
        }}
        onFinish={async (v) => {
          const updated = await handleFinish(v);
          if (updated) reload();
        }}
        onNewClick={() => {
          setEditingVisitor(null);
          setModalOpen(true);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onNext={nextPage}
        onPrev={prevPage}
      />

      <VisitorModal
        visible={modalOpen}
        visitor={editingVisitor}
        onClose={() => setModalOpen(false)}
        onSuccess={reload}
      />

      <VisitorDetailsDrawer
        visible={drawerOpen}
        visitor={selectedVisitor}
        processingId={processingId}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedVisitor(null);
        }}
        onUpdated={reload}
        onStartFollowup={async (v) => {
          const updated = await handleFollowup(v);
          if (updated) reload();
        }}
        onFinishFollowup={async (v) => {
          const updated = await handleFinish(v);
          if (updated) reload();
        }}
        onEdit={(v) => {
          setDrawerOpen(false);
          setSelectedVisitor(null);
          setEditingVisitor(v);
          setModalOpen(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
});
