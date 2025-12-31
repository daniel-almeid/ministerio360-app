export type Ministry = {
    id: string;
    name: string;
};

export type EventItem = {
    id: string;
    title: string;
    date: string;
    time?: string | null;
    location?: string | null;
    ministries?: Ministry[];
};
