"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnalysisResult, HistoryItem, ApiResponse } from "@/lib/types";
import { compressForApi, compressForThumbnail } from "@/lib/image";
import { getHistory, addHistory, clearAllHistory } from "@/lib/storage";
import CameraButton from "@/components/CameraButton";
import LoadingScreen from "@/components/LoadingScreen";
import ResultView from "@/components/ResultView";
import HistoryList from "@/components/HistoryList";

type AppState = "home" | "loading" | "result" | "error";

interface ErrorInfo {
  type: "NO_TEXT_FOUND" | "API_ERROR" | "PARSE_ERROR" | "TEXT_TOO_LONG";
  message: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  NO_TEXT_FOUND: "英語のテキストが見つかりませんでした",
  API_ERROR: "通信エラーが発生しました",
  PARSE_ERROR: "データの解析に失敗しました",
  TEXT_TOO_LONG: "画像が大きすぎます。もう少し小さい画像をお試しください",
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("home");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [saved, setSaved] = useState(false);

  // 履歴をロード（期限切れ自動清掃含む）
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleSave = useCallback(() => {
    if (!result || saved) return;
    const now = new Date();
    const label = `解析 ${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const historyItem: HistoryItem = {
      id: crypto.randomUUID(),
      created_at: now.toISOString(),
      thumbnail,
      label,
      data: result,
    };
    addHistory(historyItem);
    setHistory(getHistory());
    setSaved(true);
  }, [result, saved, thumbnail]);

  const handleImageSelected = async (file: File) => {
    try {
      setAppState("loading");
      setError(null);
      setSaved(false);

      const [apiImage, thumbImage] = await Promise.all([
        compressForApi(file),
        compressForThumbnail(file),
      ]);
      setThumbnail(thumbImage);

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
      setAppState("result");
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
    setSaved(true); // 履歴から開いた場合は既に保存済み
    setAppState("result");
  };

  const handleClearAll = () => {
    clearAllHistory();
    setHistory([]);
  };

  const handleBackToHome = () => {
    setAppState("home");
    setResult(null);
    setError(null);
    setSaved(false);
    setHistory(getHistory());
  };

  // ── ローディング画面 ──
  if (appState === "loading") {
    return <LoadingScreen thumbnail={thumbnail} />;
  }

  // ── 結果画面 ──
  if (appState === "result" && result) {
    return (
      <ResultView
        data={result}
        onBack={handleBackToHome}
        onNewPhoto={handleBackToHome}
        onSave={handleSave}
        saved={saved}
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
            英文の和訳・構造解析ツール
          </p>
        </div>

        {/* 撮影・選択ボタン */}
        <div className="w-full mb-4">
          <CameraButton onImageSelected={handleImageSelected} />
        </div>

        {/* 注意書き */}
        <div className="w-full mb-8 px-2">
          <ul className="text-white/30 text-xs leading-relaxed space-y-1">
            <li>・自分で読むための学習用途で使ってください。結果の転載・配布はしないでください。</li>
            <li>・利用権限のある文章のみを入力してください。</li>
            <li>・長文は分割して撮影してください（1〜数文が目安）。</li>
          </ul>
        </div>

        {/* 履歴リスト */}
        <div className="w-full flex-1">
          <HistoryList
            items={history}
            onSelect={handleHistorySelect}
            onClearAll={handleClearAll}
          />
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
