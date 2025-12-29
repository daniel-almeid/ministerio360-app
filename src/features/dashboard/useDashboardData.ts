import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Visitor = {
    id: string;
    name: string;
    visit_date: string;
    phone?: string;
    email?: string;
};

type Event = {
    id: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
};

type Transaction = {
    amount: number;
    type: "entrada" | "saida";
    created_at: string;
};

export function useDashboardData() {
    const [currentMonthIncome, setIncome] = useState(0);
    const [currentMonthExpenses, setExpenses] = useState(0);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const end = new Date();

            const [
                income,
                expenses,
                visitorsRes,
                eventsRes,
                txRes,
            ] = await Promise.all([
                supabase.from("transactions").select("amount").eq("type", "entrada"),
                supabase.from("transactions").select("amount").eq("type", "saida"),
                supabase.from("visitors").select("*").limit(20),
                supabase.from("events").select("*").gte("date", new Date().toISOString()).limit(5),
                supabase.from("transactions").select("*"),
            ]);

            setIncome(income.data?.reduce((a, b) => a + b.amount, 0) ?? 0);
            setExpenses(expenses.data?.reduce((a, b) => a + b.amount, 0) ?? 0);
            setVisitors(visitorsRes.data ?? []);
            setEvents(eventsRes.data ?? []);
            setTransactions(txRes.data ?? []);
            setLoading(false);
        }

        load();
    }, []);

    return {
        currentMonthIncome,
        currentMonthExpenses,
        visitors,
        events,
        transactions,
        loading,
    };
}
