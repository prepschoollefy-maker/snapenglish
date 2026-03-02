import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnalysisResult } from "../lib/types";

interface ResultViewProps {
  data: AnalysisResult;
  onBack: () => void;
  onNewPhoto: () => void;
  onSave: () => void;
  saved: boolean;
}

export default function ResultView({
  data,
  onBack,
  onNewPhoto,
  onSave,
  saved,
}: ResultViewProps) {
  const insets = useSafeAreaInsets();
  const hasSentences = data.sentences.length > 0;
  const hasKeyPhrases = data.key_phrases.length > 0;

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onBack} hitSlop={8}>
          <Text style={styles.backText}>← 戻る</Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          disabled={saved}
          style={[styles.saveButton, saved ? styles.saveButtonSaved : styles.saveButtonUnsaved]}
        >
          <Text style={[styles.saveText, saved ? styles.saveTextSaved : styles.saveTextUnsaved]}>
            {saved ? "保存済み" : "保存する"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 文ごとの解析結果 */}
        {hasSentences && (
          <View>
            <Text style={styles.sectionTitle}>和訳・文構造解析</Text>
            <View style={styles.sentenceList}>
              {data.sentences.map((sentence) => (
                <View key={sentence.id} style={styles.sentenceCard}>
                  {/* 原文 */}
                  <Text style={styles.originalText}>{sentence.original}</Text>

                  {/* 和訳 */}
                  <View style={styles.fieldBlock}>
                    <Text style={styles.labelBlue}>和訳</Text>
                    <Text style={styles.translationText}>
                      {sentence.translation}
                    </Text>
                  </View>

                  {/* SVOC構造 */}
                  <View style={styles.fieldBlock}>
                    <Text style={styles.labelGreen}>文構造（SVOC）</Text>
                    <View style={styles.structureBox}>
                      <Text style={styles.structureText}>
                        {sentence.structure}
                      </Text>
                    </View>
                  </View>

                  {/* 節・修飾の説明 */}
                  {sentence.clauses && (
                    <View style={styles.fieldBlock}>
                      <Text style={styles.labelAmber}>修飾・節の説明</Text>
                      <Text style={styles.clausesText}>
                        {sentence.clauses}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {!hasSentences && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>英文が見つかりませんでした</Text>
          </View>
        )}

        {/* 重要語句セクション */}
        {hasKeyPhrases && (
          <View style={styles.phrasesSection}>
            <Text style={styles.sectionTitle}>重要語句</Text>
            <View style={styles.phraseList}>
              {data.key_phrases.map((phrase) => (
                <View key={phrase.id} style={styles.phraseCard}>
                  <View style={styles.phraseContent}>
                    <Text style={styles.phraseEnglish}>{phrase.english}</Text>
                    <Text style={styles.phraseJapanese}>
                      {phrase.japanese}
                    </Text>
                  </View>
                  {phrase.note && (
                    <View style={styles.noteBadge}>
                      <Text style={styles.noteText}>{phrase.note}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* フッター */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          onPress={onNewPhoto}
          style={({ pressed }) => [
            styles.newPhotoButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.newPhotoText}>別の画像を撮影</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  backText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveButtonUnsaved: {
    backgroundColor: "rgba(59,130,246,0.2)",
    borderColor: "rgba(59,130,246,0.4)",
  },
  saveButtonSaved: {
    backgroundColor: "rgba(16,185,129,0.2)",
    borderColor: "rgba(16,185,129,0.4)",
  },
  saveText: {
    fontSize: 14,
  },
  saveTextUnsaved: {
    color: "#93c5fd",
  },
  saveTextSaved: {
    color: "#6ee7b7",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  sentenceList: {
    gap: 16,
  },
  sentenceCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
  },
  originalText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    marginBottom: 12,
  },
  fieldBlock: {
    marginBottom: 8,
  },
  labelBlue: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "500",
  },
  labelGreen: {
    color: "#34d399",
    fontSize: 12,
    fontWeight: "500",
  },
  labelAmber: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "500",
  },
  translationText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  structureBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  structureText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontFamily: "monospace",
    lineHeight: 22,
  },
  clausesText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },
  phrasesSection: {
    marginTop: 24,
  },
  phraseList: {
    gap: 8,
  },
  phraseCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  phraseContent: {
    flex: 1,
  },
  phraseEnglish: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  phraseJapanese: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    marginTop: 2,
  },
  noteBadge: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  noteText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  newPhotoButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  newPhotoText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
