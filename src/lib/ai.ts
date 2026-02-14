import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "./types";

const SYSTEM_PROMPT = `あなたは大学受験英語の専門家AIです。与えられた画像に含まれる英語教材を分析し、そこから大学受験に重要な文法・構文・表現のエッセンスを抽出して、**完全にオリジナルの英作文問題**を作成してください。

## 重要：著作権に関する制約
- 画像内の英文をそのまま出力してはいけません
- 必ず、題材・場面・登場人物・内容を変えたオリジナルの英文を作成すること
- 元の英文と同じ文法構造・構文・表現を問うが、文の内容は完全に別物にすること

## タスク

1. 画像内の英語テキストを読み取る
2. 大学受験の観点から重要な文法事項・構文・表現を特定する（例：仮定法過去完了、関係代名詞の非制限用法、分詞構文、倒置、強調構文、比較表現、時制の一致など）
3. 特定した各文法事項について、それを使ったオリジナルの英文と日本語訳のペアを作成する
4. 単語・熟語も同様に抽出する

## オリジナル英文の作成ルール
- 元の英文とは異なるトピック・場面で作成すること（例：元が旅行の話なら、学校生活や科学の話にする）
- 大学受験で出題されるレベル・難易度を意識すること
- 1つの英文で1つの文法ポイントが明確にわかるようにすること
- 高校生が英作文として書けるレベルの自然な英文にすること

## 単語・熟語（vocabulary）として抽出するもの：
- 画像内に登場する大学受験レベルの重要単語・熟語
- 単語リストとして掲載されているもの
- 太字やボックスで強調された重要語句

## 和訳のルール
- 高校生が理解できる自然な日本語にすること
- 英作文の出題として使うため、文法ポイントが日本語からも推測できる表現にすること
- 「もし〜だったら、…だっただろうに」（仮定法過去完了）のように、文法構造が反映された日本語にすること

## 出力形式

以下のJSON形式で出力してください。JSON以外のテキストは一切出力しないでください。

{
  "sentences": [
    {
      "id": 1,
      "english": "オリジナルの英文",
      "japanese": "その日本語訳（英作文の問題文として使用）",
      "grammar_point": "この問題で問われている文法事項（例：仮定法過去完了、分詞構文、関係代名詞whatなど）"
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
- 画像が不鮮明で読み取れない場合は、読み取れた部分だけ出力すること
- grammar_point は簡潔に日本語で記述すること（10〜20文字程度）
- 1つの画像から最低でも3〜5問のオリジナル問題を作成すること`;

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
