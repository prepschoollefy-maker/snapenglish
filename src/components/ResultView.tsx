"use client";

import React from "react";
import { AnalysisResult } from "@/lib/types";

interface ResultViewProps {
    data: AnalysisResult;
    onBack: () => void;
    onNewPhoto: () => void;
    onSave: () => void;
    saved: boolean;
}

export default function ResultView({
    data,
    onBack,
    onNewPhoto,
    onSave,
    saved,
}: ResultViewProps) {
    const hasSentences = data.sentences.length > 0;
    const hasKeyPhrases = data.key_phrases.length > 0;

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
                    <button
                        onClick={onSave}
                        disabled={saved}
                        className={`text-sm px-4 py-1.5 rounded-lg transition-all ${
                            saved
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30"
                        }`}
                    >
                        {saved ? "保存済み" : "保存する"}
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-4 pb-24">
                {/* 文ごとの解析結果 */}
                {hasSentences && (
                    <section>
                        <h2 className="text-white/60 text-sm font-medium mb-3">
                            和訳・文構造解析
                        </h2>
                        <div className="flex flex-col gap-4">
                            {data.sentences.map((sentence) => (
                                <div
                                    key={sentence.id}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                                >
                                    {/* 原文 */}
                                    <p className="text-white/90 text-base font-medium leading-relaxed mb-3">
                                        {sentence.original}
                                    </p>

                                    {/* 和訳 */}
                                    <div className="mb-3">
                                        <span className="text-xs text-blue-400 font-medium">
                                            和訳
                                        </span>
                                        <p className="text-white/70 text-sm mt-1 leading-relaxed">
                                            {sentence.translation}
                                        </p>
                                    </div>

                                    {/* SVOC構造 */}
                                    <div className="mb-2">
                                        <span className="text-xs text-emerald-400 font-medium">
                                            文構造（SVOC）
                                        </span>
                                        <p className="text-white/60 text-sm mt-1 font-mono leading-relaxed bg-white/5 rounded-lg px-3 py-2">
                                            {sentence.structure}
                                        </p>
                                    </div>

                                    {/* 節・修飾の説明 */}
                                    {sentence.clauses && (
                                        <div>
                                            <span className="text-xs text-amber-400 font-medium">
                                                修飾・節の説明
                                            </span>
                                            <p className="text-white/50 text-sm mt-1 leading-relaxed">
                                                {sentence.clauses}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {!hasSentences && (
                    <div className="text-center text-white/40 py-10">
                        英文が見つかりませんでした
                    </div>
                )}

                {/* 重要語句セクション */}
                {hasKeyPhrases && (
                    <section className="mt-6">
                        <h2 className="text-white/60 text-sm font-medium mb-3">
                            重要語句
                        </h2>
                        <div className="flex flex-col gap-2">
                            {data.key_phrases.map((phrase) => (
                                <div
                                    key={phrase.id}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-start gap-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/90 text-sm font-medium">
                                            {phrase.english}
                                        </p>
                                        <p className="text-white/50 text-sm mt-0.5">
                                            {phrase.japanese}
                                        </p>
                                    </div>
                                    {phrase.note && (
                                        <span className="text-xs text-white/30 bg-white/5 rounded px-2 py-0.5 flex-shrink-0">
                                            {phrase.note}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* フッター */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-4">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={onNewPhoto}
                        className="w-full py-3 bg-white/10 hover:bg-white/15 text-white/80 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        別の画像を撮影
                    </button>
                </div>
            </div>
        </div>
    );
}
