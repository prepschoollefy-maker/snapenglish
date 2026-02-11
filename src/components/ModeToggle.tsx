"use client";

import React from "react";
import { PracticeMode } from "@/lib/types";

interface ModeToggleProps {
    mode: PracticeMode;
    onModeChange: (mode: PracticeMode) => void;
    hasVocabulary: boolean;
}

const TABS: { mode: PracticeMode; label: string; emoji: string }[] = [
    { mode: "jp_to_en", label: "日→英", emoji: "✍️" },
    { mode: "en_to_jp", label: "英→日", emoji: "📖" },
    { mode: "vocabulary", label: "単語", emoji: "📝" },
];

export default function ModeToggle({
    mode,
    onModeChange,
    hasVocabulary,
}: ModeToggleProps) {
    const visibleTabs = hasVocabulary ? TABS : TABS.filter((t) => t.mode !== "vocabulary");

    return (
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
            {visibleTabs.map((tab) => (
                <button
                    key={tab.mode}
                    onClick={() => onModeChange(tab.mode)}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${mode === tab.mode
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            : "text-white/60 hover:text-white/80 hover:bg-white/5"
                        }`}
                >
                    <span>{tab.emoji}</span>
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
