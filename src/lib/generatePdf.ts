import jsPDF from "jspdf";
import type {
  AnalysisResult,
  PracticeMode,
  VocabDirection,
  VocabularyItem,
} from "@/lib/types";

// ── Layout constants ────────────────────────────────────────────
const PAGE_W = 210; // A4 width in mm
const PAGE_H = 297; // A4 height in mm
const M = { top: 18, bottom: 18, left: 18, right: 18 } as const;
const CW = PAGE_W - M.left - M.right; // content width = 174mm
const WRITING_LINE_GAP = 9; // gap between writing lines

const POS_LABELS: Record<string, string> = {
  noun: "名詞",
  verb: "動詞",
  adjective: "形容詞",
  adverb: "副詞",
  phrase: "熟語",
  other: "その他",
};

const COLORS = {
  text: [26, 26, 26] as const,
  blue: [37, 99, 235] as const,
  emerald: [5, 150, 105] as const,
  gray: [156, 163, 175] as const,
  grayLight: [229, 231, 235] as const,
  grayDivider: [209, 213, 219] as const,
};

// ── Public API ──────────────────────────────────────────────────
export interface PdfExportOptions {
  data: AnalysisResult;
  mode: PracticeMode;
  vocabDirection?: VocabDirection;
}

export async function generateStudySheetPdf(
  options: PdfExportOptions
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  await registerFont(doc);

  let y: number = M.top;
  const dateStr = formatDate();

  // ── Header ─────────────────────────────────────────────
  y = drawHeader(doc, y, dateStr);

  if (options.mode === "vocabulary") {
    // Vocabulary-only sheet
    const dir = options.vocabDirection ?? "en_to_jp";
    const dirLabel = dir === "en_to_jp" ? "英→日" : "日→英";
    y = drawSectionTitle(doc, y, `単語テスト (${dirLabel})`);
    y = drawVocabTable(doc, y, options.data.vocabulary, dir);

    y = drawCutLine(doc, y);

    y = drawAnswerHeader(doc, y);
    y = drawVocabAnswers(doc, y, options.data.vocabulary, dir);
  } else {
    // Sentence mode (jp_to_en or en_to_jp)
    const isJpToEn = options.mode === "jp_to_en";
    const title = isJpToEn ? "日→英 英作文練習" : "英→日 和訳練習";
    const subtitle = isJpToEn
      ? "次の日本語を英語に訳しましょう。"
      : "次の英語を日本語に訳しましょう。";

    y = drawSectionTitle(doc, y, title);
    y = drawSubtitle(doc, y, subtitle);

    // Questions with writing lines
    for (const s of options.data.sentences) {
      const questionText = isJpToEn ? s.japanese : s.english;
      y = drawSentenceQuestion(doc, y, s.id, questionText);
    }

    // If vocabulary exists, add vocabulary section too
    if (options.data.vocabulary.length > 0) {
      y = ensureSpace(doc, y, 40);
      y += 4;
      const dir = options.vocabDirection ?? "en_to_jp";
      const dirLabel = dir === "en_to_jp" ? "英→日" : "日→英";
      y = drawSectionTitle(doc, y, `単語テスト (${dirLabel})`);
      y = drawVocabTable(doc, y, options.data.vocabulary, dir);
    }

    // Cut line + Answers
    y = drawCutLine(doc, y);

    y = drawAnswerHeader(doc, y);
    for (const s of options.data.sentences) {
      const answerText = isJpToEn ? s.english : s.japanese;
      y = drawAnswerLine(doc, y, s.id, answerText);
    }

    if (options.data.vocabulary.length > 0) {
      y = ensureSpace(doc, y, 12);
      y += 2;
      const dir = options.vocabDirection ?? "en_to_jp";
      doc.setFont("NotoSansJP", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.emerald);
      doc.text("[ 単語解答 ]", M.left, y);
      y += 5;
      y = drawVocabAnswers(doc, y, options.data.vocabulary, dir);
    }
  }

  // ── Page numbers ───────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  // ── Download ───────────────────────────────────────────
  doc.save(`snapenglish-${options.mode}-${dateStr}.pdf`);
}

// ── Font Registration ───────────────────────────────────────────
let fontBase64Cache: string | null = null;

async function registerFont(doc: jsPDF): Promise<void> {
  if (!fontBase64Cache) {
    const res = await fetch("/fonts/NotoSansJP-Regular.ttf");
    const buf = await res.arrayBuffer();
    fontBase64Cache = arrayBufferToBase64(buf);
  }

  doc.addFileToVFS("NotoSansJP-Regular.ttf", fontBase64Cache);
  doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
  doc.setFont("NotoSansJP", "normal");
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

// ── Drawing helpers ─────────────────────────────────────────────

function drawHeader(doc: jsPDF, y: number, dateStr: string): number {
  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.text);
  doc.text("SnapEnglish 練習シート", M.left, y);

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.text(dateStr, PAGE_W - M.right, y, { align: "right" });

  y += 3;
  doc.setDrawColor(...COLORS.grayDivider);
  doc.setLineWidth(0.5);
  doc.line(M.left, y, PAGE_W - M.right, y);
  y += 8;

  return y;
}

function drawSectionTitle(doc: jsPDF, y: number, title: string): number {
  y = ensureSpace(doc, y, 12);
  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.blue);
  doc.text(title, M.left, y);
  y += 8;
  return y;
}

