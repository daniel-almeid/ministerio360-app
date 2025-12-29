import { useState } from "react";
import { View, StyleSheet } from "react-native";

import MemberTable from "@/src/features/members/components/table/memberTable";
import NewMemberModal from "@/src/features/members/components/modals/newMemberModal";
import EditMemberModal from "@/src/features/members/components/modals/editMemberModal";
import DeleteMemberModal from "@/src/features/members/components/modals/deleteMemberModal";
import type { Member } from "@/src/features/members/hooks/useMembersData";

export default function Members() {
  const [reloadFlag, setReloadFlag] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  function reload() {
    setReloadFlag((v) => !v);
  }

  return (
    <View style={styles.container}>
      <MemberTable
        reloadFlag={reloadFlag}
        onNewClick={() => setShowNew(true)}
        onEdit={(m) => {
          setSelectedMember(m);
          setShowEdit(true);
        }}
        onDelete={(m) => {
          setSelectedMember(m);
          setShowDelete(true);
        }}
      />

      {showNew && (
        <NewMemberModal
          visible
          onClose={() => setShowNew(false)}
          onSuccess={reload}
        />
      )}

      {showEdit && selectedMember && (
        <EditMemberModal
          visible
          member={selectedMember}
          onClose={() => setShowEdit(false)}
          onSuccess={reload}
        />
      )}

      {showDelete && selectedMember && (
        <DeleteMemberModal
          visible
          member={selectedMember}
          onClose={() => setShowDelete(false)}
          onSuccess={reload}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
});
