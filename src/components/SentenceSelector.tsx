"use client";

import React, { useState } from "react";
import { SentenceAnalysis } from "@/lib/types";

interface SentenceSelectorProps {
    sentences: SentenceAnalysis[];
    onConfirm: (selectedIds: number[]) => void;
}

export default function SentenceSelector({
    sentences,
    onConfirm,
}: SentenceSelectorProps) {
    const [selected, setSelected] = useState<Set<number>>(
        () => new Set(sentences.map((s) => s.id))
    );

    const allSelected = selected.size === sentences.length;
    const noneSelected = selected.size === 0;

    const toggle = (id: number) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const selectAll = () => setSelected(new Set(sentences.map((s) => s.id)));
    const deselectAll = () => setSelected(new Set());

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-2xl mx-auto px-4 py-3">
                    <h1 className="text-white/90 text-base font-medium text-center">
                        解析する文を選択
                    </h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-4 pb-32">
                <p className="text-white/50 text-sm mb-4">
                    解析結果を表示する文を選んでください
                </p>

                {/* 全選択 / 全解除 */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={selectAll}
                        disabled={allSelected}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/15 disabled:opacity-30 transition-all"
                    >
                        全選択
                    </button>
                    <button
                        onClick={deselectAll}
                        disabled={noneSelected}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/15 disabled:opacity-30 transition-all"
                    >
                        全解除
                    </button>
                </div>

                {/* 文リスト */}
                <div className="flex flex-col gap-3">
                    {sentences.map((sentence) => {
                        const isSelected = selected.has(sentence.id);
                        return (
                            <button
                                key={sentence.id}
                                onClick={() => toggle(sentence.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                                    isSelected
                                        ? "bg-blue-500/10 border-blue-500/40"
                                        : "bg-white/5 border-white/10"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* チェックボックス */}
                                    <div
                                        className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                                            isSelected
                                                ? "bg-blue-500 border-blue-500"
                                                : "border-white/30 bg-transparent"
                                        }`}
                                    >
                                        {isSelected && (
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    {/* 原文 */}
                                    <p className="text-white/90 text-sm leading-relaxed">
                                        {sentence.original}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </main>

            {/* 確定ボタン */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-4">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => onConfirm(Array.from(selected))}
                        disabled={noneSelected}
                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl transition-all duration-200 font-medium text-sm"
                    >
                        {noneSelected
                            ? "文を選択してください"
                            : `解析結果を見る（${selected.size}文）`}
                    </button>
                </div>
            </div>
        </div>
    );
}
