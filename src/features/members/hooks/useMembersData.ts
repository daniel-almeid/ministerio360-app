import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";

export type Member = {
  id: string;
  name: string;
  ministry_id: string | null;
  ministry_name?: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  birth_date: string | null;
};

const ITEMS_PER_PAGE = 10;

export function useMembersData(reloadFlag?: boolean) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "inactive">("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const fetchMembers = useCallback(async () => {
    setLoading(true);

    try {
      let query = supabase
        .from("members")
        .select(
          `
            id,
            name,
            email,
            phone,
            is_active,
            birth_date,
            ministry_id,
            ministries ( name )
          `,
          { count: "exact" }
        )
        .order("name");

      if (statusFilter === "active") query = query.eq("is_active", true);
      if (statusFilter === "inactive") query = query.eq("is_active", false);

      if (search.trim()) {
        query = query.ilike("name", `%${search.trim()}%`);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count } = await query.range(from, to);

      setTotalItems(count ?? 0);

      setMembers(
        data?.map((m: any) => ({
          ...m,
          ministry_name: m.ministries?.name ?? null,
        })) ?? []
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, currentPage]);

  // debounce de busca/filtro
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchMembers();
    }, 400);
  }, [search, statusFilter]);

  // paginação
  useEffect(() => {
    fetchMembers();
  }, [currentPage]);

  // reload externo (create/edit/delete)
  useEffect(() => {
    if (reloadFlag !== undefined) {
      fetchMembers();
    }
  }, [reloadFlag]);

  return {
    members,
    loading,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,

    nextPage: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setCurrentPage((p) => Math.max(p - 1, 1)),
  };
}
