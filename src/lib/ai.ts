import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "./types";

const SYSTEM_PROMPT = `あなたは英語教材分析AIです。与えられた画像に含まれる英語テキストを分析し、学習用の問題データを生成してください。

## タスク

1. 画像内の英語テキストをすべて読み取る
2. 以下のルールに従って分類・処理する
3. 指定されたJSON形式で出力する

## 分類ルール

### 英文（sentences）として抽出するもの：
- 完全な英文（ピリオド、疑問符、感嘆符で終わるもの）
- 穴埋め問題 → 空欄を適切な語句で補完し、完全な文として出力する
- 並べ替え問題 → 正しい語順に並べ替え、完全な文として出力する
- 対話文の各発話

### 単語・熟語（vocabulary）として抽出するもの：
- 単語リストとして掲載されているもの
- 太字やボックスで強調された重要語句
- 文中には登場せず単独で掲載されている語句

### 除外するもの：
- 問題番号（Q1, (1), ① など）
- 指示文（「次の文を英語にしなさい」「下線部を和訳せよ」など）
- ページ番号
- 章タイトル・セクション名

## 和訳のルール
- 中学生〜高校1年生が理解できる自然な日本語にすること
- 直訳ではなく、日本語として自然な表現を使うこと
- 文法的なニュアンスが失われない範囲で意訳してよい

## 出力形式

以下のJSON形式で出力してください。JSON以外のテキストは一切出力しないでください。

{
  "sentences": [
    {
      "id": 1,
      "english": "完全な英文",
      "japanese": "自然な日本語訳",
      "original_type": "complete | fill_in_blank | reorder",
      "original_text": "画像上の元のテキスト"
    }
  ],
  "vocabulary": [
    {
      "id": 1,
      "english": "英単語 or 熟語",
      "japanese": "日本語の意味",
      "pos": "noun | verb | adjective | adverb | phrase | other"
    }
  ]
}

## 注意事項
- 英文が1つも見つからない場合は sentences を空配列にする
- 単語が見つからない場合は vocabulary を空配列にする
- 両方空の場合も有効なJSONを返すこと
- 穴埋め復元は文脈と文法から最も適切な語句を推測すること
- 画像が不鮮明で読み取れない場合は、読み取れた部分だけ出力すること`;

/**
 * AIレスポンスからJSONを抽出してパースする
 * マークダウンのコードブロック記号を除去してからパース
 */
function parseAiResponse(text: string): AnalysisResult {
    // マークダウンのコードブロック記号を除去
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);

    // 基本的なバリデーション
    if (!parsed.sentences || !Array.isArray(parsed.sentences)) {
        parsed.sentences = [];
    }
    if (!parsed.vocabulary || !Array.isArray(parsed.vocabulary)) {
        parsed.vocabulary = [];
    }

    return parsed as AnalysisResult;
}

/**
 * 画像をAI APIに送信して解析結果を返す
 * パース失敗時は最大2回リトライ
 */
export async function analyzeImage(
    imageBase64: string
): Promise<AnalysisResult> {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error("GOOGLE_AI_API_KEY is not set");
    }

    const model = process.env.AI_MODEL || "gemini-2.0-flash";
    const ai = new GoogleGenAI({ apiKey });

    // base64のdata URL部分を分離
    const base64Data = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;

    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                inlineData: {
                                    mimeType: "image/jpeg",
                                    data: base64Data,
                                },
                            },
                            {
                                text: SYSTEM_PROMPT,
                            },
                        ],
                    },
                ],
            });

            const text = response.text;
            if (!text) {
                throw new Error("Empty response from AI");
            }

            const result = parseAiResponse(text);

            // 両方空の場合はテキストが見つからなかった
            if (result.sentences.length === 0 && result.vocabulary.length === 0) {
                throw new Error("NO_TEXT_FOUND");
            }

            return result;
        } catch (error) {
            // NO_TEXT_FOUNDはリトライしない
            if (error instanceof Error && error.message === "NO_TEXT_FOUND") {
                throw error;
            }

            // 最後のリトライでもダメなら投げる
            if (attempt === maxRetries - 1) {
                throw error;
            }

            // リトライ前に少し待つ
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    throw new Error("API_ERROR");
}
