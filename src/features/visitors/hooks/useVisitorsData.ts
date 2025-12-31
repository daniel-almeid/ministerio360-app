import { useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import type { FollowupStatus, Visitor } from "../types/visitors";
import { getVisitors } from "../services/visitors";

type StatusFilter = "all" | FollowupStatus;

export function useVisitorsData() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const debounceRef = useRef<number | null>(null);

    async function loadVisitors() {
        try {
            setLoading(true);
            const data = await getVisitors(showArchived);
            setVisitors(data);
        } catch {
            Alert.alert("Erro", "Erro ao carregar visitantes.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadVisitors();
    }, [showArchived]);

    function setSearchDebounced(value: string) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setCurrentPage(1);
            setSearch(value);
        }, 250) as unknown as number;
    }

    const filteredBySearch = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return visitors;

        return visitors.filter((v) =>
            [v.name, v.email, v.phone]
                .filter(Boolean)
                .some((x) => String(x).toLowerCase().includes(q))
        );
    }, [search, visitors]);

    const filteredByStatus = useMemo(() => {
        if (statusFilter === "all") return filteredBySearch;
        return filteredBySearch.filter((v) => v.followup_status === statusFilter);
    }, [filteredBySearch, statusFilter]);

    const sortedVisitors = useMemo(() => {
        return [...filteredByStatus].sort((a, b) =>
            (a.name ?? "").localeCompare(b.name ?? "", "pt-BR", { sensitivity: "base" })
        );
    }, [filteredByStatus]);

    const totalItems = sortedVisitors.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const paginatedVisitors = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedVisitors.slice(start, start + itemsPerPage);
    }, [sortedVisitors, currentPage]);

    function nextPage() {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    }

    function prevPage() {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    }

    return {
        visitors: paginatedVisitors,
        loading,

        search,
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

        reload: loadVisitors,
    };
}
