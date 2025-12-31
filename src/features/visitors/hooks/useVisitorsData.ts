import { useEffect, useMemo, useRef, useState } from "react";
import type { FollowupStatus, Visitor } from "../types/visitors";
import { getVisitors } from "../services/visitors";
import { notifyError } from "../../../shared/ui/toast";

type StatusFilter = "all" | FollowupStatus;

function normalize(str: string) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function useVisitorsData() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [uiLoading, setUiLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const debounceRef = useRef<number | null>(null);
    const uiTimerRef = useRef<number | null>(null);

    function clearUiTimer() {
        if (uiTimerRef.current) {
            clearTimeout(uiTimerRef.current);
            uiTimerRef.current = null;
        }
    }

    function showUiLoading(minMs: number = 220) {
        clearUiTimer();
        setUiLoading(true);
        uiTimerRef.current = setTimeout(() => {
            setUiLoading(false);
            uiTimerRef.current = null;
        }, minMs) as unknown as number;
    }

    async function loadVisitors(resetPage = false) {
        clearUiTimer();
        if (resetPage) setCurrentPage(1);

        try {
            setLoading(true);
            const data = await getVisitors(showArchived);
            setVisitors(data);
        } catch {
            notifyError("Erro ao carregar visitantes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadVisitors(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showArchived]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            clearUiTimer();
        };
    }, []);

    function setSearchDebounced(value: string) {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        showUiLoading(220);

        debounceRef.current = setTimeout(() => {
            requestAnimationFrame(() => {
                setCurrentPage(1);
                setSearch(value);
            });
        }, 250) as unknown as number;
    }

    // FILTRO ESTRITO E PREVISÍVEL
    const filteredBySearch = useMemo(() => {
        const raw = search.trim();
        if (!raw) return visitors;

        const q = normalize(raw);
        const hasNumber = /\d/.test(q);
        const isEmailSearch = raw.includes("@");

        return visitors.filter((v) => {
            // NOME (regra principal)
            if (!hasNumber && !isEmailSearch && v.name) {
                const words = normalize(v.name).split(" ");
                return words.some((w) => w.startsWith(q));
            }

            // EMAIL (somente se o usuário digitar @)
            if (isEmailSearch && v.email) {
                return normalize(v.email).startsWith(q);
            }

            // TELEFONE (somente se houver número)
            if (hasNumber && v.phone) {
                const phone = v.phone.replace(/\D/g, "");
                const searchDigits = q.replace(/\D/g, "");
                return phone.startsWith(searchDigits);
            }

            return false;
        });
    }, [search, visitors]);

    const filteredByStatus = useMemo(() => {
        if (statusFilter === "all") return filteredBySearch;
        return filteredBySearch.filter(
            (v) => v.followup_status === statusFilter
        );
    }, [filteredBySearch, statusFilter]);

    const sortedVisitors = useMemo(() => {
        return [...filteredByStatus].sort((a, b) =>
            (a.name ?? "").localeCompare(b.name ?? "", "pt-BR", {
                sensitivity: "base",
            })
        );
    }, [filteredByStatus]);

    const totalItems = sortedVisitors.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const paginatedVisitors = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedVisitors.slice(start, start + itemsPerPage);
    }, [sortedVisitors, currentPage]);

    function nextPage() {
        if (currentPage < totalPages) {
            showUiLoading(220);
            setCurrentPage((p) => p + 1);
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            showUiLoading(220);
            setCurrentPage((p) => p - 1);
        }
    }

    function changeStatusFilter(v: StatusFilter) {
        showUiLoading(220);
        setCurrentPage(1);
        setStatusFilter(v);
    }

    function toggleArchived() {
        setCurrentPage(1);
        setStatusFilter("all");
        setShowArchived((prev) => !prev);
    }

    return {
        visitors: paginatedVisitors,
        loading: loading || uiLoading,
        search,
        setSearchDebounced,
        showArchived,
        setShowArchived: toggleArchived,
        statusFilter,
        setStatusFilter: changeStatusFilter,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        nextPage,
        prevPage,
        reload: () => loadVisitors(true),
    };
}
