import { useEffect, useState } from "react";
import { notifyError } from "../../../shared/ui/toast";
import type { FinancialReportItem } from "../types/types";
import {
    fetchFinancialReport,
    fetchMembersReport,
} from "../services/reportsService";

export function useReports() {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
            2,
            "0"
        )}`;
    });

    const [financialData, setFinancialData] = useState<FinancialReportItem[]>([]);
    const [activeMembers, setActiveMembers] = useState(0);
    const [monthlyVisitors, setMonthlyVisitors] = useState(0);

    const [loading, setLoading] = useState(true);

    async function loadReports() {
        setLoading(true);
        try {
            const [financial, members] = await Promise.all([
                fetchFinancialReport(selectedMonth),
                fetchMembersReport(selectedMonth),
            ]);

            setFinancialData(financial);
            setActiveMembers(members.activeMembers);
            setMonthlyVisitors(members.monthlyVisitors);
        } catch (e: any) {
            notifyError(e.message || "Erro ao carregar relatórios");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadReports();
    }, [selectedMonth]);

    return {
        selectedMonth,
        setSelectedMonth,

        financialData,
        activeMembers,
        monthlyVisitors,

        loading,
    };
}
