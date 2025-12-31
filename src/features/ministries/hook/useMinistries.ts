import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";

export type Ministry = {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
};

export function useMinistries() {
    const [ministries, setMinistries] = useState<Ministry[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 10;

    // React Native → setTimeout retorna number
    const debounceRef = useRef<number | null>(null);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(totalItems / itemsPerPage));
    }, [totalItems]);

    const fetchMinistries = useCallback(async () => {
        setLoading(true);

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage - 1;

        let query = supabase
            .from("ministries")
            .select("*", { count: "exact" })
            .order("name", { ascending: true })
            .range(start, end);

        if (searchTerm.trim()) {
            query = query.ilike("name", `%${searchTerm.trim()}%`);
        }

        const { data, count, error } = await query;

        if (error) {
            console.log("Erro ao carregar ministérios:", error.message);
            setLoading(false);
            return;
        }

        setMinistries((data as Ministry[]) || []);
        setTotalItems(count || 0);
        setLoading(false);
    }, [currentPage, searchTerm]);

    // debounce + paginação
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchMinistries();
        }, 400);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [fetchMinistries]);

    // reset de página ao buscar
    useEffect(() => {
        if (searchTerm.trim()) {
            setCurrentPage(1);
        }
    }, [searchTerm]);

    function goNext() {
        if (currentPage < totalPages) {
            setCurrentPage((p) => p + 1);
        }
    }

    function goPrev() {
        if (currentPage > 1) {
            setCurrentPage((p) => p - 1);
        }
    }

    async function refresh() {
        await fetchMinistries();
    }

    async function createMinistry(payload: {
        name: string;
        description?: string;
    }): Promise<boolean> {
        const name = payload.name.trim();
        const description = payload.description?.trim() || null;

        if (!name) return false;

        const { error } = await supabase
            .from("ministries")
            .insert([{ name, description }]);

        if (error) {
            return false;
        }

        await refresh();
        return true;
    }

    async function updateMinistry(payload: {
        id: string;
        name: string;
        description?: string;
    }): Promise<boolean> {
        const name = payload.name.trim();
        const description = payload.description?.trim() || null;

        if (!name) return false;

        const { error } = await supabase
            .from("ministries")
            .update({ name, description })
            .eq("id", payload.id);

        if (error) {
            return false;
        }

        await refresh();
        return true;
    }

    async function deleteMinistry(id: string): Promise<boolean> {
        const { error } = await supabase
            .from("ministries")
            .delete()
            .eq("id", id);

        if (error) {
            return false;
        }

        await refresh();
        return true;
    }

    return {
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
    };
}
