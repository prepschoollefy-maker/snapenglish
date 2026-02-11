"use client";

import React, { useState } from "react";
import { AnalysisResult, PracticeMode, VocabDirection } from "@/lib/types";
import ModeToggle from "./ModeToggle";
import SentenceCard from "./SentenceCard";
import VocabularyCard from "./VocabularyCard";

interface PracticeViewProps {
    data: AnalysisResult;
    onBack: () => void;
    onNewPhoto: () => void;
}

export default function PracticeView({
    data,
    onBack,
    onNewPhoto,
}: PracticeViewProps) {
    const [mode, setMode] = useState<PracticeMode>("jp_to_en");
    const [vocabDirection, setVocabDirection] = useState<VocabDirection>("en_to_jp");
    const [revealedSentences, setRevealedSentences] = useState<Set<number>>(new Set());
    const [revealedVocab, setRevealedVocab] = useState<Set<number>>(new Set());

    const hasVocabulary = data.vocabulary.length > 0;
    const hasSentences = data.sentences.length > 0;

    const toggleSentence = (id: number) => {
        setRevealedSentences((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleVocab = (id: number) => {
        setRevealedVocab((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const showAll = () => {
        if (mode === "vocabulary") {
            setRevealedVocab(new Set(data.vocabulary.map((v) => v.id)));
        } else {
            setRevealedSentences(new Set(data.sentences.map((s) => s.id)));
        }
    };

    const hideAll = () => {
        if (mode === "vocabulary") {
            setRevealedVocab(new Set());
        } else {
            setRevealedSentences(new Set());
        }
    };

    const modeLabel =
        mode === "jp_to_en"
            ? "✍️ 日→英 英作文モード"
            : mode === "en_to_jp"
                ? "📖 英→日 和訳モード"
                : "📝 単語テストモード";

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            {/* ヘッダー */}
            <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="text-white/70 hover:text-white transition-colors flex items-center gap-1 text-sm"
                    >
                        ← 戻る
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={showAll}
                            className="text-xs text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
                        >
                            全て表示
                        </button>
                        <button
                            onClick={hideAll}
                            className="text-xs text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
                        >
                            全て隠す
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-4 pb-24">
                {/* モード切替タブ */}
                <ModeToggle
                    mode={mode}
                    onModeChange={(m) => {
                        setMode(m);
                        setRevealedSentences(new Set());
                        setRevealedVocab(new Set());
                    }}
                    hasVocabulary={hasVocabulary}
                />

                {/* モード名 */}
                <p className="text-white/50 text-sm mt-4 mb-4">{modeLabel}</p>

                {/* 単語テスト時の方向切替 */}
                {mode === "vocabulary" && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setVocabDirection("en_to_jp")}
                            className={`text-sm px-4 py-2 rounded-lg transition-all ${vocabDirection === "en_to_jp"
                                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                    : "text-white/40 hover:text-white/60 border border-white/10"
                                }`}
                        >
                            英→日
                        </button>
                        <button
                            onClick={() => setVocabDirection("jp_to_en")}
                            className={`text-sm px-4 py-2 rounded-lg transition-all ${vocabDirection === "jp_to_en"
                                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                    : "text-white/40 hover:text-white/60 border border-white/10"
                                }`}
                        >
                            日→英
                        </button>
                    </div>
                )}

                {/* 問題リスト */}
                <div className="flex flex-col gap-3">
                    {mode !== "vocabulary" && hasSentences && (
                        data.sentences.map((sentence) => (
                            <SentenceCard
                                key={sentence.id}
                                sentence={sentence}
                                mode={mode}
                                showAnswer={revealedSentences.has(sentence.id)}
                                onToggle={() => toggleSentence(sentence.id)}
                            />
                        ))
                    )}

                    {mode !== "vocabulary" && !hasSentences && (
                        <div className="text-center text-white/40 py-10">
                            英文が見つかりませんでした
                        </div>
                    )}

                    {mode === "vocabulary" && hasVocabulary && (
                        data.vocabulary.map((item) => (
                            <VocabularyCard
                                key={item.id}
                                item={item}
                                direction={vocabDirection}
                                showAnswer={revealedVocab.has(item.id)}
                                onToggle={() => toggleVocab(item.id)}
                            />
                        ))
                    )}

                    {mode === "vocabulary" && !hasVocabulary && (
                        <div className="text-center text-white/40 py-10">
                            単語が見つかりませんでした
                        </div>
                    )}
                </div>
            </main>

            {/* フッター */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-4">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={onNewPhoto}
                        className="w-full py-3 bg-white/10 hover:bg-white/15 text-white/80 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        📷 別のページを撮影
                    </button>
                </div>
            </div>
        </div>
    );
}
