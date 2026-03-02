import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";

import { AnalysisResult, HistoryItem } from "../lib/types";
import { analyzeImage, analyzeText } from "../lib/api";
import { compressForApi, compressForThumbnail } from "../lib/image";
import { getHistory, addHistory, clearAllHistory } from "../lib/storage";

import CameraButton from "../components/CameraButton";
import TextInputBox from "../components/TextInputBox";
import LoadingScreen from "../components/LoadingScreen";
import ResultView from "../components/ResultView";
import SentenceSelector from "../components/SentenceSelector";
import HistoryList from "../components/HistoryList";

type AppState = "home" | "loading" | "selecting" | "result" | "error";

interface ErrorInfo {
  type: string;
  message: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  NO_TEXT_FOUND: "英語のテキストが見つかりませんでした",
  API_ERROR: "通信エラーが発生しました",
  PARSE_ERROR: "データの解析に失敗しました",
  TEXT_TOO_LONG: "入力が長すぎます。1〜3文程度に分割してお試しください",
  RATE_LIMITED: "リクエスト回数の上限に達しました。1分ほど待ってからお試しください",
  SERVICE_UNAVAILABLE: "現在サービスがメンテナンス中です（E-50）。しばらくお待ちください",
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState<AppState>("home");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fullResult, setFullResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [saved, setSaved] = useState(false);
  const [loadingMode, setLoadingMode] = useState<"image" | "text">("image");

  // 履歴をロード
  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  const refreshHistory = useCallback(async () => {
    const items = await getHistory();
    setHistory(items);
  }, []);

