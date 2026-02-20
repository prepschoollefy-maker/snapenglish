import { HistoryItem } from "./types";

const STORAGE_KEY = "snapenglish_history";
const MAX_ITEMS = 20;
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7日

/**
 * 期限切れアイテムを削除
 */
function cleanExpiredHistory(): void {
    if (typeof window === "undefined") return;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const items: HistoryItem[] = JSON.parse(raw);
        const now = Date.now();
        const valid = items.filter((item) => {
            const created = new Date(item.created_at).getTime();
            return now - created < TTL_MS;
        });
        if (valid.length !== items.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
        }
    } catch {
        // ignore
    }
}

/**
 * 履歴リストを取得（期限切れを自動清掃）
 */
export function getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return [];
    cleanExpiredHistory();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as HistoryItem[];
    } catch {
        return [];
    }
}

/**
 * 履歴に新しいアイテムを追加（最大20件、超過分は古いものを削除）
 */
export function addHistory(item: HistoryItem): void {
    const history = getHistory();
    history.unshift(item);

    while (history.length > MAX_ITEMS) {
        history.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * 特定の履歴アイテムをIDで取得
 */
export function getHistoryById(id: string): HistoryItem | undefined {
    const history = getHistory();
    return history.find((item) => item.id === id);
}

/**
 * 特定の履歴アイテムを削除
 */
export function removeHistory(id: string): void {
    const history = getHistory();
    const filtered = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * 履歴を全て削除
 */
export function clearAllHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}
