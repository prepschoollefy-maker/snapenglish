"use client";

import React, { useState } from "react";
import { Sentence } from "@/lib/types";

interface SentenceCardProps {
    sentence: Sentence;
    mode: "jp_to_en" | "en_to_jp";
    showAnswer: boolean;
    onToggle: () => void;
}

export default function SentenceCard({
    sentence,
    mode,
    showAnswer,
    onToggle,
}: SentenceCardProps) {
    const question = mode === "jp_to_en" ? sentence.japanese : sentence.english;
    const answer = mode === "jp_to_en" ? sentence.english : sentence.japanese;

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            {/* 文法ポイント */}
            <div className="mb-2">
                <span className="inline-block text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full px-2.5 py-0.5">
                    {sentence.grammar_point}
                </span>
            </div>

            {/* 問題番号 + 出題 */}
            <div className="mb-3">
                <span className="text-blue-400 text-sm font-bold mr-2">
                    Q{sentence.id}.
                </span>
                <span className="text-white/90 text-base leading-relaxed">
                    {question}
                </span>
            </div>

            {/* 正解表示エリア */}
            {showAnswer ? (
                <div className="mt-3">
                    <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">✅</span>
                            <p className="text-emerald-300 text-base leading-relaxed font-medium">
                                {answer}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        className="mt-2 text-sm text-white/40 hover:text-white/60 transition-colors flex items-center gap-1 mx-auto"
                    >
                        🔒 正解を隠す
                    </button>
                </div>
            ) : (
                <button
                    onClick={onToggle}
                    className="mt-2 w-full py-2.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                    👁️ 正解を見る
                </button>
            )}
        </div>
    );
}
