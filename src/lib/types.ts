/** AI解析結果の英文 */
export interface Sentence {
  id: number;
  english: string;
  japanese: string;
  original_type: "complete" | "fill_in_blank" | "reorder";
  original_text: string;
}

/** AI解析結果の単語・熟語 */
export interface VocabularyItem {
  id: number;
  english: string;
  japanese: string;
  pos: "noun" | "verb" | "adjective" | "adverb" | "phrase" | "other";
}

/** AI解析結果全体 */
export interface AnalysisResult {
  sentences: Sentence[];
  vocabulary: VocabularyItem[];
}

/** API レスポンス */
export interface ApiResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: "NO_TEXT_FOUND" | "API_ERROR" | "PARSE_ERROR";
}

/** 履歴アイテム */
export interface HistoryItem {
  id: string;
  created_at: string;
  thumbnail: string;
  label: string;
  data: AnalysisResult;
}

/** 練習モード */
export type PracticeMode = "en_to_jp" | "jp_to_en" | "vocabulary";

/** 単語テストの方向 */
export type VocabDirection = "en_to_jp" | "jp_to_en";
