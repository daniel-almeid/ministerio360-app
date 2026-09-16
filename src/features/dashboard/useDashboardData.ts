import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Visitor = {
    id: string;
    name: string;
    visit_date: string;
    phone?: string | null;
    email?: string | null;
};

type Ministry = {
    id: string;
    name: string;
};

type Event = {
    id: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
    ministries: Ministry[];
};

type Transaction = {
    amount: number;
    type: "entrada" | "saida";
    created_at: string;
};

function getMonthRange() {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    return { start, end };
}

export function useDashboardData() {
    const [currentMonthIncome, setIncome] = useState(0);
    const [currentMonthExpenses, setExpenses] = useState(0);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);

            const { start, end } = getMonthRange();

            const [income, expenses, visitorsRes, eventsRes, monthlyTx] = await Promise.all([
                supabase
                    .from("transactions")
                    .select("amount")
                    .eq("type", "entrada")
                    .gte("created_at", start.toISOString())
                    .lte("created_at", end.toISOString()),

                supabase
                    .from("transactions")
                    .select("amount")
                    .eq("type", "saida")
                    .gte("created_at", start.toISOString())
                    .lte("created_at", end.toISOString()),

                supabase
                    .from("visitors")
                    .select("id, name, visit_date, phone, email")
                    .order("visit_date", { ascending: false }),

                supabase
                    .from("events")
                    .select(`
                        id,
                        title,
                        date,
                        time,
                        location,
                        event_ministries (
                            ministries ( id, name )
                        )
                    `)
                    .gte("date", new Date().toISOString())
                    .order("date", { ascending: true })
                    .limit(5),

                supabase
                    .from("transactions")
                    .select("amount, type, created_at")
                    .gte("created_at", start.toISOString())
                    .lte("created_at", end.toISOString()),
            ]);

            setIncome(income.data?.reduce((a, b) => a + Number(b.amount), 0) ?? 0);
            setExpenses(expenses.data?.reduce((a, b) => a + Number(b.amount), 0) ?? 0);
            setVisitors(visitorsRes.data ?? []);

            const formattedEvents: Event[] = (eventsRes.data ?? []).map((ev: any) => ({
                id: ev.id,
                title: ev.title,
                date: ev.date,
                time: ev.time,
                location: ev.location,
                ministries:
                    ev.event_ministries?.map((em: any) => em?.ministries).filter(Boolean) || [],
            }));
            setEvents(formattedEvents);

            setMonthlyTransactions((monthlyTx.data ?? []) as Transaction[]);
            setLoading(false);
        }

        load();
    }, []);

    return {
        currentMonthIncome,
        currentMonthExpenses,
        visitors,
        events,
        monthlyTransactions,
        loading,
    };
}