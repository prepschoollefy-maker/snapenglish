"use client";

import React, { useRef } from "react";

interface CameraButtonProps {
    onImageSelected: (file: File) => void;
    disabled?: boolean;
}

export default function CameraButton({
    onImageSelected,
    disabled,
}: CameraButtonProps) {
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const albumInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelected(file);
        }
        // 同じファイルを再選択できるようにリセット
        e.target.value = "";
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* 撮影ボタン（メインCTA） */}
            <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={disabled}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                <span className="text-2xl">📷</span>
                英語を撮影する
            </button>

            {/* 画像選択ボタン（サブ） */}
            <button
                onClick={() => albumInputRef.current?.click()}
                disabled={disabled}
                className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white/90 text-base font-medium rounded-2xl border border-white/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                <span className="text-xl">🖼️</span>
                画像を選択する
            </button>

            {/* 隠しinput: カメラ */}
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* 隠しinput: アルバム */}
            <input
                ref={albumInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
