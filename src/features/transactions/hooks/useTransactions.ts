import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../../../lib/supabase";

type Filter = "todas" | "entrada" | "saida";

type Transaction = {
  id: string;
  type: "entrada" | "saida";
  category: string;
  amount: number;
  person_name?: string | null;
  created_at: string;
};

type CreatePayload = {
  type: "entrada" | "saida";
  category: string;
  amount: number;
  person_name?: string | null;
};

type UpdatePayload = Partial<Pick<Transaction, "type" | "category" | "amount" | "person_name">>;

function monthBounds(ym: string) {
  const [year, month] = ym.split("-");
  const start = new Date(Number(year), Number(month) - 1, 1, 0, 0, 0, 0);
  const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
  return { start, end };
}

function inSelectedMonth(createdAt: string, selectedMonth: string) {
  const { start, end } = monthBounds(selectedMonth);
  const d = new Date(createdAt);
  return d >= start && d <= end;
}

function matchesFilter(type: Transaction["type"], filter: Filter) {
  if (filter === "todas") return true;
  return type === filter;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageChanging, setPageChanging] = useState(false);

  const [filter, setFilter] = useState<Filter>("todas");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const loadTransactions = useCallback(async () => {
    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) return;

      const { start, end } = monthBounds(selectedMonth);

      let query = supabase
        .from("transactions")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: false });

      if (filter !== "todas") {
        query = query.eq("type", filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setTransactions((data || []) as Transaction[]);
      setCurrentPage(1);
    } catch {
      Alert.alert("Erro", "Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  }, [filter, selectedMonth]);

  const didInit = useRef(false);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions])
  );

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    loadTransactions();
  }, [filter, selectedMonth, loadTransactions]);

  const totalPages = useMemo(() => {
    const pages = Math.ceil(transactions.length / itemsPerPage);
    return pages <= 0 ? 1 : pages;
  }, [transactions.length, itemsPerPage]);

  useEffect(() => {
    setCurrentPage((p) => (p > totalPages ? totalPages : p));
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIdx, startIdx + itemsPerPage);
  }, [transactions, currentPage, itemsPerPage]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setPageChanging(true);
      setTimeout(() => {
        setCurrentPage((p) => p + 1);
        setPageChanging(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setPageChanging(true);
      setTimeout(() => {
        setCurrentPage((p) => p - 1);
        setPageChanging(false);
      }, 300);
    }
  };

  const applyLocalUpsert = useCallback(
    (tx: Transaction) => {
      const shouldBeVisible = inSelectedMonth(tx.created_at, selectedMonth) && matchesFilter(tx.type, filter);

      setTransactions((prev) => {
        const exists = prev.some((p) => p.id === tx.id);

        if (!shouldBeVisible) {
          return exists ? prev.filter((p) => p.id !== tx.id) : prev;
        }

        if (!exists) {
          return [tx, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        return prev
          .map((p) => (p.id === tx.id ? tx : p))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      });
    },
    [filter, selectedMonth]
  );

  const createTransaction = useCallback(
    async (payload: CreatePayload) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert(payload)
        .select("*")
        .single();

      if (error) throw error;

      const created = data as Transaction;
      applyLocalUpsert(created);
      setCurrentPage(1);
      return created;
    },
    [applyLocalUpsert]
  );

  const editTransaction = useCallback(
    async (id: string, payload: UpdatePayload) => {
      const { data, error } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;

      const updated = data as Transaction;
      applyLocalUpsert(updated);
      return updated;
    },
    [applyLocalUpsert]
  );

  const deleteTransaction = useCallback(async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) throw error;

    setTransactions((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
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
    loadTransactions,
    createTransaction,
    editTransaction,
    deleteTransaction,
  };
}
