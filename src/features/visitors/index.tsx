import { View, StyleSheet } from "react-native";
import { useMemo, useState } from "react";

import Loading from "../../shared/ui/loading";
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
    setSearchDebounced,
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

  function openNew() {
    setEditingVisitor(null);
    setModalOpen(true);
  }

  function openEdit(v: Visitor) {
    setEditingVisitor(v);
    setModalOpen(true);
  }

  function openDetails(v: Visitor) {
    setSelectedVisitor(v);
    setDrawerOpen(true);
  }

  function closeDetails() {
    setDrawerOpen(false);
    setSelectedVisitor(null);
  }

  async function onFollowup(v: Visitor) {
    const updated = await handleFollowup(v);
    if (updated) reload();
  }

  async function onFinish(v: Visitor) {
    const updated = await handleFinish(v);
    if (updated) reload();
  }

  const searchValueMirror = useMemo(() => "", []);

  if (loading) return <Loading visible />;

  return (
    <View style={styles.page}>
      <VisitorTable
        visitors={visitors}
        isLoading={loading}
        searchValue={searchValueMirror}
        onSearchChange={setSearchDebounced}
        showArchived={showArchived}
        onToggleArchived={() => {
          setStatusFilter("all");
          setShowArchived(!showArchived);
        }}
        statusFilter={statusFilter}
        onStatusChange={(v) => setStatusFilter(v as any)}
        processingId={processingId}
        onSelect={openDetails}
        onFollowup={onFollowup}
        onFinish={onFinish}
        onNewClick={openNew}
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
        onClose={closeDetails}
        onUpdated={reload}
        onStartFollowup={onFollowup}
        onFinishFollowup={onFinish}
        onEdit={(v) => {
          closeDetails();
          openEdit(v);
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
