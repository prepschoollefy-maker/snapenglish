"use client";

import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
    thumbnail?: string;
}

const MESSAGES = [
    "画像をアップロード中...",
    "英文を読み取っています...",
    "問題を作成しています...",
];

export default function LoadingScreen({ thumbnail }: LoadingScreenProps) {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setMessageIndex((prev) => {
                if (prev < MESSAGES.length - 1) return prev + 1;
                return prev;
            });
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center z-50 px-6">
            {/* サムネイル */}
            {thumbnail && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-48 h-48">
                    <img
                        src={thumbnail}
                        alt="撮影画像"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* ローディングアニメーション */}
            <div className="mb-6 relative">
                <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
            </div>

            {/* ステータスメッセージ */}
            <p className="text-white/90 text-lg font-medium animate-pulse">
                {MESSAGES[messageIndex]}
            </p>

            {/* プログレスドット */}
            <div className="mt-6 flex gap-2">
                {MESSAGES.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= messageIndex ? "bg-blue-500 scale-100" : "bg-white/20 scale-75"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
