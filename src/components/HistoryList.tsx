"use client";

import React from "react";
import { HistoryItem } from "@/lib/types";

interface HistoryListProps {
    items: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

export default function HistoryList({ items, onSelect }: HistoryListProps) {
    if (items.length === 0) return null;

    return (
        <div className="w-full">
            <h2 className="text-white/50 text-sm font-medium mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-white/20" />
                最近の練習
                <span className="flex-1 h-px bg-white/20" />
            </h2>

            <div className="flex flex-col gap-2">
                {items.map((item) => {
                    const sentenceCount = item.data.sentences.length;
                    const vocabCount = item.data.vocabulary.length;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className="w-full text-left bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-all duration-200 border border-white/5 hover:border-white/10 flex items-center gap-3 group"
                        >
                            {/* サムネイル */}
                            {item.thumbnail && (
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                                    <img
                                        src={item.thumbnail}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="text-white/80 text-sm font-medium truncate group-hover:text-white transition-colors">
                                    📄 {item.label}
                                </p>
                                <p className="text-white/30 text-xs mt-0.5">
                                    {sentenceCount > 0 && `${sentenceCount}文`}
                                    {sentenceCount > 0 && vocabCount > 0 && " · "}
                                    {vocabCount > 0 && `${vocabCount}語`}
                                </p>
                            </div>

                            <span className="text-white/20 group-hover:text-white/40 transition-colors text-lg">
                                →
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
