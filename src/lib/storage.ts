import { HistoryItem } from "./types";

const STORAGE_KEY = "snapenglish_history";
const MAX_ITEMS = 20;

/**
 * 履歴リストを取得
 */
export function getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return [];
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

    // 最大件数を超えたら古いものを削除
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
