export function toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function fromISODate(iso: string): Date {
    const [y, m, d] = iso.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d), 12);
}

export function formatDateBR(iso: string): string {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
}