  const handleSave = useCallback(async () => {
    if (!result || saved) return;
    const now = new Date();
    const label = `解析 ${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const historyItem: HistoryItem = {
      id: Crypto.randomUUID(),
      created_at: now.toISOString(),
      thumbnail,
      label,
      data: result,
    };
    await addHistory(historyItem);
    await refreshHistory();
    setSaved(true);
  }, [result, saved, thumbnail, refreshHistory]);

  const handleImageSelected = async (uri: string) => {
    try {
      setLoadingMode("image");
      setAppState("loading");
      setError(null);
      setSaved(false);

      const [apiImage, thumbImage] = await Promise.all([
        compressForApi(uri),
        compressForThumbnail(uri),
      ]);
      setThumbnail(thumbImage);

      const data = await analyzeImage(apiImage);

      if (!data.success || !data.data) {
        const errorType = data.error || "API_ERROR";
        setError({
          type: errorType,
          message: ERROR_MESSAGES[errorType] || "エラーが発生しました",
        });
        setAppState("error");
        return;
      }

      setFullResult(data.data);
      setAppState("selecting");
    } catch {
      setError({
        type: "API_ERROR",
        message: "通信エラーが発生しました。もう一度お試しください。",
      });
      setAppState("error");
    }
  };

  const handleTextSubmit = async (text: string) => {
    try {
      setLoadingMode("text");
      setAppState("loading");
      setError(null);
      setSaved(false);
      setThumbnail("");

      const data = await analyzeText(text);

      if (!data.success || !data.data) {
        const errorType = data.error || "API_ERROR";
        setError({
          type: errorType,
          message: ERROR_MESSAGES[errorType] || "エラーが発生しました",
        });
        setAppState("error");
        return;
      }

      setFullResult(data.data);
      setAppState("selecting");
    } catch {
      setError({
        type: "API_ERROR",
        message: "通信エラーが発生しました。もう一度お試しください。",
      });
      setAppState("error");
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResult(item.data);
    setSaved(true);
    setAppState("result");
  };

  const handleClearAll = () => {
    Alert.alert("履歴を削除", "全ての履歴を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          await clearAllHistory();
          setHistory([]);
        },
      },
    ]);
  };

  const handleSelectionConfirm = useCallback(
    (selectedIds: number[]) => {
      if (!fullResult) return;
      const selectedSet = new Set(selectedIds);
      const filtered: AnalysisResult = {
        sentences: fullResult.sentences.filter((s) => selectedSet.has(s.id)),
        key_phrases: fullResult.key_phrases,
      };
      setResult(filtered);
      setFullResult(null);
      setAppState("result");
    },
    [fullResult]
  );

  const handleBackToHome = async () => {
    setAppState("home");
    setResult(null);
    setFullResult(null);
    setError(null);
    setSaved(false);
    await refreshHistory();
  };

  // ── ローディング画面 ──
  if (appState === "loading") {
    return <LoadingScreen thumbnail={thumbnail} mode={loadingMode} />;
  }

  // ── 文選択画面 ──
  if (appState === "selecting" && fullResult) {
    return (
      <SentenceSelector
        sentences={fullResult.sentences}
        onConfirm={handleSelectionConfirm}
      />
    );
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
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorEmoji}>😥</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          {error.type === "NO_TEXT_FOUND" && (
            <Text style={styles.errorHint}>
              英語のテキストが写った画像を撮影してください
            </Text>
          )}
          <Pressable
            onPress={handleBackToHome}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.retryButtonText}>もう一度撮影する</Text>
          </Pressable>
          <Pressable onPress={handleBackToHome}>
            <Text style={styles.backLinkText}>トップに戻る</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── トップ画面（ホーム） ──
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.homeContent,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ロゴ・タイトル */}
      <View style={styles.logoSection}>
        <Text style={styles.logoText}>SnapEnglish</Text>
        <Text style={styles.subtitleText}>英文の和訳・構造解析ツール</Text>
      </View>

      {/* 撮影・選択ボタン */}
      <View style={styles.section}>
        <CameraButton onImageSelected={handleImageSelected} />
      </View>
      <Text style={styles.hintText}>
        ※ 1〜3文を切り取って撮影してください（ページ丸ごとはNG）
      </Text>

      {/* 区切り線 */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>または</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* テキスト入力 */}
      <View style={styles.section}>
        <TextInputBox onSubmit={handleTextSubmit} />
      </View>

      {/* 注意書き */}
      <View style={styles.noticeSection}>
        <Text style={styles.noticeText}>
          ・自分で読むための学習用途で使ってください。結果の転載・配布はしないでください。
        </Text>
        <Text style={styles.noticeText}>
          ・利用権限のある文章のみを入力してください。
        </Text>
        <Text style={styles.noticeText}>
          ・長文は1〜3文ずつに分割してください。
        </Text>
        <View style={styles.noticeDivider} />
        <Text style={styles.privacyNote}>
          入力された画像・テキスト・解析結果はサーバーに保存されません（処理後に破棄されます）。共有機能はありません。
        </Text>
      </View>

      {/* 履歴リスト */}
      <HistoryList
        items={history}
        onSelect={handleHistorySelect}
        onClearAll={handleClearAll}
      />

      {/* フッター */}
      <View style={styles.footer}>
        <View style={styles.footerLinks}>
          <Link href="/terms" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.footerLinkText}>利用規約</Text>
            </Pressable>
          </Link>
          <Link href="/privacy" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.footerLinkText}>プライバシー</Text>
            </Pressable>
          </Link>
          <Link href="/contact" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.footerLinkText}>お問い合わせ</Text>
            </Pressable>
          </Link>
        </View>
        <Text style={styles.copyrightText}>
          © 2026 SnapEnglish - Powered by AI
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  homeContent: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logoSection: {
    marginTop: 32,
    marginBottom: 40,
    alignItems: "center",
  },
  logoText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#60a5fa",
  },
  subtitleText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    marginTop: 8,
  },
  section: {
    width: "100%",
    marginBottom: 4,
  },
  hintText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
  },
  noticeSection: {
    width: "100%",
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  noticeText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    lineHeight: 20,
  },
  noticeDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginTop: 12,
    marginBottom: 12,
  },
  privacyNote: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 12,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  footerLinks: {
    flexDirection: "row",
    gap: 16,
  },
  footerLinkText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
  },
  copyrightText: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 12,
  },
  // Error screen styles
  errorContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorCard: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    borderRadius: 16,
    padding: 32,
    maxWidth: 340,
    width: "100%",
    alignItems: "center",
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  errorMessage: {
    color: "#fca5a5",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  errorHint: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  backLinkText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    paddingVertical: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
