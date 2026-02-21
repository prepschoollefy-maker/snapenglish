import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "./types";

// 著作権保護のため、1回のリクエストで解析する最大文数
const MAX_SENTENCES = 5;

const SYSTEM_PROMPT = `あなたは英語学習支援AIです。画像内の英文を読み取り、以下を提供してください。

1. 和訳：自然な日本語訳
2. 文構造（SVOC）：S, V, O, C, M を明示（例: "S(The boy) V(ran) M(to the store)"）
3. 修飾・節の説明：関係詞節、分詞構文、不定詞等があれば簡潔に解説
4. 重要語句：大学受験レベルの重要単語・熟語をピックアップし、日本語訳と補足を付ける

制約:
- 入力テキストの翻訳・解析のみを行うこと
- 大量の原文を再掲載しないこと
- 文ごとに分けて出力すること
- 高校生・大学受験生にとって分かりやすい説明を心がけること
- 画像内に${MAX_SENTENCES}文を超える英文がある場合は、最初の${MAX_SENTENCES}文のみを解析すること（著作権保護のため）

出力形式: 以下のJSON形式のみ出力してください。JSON以外のテキストは一切出力しないでください。

{
  "sentences": [
    {
      "id": 1,
      "original": "元の英文（1文）",
      "translation": "自然な日本語訳",
      "structure": "S(主語) V(動詞) O(目的語) C(補語) M(修飾語) の形式",
      "clauses": "節・修飾の説明（なければ省略可）"
    }
  ],
  "key_phrases": [
    {
      "id": 1,
      "english": "英単語 or 熟語",
      "japanese": "日本語の意味",
      "note": "補足（品詞、用法など。なければ省略可）"
    }
  ]
}

注意事項:
- 英文が見つからない場合は sentences を空配列にする
- 重要語句が見つからない場合は key_phrases を空配列にする
- 画像が不鮮明で読み取れない場合は、読み取れた部分だけ出力すること`;

/**
 * AIレスポンスからJSONを抽出してパースする
 */
function parseAiResponse(text: string): AnalysisResult {
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

    if (!parsed.sentences || !Array.isArray(parsed.sentences)) {
        parsed.sentences = [];
    }
    if (!parsed.key_phrases || !Array.isArray(parsed.key_phrases)) {
        parsed.key_phrases = [];
    }

    // 著作権保護: サーバー側でも文数を制限
    if (parsed.sentences.length > MAX_SENTENCES) {
        parsed.sentences = parsed.sentences.slice(0, MAX_SENTENCES);
    }

    return parsed as AnalysisResult;
}

/**
 * 画像をGemini APIに送信して解析結果を返す
 * パース失敗時は最大2回リトライ
 */
export async function analyzeImage(
    imageBase64: string
): Promise<AnalysisResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL || "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
    });

    // base64のdata URL部分を分離
    const base64Data = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;

    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const result = await model.generateContent([
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Data,
                    },
                },
                { text: "この画像内の英文を読み取り、和訳とSVOC構造解析を行ってください。" },
            ]);

            const response = result.response;
            const text = response.text();

            if (!text) {
                throw new Error("Empty response from AI");
            }

            const parsed = parseAiResponse(text);

            if (parsed.sentences.length === 0 && parsed.key_phrases.length === 0) {
                throw new Error("NO_TEXT_FOUND");
            }

            return parsed;
        } catch (error) {
            if (error instanceof Error && error.message === "NO_TEXT_FOUND") {
                throw error;
            }

            // Gemini APIのエラーハンドリング
            if (error instanceof Error) {
                const msg = error.message.toLowerCase();
                if (msg.includes("429") || msg.includes("resource exhausted") || msg.includes("rate limit")) {
                    throw new Error("RATE_LIMITED");
                }
                if (msg.includes("401") || msg.includes("403") || msg.includes("api key") || msg.includes("permission")) {
                    throw new Error("SERVICE_UNAVAILABLE");
                }
            }

            if (attempt === maxRetries - 1) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    throw new Error("API_ERROR");
}
