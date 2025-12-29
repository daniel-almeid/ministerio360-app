import { View } from "react-native";
import { useState } from "react";
import { useTransactions } from "@/src/features/transactions/hooks/useTransactions";

import TransactionTable from "@/src/features/transactions/components/transactionTable";
import { ModalNewTransaction } from "@/src/features/transactions/components/modals/modalNewTransition";
import { ModalEditTransaction } from "@/src/features/transactions/components/modals/modalEditTransaction";
import { ModalDeleteTransaction } from "@/src/features/transactions/components/modals/modalDeleteTransaction";

export default function Finances() {
  const tx = useTransactions();

  const [selected, setSelected] = useState<any | null>(null);
  const [mode, setMode] = useState<"new" | "edit" | "delete" | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <TransactionTable
        transactions={tx.transactions}
        paginatedData={tx.paginatedData}
        loading={tx.loading}
        pageChanging={tx.pageChanging}
        filter={tx.filter}
        setFilter={tx.setFilter}
        selectedMonth={tx.selectedMonth}
        setSelectedMonth={tx.setSelectedMonth}
        currentPage={tx.currentPage}
        totalPages={tx.totalPages}
        itemsPerPage={tx.itemsPerPage}
        handleNext={tx.handleNext}
        handlePrevious={tx.handlePrevious}
        onNewClick={() => setMode("new")}
        onEdit={(t) => {
          setSelected(t);
          setMode("edit");
        }}
        onDelete={(t) => {
          setSelected(t);
          setMode("delete");
        }}
      />

      {mode === "new" && (
        <ModalNewTransaction
          visible
          onClose={() => setMode(null)}
          onCreate={async (payload) => {
            await tx.createTransaction(payload);
          }}
        />
      )}

      {mode === "edit" && selected && (
        <ModalEditTransaction
          visible
          transaction={selected}
          onClose={() => setMode(null)}
          onUpdate={async (id, payload) => {
            const updated = await tx.editTransaction(id, payload);
            setSelected(updated);
          }}
        />
      )}

      {mode === "delete" && selected && (
        <ModalDeleteTransaction
          visible
          onCancel={() => setMode(null)}
          onConfirm={async () => {
            await tx.deleteTransaction(selected.id);
            setMode(null);
            setSelected(null);
          }}
        />
      )}
    </View>
  );
}
