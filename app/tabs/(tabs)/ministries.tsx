import { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";

import { useMinistries } from "../../../src/features/ministries/hook/useMinistries";
import { MinistriesHeader } from "../../../src/features/ministries/components/ministriesHeader";
import { MinistriesList } from "../../../src/features/ministries/components/ministriesList";
import { NewMinistryModal } from "../../../src/features/ministries/components/modals/newMinistryModal";
import { EditMinistryModal } from "../../../src/features/ministries/components/modals/editMinistryModal";
import { DeleteMinistryModal } from "../../../src/features/ministries/components/modals/deleteMinistryModal";

export default function MinistriesScreen() {
  const {
    ministries,
    loading,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    searchTerm,
    setSearchTerm,
    goNext,
    goPrev,
    refresh,
    createMinistry,
    updateMinistry,
    deleteMinistry,
  } = useMinistries();

  const [newOpen, setNewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <View style={styles.container}>
      <MinistriesHeader
        searchTerm={searchTerm}
        onChangeSearch={setSearchTerm}
        onNewPress={() => setNewOpen(true)}
      />

      <MinistriesList
        ministries={ministries}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPrev={goPrev}
        onNext={goNext}
        onEdit={(m) => {
          setSelected(m);
          setEditOpen(true);
        }}
        onDelete={(m) => {
          setSelected(m);
          setDeleteOpen(true);
        }}
        onRefresh={refresh}
      />

      <NewMinistryModal
        visible={newOpen}
        onClose={() => setNewOpen(false)}
        onSave={createMinistry}
      />

      <EditMinistryModal
        visible={editOpen}
        ministry={selected}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
        }}
        onSave={updateMinistry}
      />

      <DeleteMinistryModal
        visible={deleteOpen}
        ministry={selected}
        onClose={() => {
          setDeleteOpen(false);
          setSelected(null);
        }}
        onConfirm={deleteMinistry}
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
});