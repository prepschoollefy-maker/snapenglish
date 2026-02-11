"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnalysisResult, HistoryItem, ApiResponse } from "@/lib/types";
import { compressForApi, compressForThumbnail } from "@/lib/image";
import { getHistory, addHistory } from "@/lib/storage";
import CameraButton from "@/components/CameraButton";
import LoadingScreen from "@/components/LoadingScreen";
import PracticeView from "@/components/PracticeView";
import HistoryList from "@/components/HistoryList";

type AppState = "home" | "loading" | "practice" | "error";

interface ErrorInfo {
  type: "NO_TEXT_FOUND" | "API_ERROR" | "PARSE_ERROR";
  message: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  NO_TEXT_FOUND: "英語のテキストが見つかりませんでした",
  API_ERROR: "通信エラーが発生しました",
  PARSE_ERROR: "データの解析に失敗しました",
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("home");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [error, setError] = useState<ErrorInfo | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  // 履歴をロード
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleImageSelected = async (file: File) => {
    try {
      setAppState("loading");
      setError(null);

      // 画像を圧縮
      const [apiImage, thumbImage] = await Promise.all([
        compressForApi(file),
        compressForThumbnail(file),
      ]);
      setThumbnail(thumbImage);

      // API呼び出し
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: apiImage }),
      });

      const data: ApiResponse = await response.json();

      if (!data.success || !data.data) {
        const errorType = data.error || "API_ERROR";
        setError({
          type: errorType,
          message: ERROR_MESSAGES[errorType] || "エラーが発生しました",
        });
        setAppState("error");
        return;
      }

      setResult(data.data);

      // 履歴に追加
      const now = new Date();
      const label = `撮影 ${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        created_at: now.toISOString(),
        thumbnail: thumbImage,
        label,
        data: data.data,
      };
      addHistory(historyItem);
      setHistory(getHistory());

      setAppState("practice");
    } catch (err) {
      console.error("Error processing image:", err);
      setError({
        type: "API_ERROR",
        message: "通信エラーが発生しました。もう一度お試しください。",
      });
      setAppState("error");
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResult(item.data);
    setAppState("practice");
  };

  const handleBackToHome = () => {
    setAppState("home");
    setResult(null);
    setError(null);
    setHistory(getHistory());
  };

  // ── ローディング画面 ──
  if (appState === "loading") {
    return <LoadingScreen thumbnail={thumbnail} />;
  }

  // ── 練習画面 ──
  if (appState === "practice" && result) {
    return (
      <PracticeView
        data={result}
        onBack={handleBackToHome}
        onNewPhoto={handleBackToHome}
      />
    );
  }

  // ── エラー画面 ──
  if (appState === "error" && error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-sm w-full text-center">
          <p className="text-4xl mb-4">😥</p>
          <p className="text-red-300 text-lg font-medium mb-2">
            {error.message}
          </p>
          {error.type === "NO_TEXT_FOUND" && (
            <p className="text-white/40 text-sm mb-6">
              英語のテキストが写った画像を撮影してください
            </p>
          )}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleBackToHome}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all font-medium"
            >
              もう一度撮影する
            </button>
            <button
              onClick={handleBackToHome}
              className="w-full py-3 text-white/50 hover:text-white/70 transition-all text-sm"
            >
              トップに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── トップ画面（ホーム） ──
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center px-6 max-w-lg mx-auto w-full">
        {/* ロゴ・タイトル */}
        <div className="mt-16 mb-10 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            SnapEnglish
          </h1>
          <p className="text-white/40 text-sm mt-2">
            撮って学ぶ英語練習アプリ
          </p>
        </div>

        {/* 撮影・選択ボタン */}
        <div className="w-full mb-8">
          <CameraButton
            onImageSelected={handleImageSelected}
            disabled={appState === "loading"}
          />
        </div>

        {/* 履歴リスト */}
        <div className="w-full flex-1">
          <HistoryList items={history} onSelect={handleHistorySelect} />
        </div>

        {/* フッター */}
        <footer className="py-6 text-center">
          <p className="text-white/20 text-xs">
            © 2026 SnapEnglish - Powered by AI
          </p>
        </footer>
      </main>
    </div>
  );
}
