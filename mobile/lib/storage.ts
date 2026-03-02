import AsyncStorage from "@react-native-async-storage/async-storage";
import { HistoryItem } from "./types";

const STORAGE_KEY = "snapenglish_history";
const MAX_ITEMS = 20;
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7日

/**
 * 期限切れアイテムを削除し、有効なアイテムのみを返す
 */
async function cleanAndGetHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const items: HistoryItem[] = JSON.parse(raw);
    const now = Date.now();
    const valid = items.filter((item) => {
      const created = new Date(item.created_at).getTime();
      return now - created < TTL_MS;
    });
    if (valid.length !== items.length) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
}

/**
 * 履歴リストを取得（期限切れを自動清掃）
 */
export async function getHistory(): Promise<HistoryItem[]> {
  return cleanAndGetHistory();
}

/**
 * 履歴に新しいアイテムを追加（最大20件、超過分は古いものを削除）
 */
export async function addHistory(item: HistoryItem): Promise<void> {
  const history = await getHistory();
  history.unshift(item);

  while (history.length > MAX_ITEMS) {
    history.pop();
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * 特定の履歴アイテムを削除
 */
export async function removeHistory(id: string): Promise<void> {
  const history = await getHistory();
  const filtered = history.filter((item) => item.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * 履歴を全て削除
 */
export async function clearAllHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
