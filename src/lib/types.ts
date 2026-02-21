/** 文構造解析の1文 */
export interface SentenceAnalysis {
  id: number;
  original: string;          // 元の英文
  translation: string;       // 和訳
  structure: string;         // SVOC構造（例: "S(The boy) V(ran) M(to the store)"）
  clauses?: string;          // 節・修飾の説明（あれば）
}

/** 重要語句 */
export interface KeyPhrase {
  id: number;
  english: string;
  japanese: string;
  note?: string;             // 補足（用法、品詞など）
}

/** 解析結果全体 */
export interface AnalysisResult {
  sentences: SentenceAnalysis[];
  key_phrases: KeyPhrase[];
}

/** APIレスポンス */
export interface ApiResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: "NO_TEXT_FOUND" | "API_ERROR" | "PARSE_ERROR" | "TEXT_TOO_LONG" | "RATE_LIMITED";
}

/** 履歴アイテム */
export interface HistoryItem {
  id: string;
  created_at: string;
  thumbnail: string;
  label: string;
  data: AnalysisResult;
}
