import { ApiResponse } from "./types";

const API_BASE = "https://snapenglish.vercel.app";

/**
 * 画像（base64）を送信して解析結果を取得
 */
export async function analyzeImage(imageBase64: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64 }),
    });

    const data: ApiResponse = await response.json();
    return data;
  } catch {
    return {
      success: false,
      error: "API_ERROR",
    };
  }
}

/**
 * テキストを送信して解析結果を取得
 */
export async function analyzeText(text: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data: ApiResponse = await response.json();
    return data;
  } catch {
    return {
      success: false,
      error: "API_ERROR",
    };
  }
}