function drawSubtitle(doc: jsPDF, y: number, text: string): number {
  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.text(text, M.left, y);
  y += 6;
  return y;
}

function drawSentenceQuestion(
  doc: jsPDF,
  y: number,
  num: number,
  text: string
): number {
  // Estimate total height needed: question text + 2 writing lines
  const textLines = doc.splitTextToSize(text, CW - 12);
  const textHeight = textLines.length * 5;
  const totalNeeded = textHeight + WRITING_LINE_GAP * 2 + 6;

  y = ensureSpace(doc, y, totalNeeded);

  // Question number + text
  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.blue);
  doc.text(`Q${num}.`, M.left, y);

  doc.setTextColor(...COLORS.text);
  doc.text(textLines, M.left + 12, y);
  y += textHeight + 2;

  // Writing lines
  doc.setDrawColor(...COLORS.grayLight);
  doc.setLineWidth(0.3);
  for (let i = 0; i < 2; i++) {
    y += WRITING_LINE_GAP;
    doc.line(M.left + 12, y, PAGE_W - M.right, y);
  }
  y += 6;

  return y;
}

function drawVocabTable(
  doc: jsPDF,
  y: number,
  items: VocabularyItem[],
  direction: VocabDirection
): number {
  const colWidths = { prompt: CW * 0.4, pos: CW * 0.15, answer: CW * 0.45 };
  const rowH = 8;
  const headerLabels =
    direction === "en_to_jp"
      ? ["英語", "品詞", "日本語"]
      : ["日本語", "品詞", "英語"];

  // Table header
  y = ensureSpace(doc, y, rowH * 2);
  doc.setFillColor(240, 242, 245);
  doc.rect(M.left, y - 5, CW, rowH, "F");

  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);

  let x = M.left + 3;
  doc.text(headerLabels[0], x, y);
  x += colWidths.prompt;
  doc.text(headerLabels[1], x, y);
  x += colWidths.pos;
  doc.text(headerLabels[2], x, y);
  y += rowH - 2;

  // Divider under header
  doc.setDrawColor(...COLORS.grayDivider);
  doc.setLineWidth(0.3);
  doc.line(M.left, y, PAGE_W - M.right, y);
  y += 1;

  // Table rows
  for (const item of items) {
    y = ensureSpace(doc, y, rowH + 2);

    const prompt =
      direction === "en_to_jp" ? item.english : item.japanese;
    const posLabel = POS_LABELS[item.pos] || item.pos;

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    x = M.left + 3;
    doc.text(prompt, x, y + 4);

    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    x += colWidths.prompt;
    doc.text(posLabel, x, y + 4);

    // Blank answer line
    x += colWidths.pos;
    doc.setDrawColor(...COLORS.grayLight);
    doc.setLineWidth(0.3);
    doc.line(x, y + 5, x + colWidths.answer - 6, y + 5);

    y += rowH + 1;

    // Light row divider
    doc.setDrawColor(240, 242, 245);
    doc.setLineWidth(0.2);
    doc.line(M.left, y, PAGE_W - M.right, y);
    y += 1;
  }

  return y;
}

function drawCutLine(doc: jsPDF, y: number): number {
  y = ensureSpace(doc, y, 14);
  y += 4;

  doc.setDrawColor(...COLORS.grayDivider);
  doc.setLineWidth(0.3);

  // Dashed line with scissors symbol
  const x1 = M.left;
  const x2 = PAGE_W - M.right;
  const dashLen = 4;
  const gapLen = 2;

  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text("✂", x1, y + 1);

  let cx = x1 + 8;
  while (cx < x2) {
    const end = Math.min(cx + dashLen, x2);
    doc.line(cx, y, end, y);
    cx += dashLen + gapLen;
  }

  y += 10;
  return y;
}

function drawAnswerHeader(doc: jsPDF, y: number): number {
  y = ensureSpace(doc, y, 10);
  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.emerald);
  doc.text("解答", M.left, y);
  y += 8;
  return y;
}

function drawAnswerLine(
  doc: jsPDF,
  y: number,
  num: number,
  text: string
): number {
  const textLines = doc.splitTextToSize(text, CW - 12);
  const lineHeight = textLines.length * 4.5;
  y = ensureSpace(doc, y, lineHeight + 2);

  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.emerald);
  doc.text(`Q${num}.`, M.left, y);

  doc.setTextColor(...COLORS.text);
  doc.text(textLines, M.left + 12, y);
  y += lineHeight + 2;

  return y;
}

function drawVocabAnswers(
  doc: jsPDF,
  y: number,
  items: VocabularyItem[],
  direction: VocabDirection
): number {
  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(9);

  for (const item of items) {
    y = ensureSpace(doc, y, 6);

    const prompt =
      direction === "en_to_jp" ? item.english : item.japanese;
    const answer =
      direction === "en_to_jp" ? item.japanese : item.english;

    doc.setTextColor(...COLORS.text);
    doc.text(`${prompt}  =  ${answer}`, M.left + 4, y);
    y += 5;
  }

  return y;
}

function drawFooter(doc: jsPDF, page: number, total: number): void {
  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.gray);
  doc.text("SnapEnglish", M.left, PAGE_H - 10);
  doc.text(`${page} / ${total}`, PAGE_W - M.right, PAGE_H - 10, {
    align: "right",
  });
}

// ── Utilities ───────────────────────────────────────────────────

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - M.bottom) {
    doc.addPage();
    return M.top;
  }
  return y;
}

function formatDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
