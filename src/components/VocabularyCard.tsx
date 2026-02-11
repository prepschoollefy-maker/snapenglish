"use client";

import React from "react";
import { VocabularyItem, VocabDirection } from "@/lib/types";

interface VocabularyCardProps {
    item: VocabularyItem;
    direction: VocabDirection;
    showAnswer: boolean;
    onToggle: () => void;
}

const POS_LABELS: Record<string, string> = {
    noun: "名詞",
    verb: "動詞",
    adjective: "形容詞",
    adverb: "副詞",
    phrase: "熟語",
    other: "その他",
};

export default function VocabularyCard({
    item,
    direction,
    showAnswer,
    onToggle,
}: VocabularyCardProps) {
    const question = direction === "en_to_jp" ? item.english : item.japanese;
    const answer = direction === "en_to_jp" ? item.japanese : item.english;

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            {/* 問題番号 + 品詞 + 出題 */}
            <div className="mb-3 flex items-start gap-2">
                <span className="text-purple-400 text-sm font-bold">
                    {item.id}.
                </span>
                <div>
                    <span className="text-white/90 text-base font-medium">{question}</span>
                    <span className="ml-2 text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                        {POS_LABELS[item.pos] || item.pos}
                    </span>
                </div>
            </div>

            {/* 正解表示エリア */}
            {showAnswer ? (
                <div className="mt-3">
                    <div className="bg-purple-500/15 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                            <span className="text-purple-400 mt-0.5">✅</span>
                            <p className="text-purple-300 text-base leading-relaxed font-medium">
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
                    className="mt-2 w-full py-2.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                    👁️ 正解を見る
                </button>
            )}
        </div>
    );
}
