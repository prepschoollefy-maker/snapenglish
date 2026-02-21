"use client";

import React, { useState } from "react";

interface TextInputProps {
    onSubmit: (text: string) => void;
    disabled?: boolean;
}

const MAX_LENGTH = 500;

export default function TextInput({ onSubmit, disabled }: TextInputProps) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        const trimmed = text.trim();
        if (trimmed.length === 0) return;
        onSubmit(trimmed);
        setText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white/10 rounded-2xl border border-white/20 p-4">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
                    onKeyDown={handleKeyDown}
                    placeholder="英文を入力してください..."
                    disabled={disabled}
                    rows={3}
                    className="w-full bg-transparent text-white/90 placeholder-white/30 text-base resize-none outline-none"
                />
                <div className="flex items-center justify-between mt-2">
                    <span className="text-white/30 text-xs">
                        {text.length}/{MAX_LENGTH}
                    </span>
                    <button
                        onClick={handleSubmit}
                        disabled={disabled || text.trim().length === 0}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        解析する
                    </button>
                </div>
            </div>
            <p className="text-white/20 text-xs mt-2 text-center">
                Ctrl+Enter でも送信できます
            </p>
        </div>
    );
}
