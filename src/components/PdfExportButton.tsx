"use client";

import React, { useState } from "react";
import type { AnalysisResult, PracticeMode, VocabDirection } from "@/lib/types";

interface PdfExportButtonProps {
  data: AnalysisResult;
  mode: PracticeMode;
  vocabDirection: VocabDirection;
}

export default function PdfExportButton({
  data,
  mode,
  vocabDirection,
}: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      const { generateStudySheetPdf } = await import("@/lib/generatePdf");
      await generateStudySheetPdf({ data, mode, vocabDirection });
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF の生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className="text-xs text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
    >
      {isGenerating ? "PDF作成中..." : "PDF保存"}
    </button>
  );
}
